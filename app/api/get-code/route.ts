import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import Code from "@/util/code-gen";
import { sendAccessCodeEmail } from "@/util/send-email";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia" as any,
});

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session ID is required" },
      { status: 400 }
    );
  }

  try {
    // 1. Idempotency: Check if this session was already fulfilled
    const { data: existingCodes, error: lookupError } = await supabase
      .from("access_codes")
      .select("code, assigned_to, plan, full_name")
      .eq("checkout_session_id", sessionId)
      .limit(1);

    if (!lookupError && existingCodes && existingCodes.length > 0) {
      // Already fulfilled — just return the code (no duplicate email)
      const codeRecord = existingCodes[0];
      return NextResponse.json({
        code: codeRecord.code,
        email: codeRecord.assigned_to,
      });
    }

    // 2. Retrieve Stripe session to verify payment
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (
      !session ||
      (session.payment_status !== "paid" && session.status !== "complete")
    ) {
      // Payment not yet complete — tell client to retry
      return NextResponse.json({ code: null });
    }

    // Handle Organization Subscriptions
    if (session.metadata?.type === "organization") {
      const organizationName = session.metadata.organizationName;
      const adminEmail = session.metadata.adminEmail;
      const memberEmails = JSON.parse(session.metadata.memberEmails || "[]");
      const durationMonths = parseInt(session.metadata.durationMonths || "12");

      const isRenewal = session.metadata.isRenewal === "true";
      const organizationId = session.metadata.organizationId;

      // Check if org already exists
      let query = supabase.from("organizations").select("id, code, name, admin_email, subscription_end, max_seats");
      if (isRenewal && organizationId) {
        query = query.eq("id", organizationId);
      } else {
        query = query.eq("admin_email", adminEmail).eq("name", organizationName);
      }
      const { data: existingOrg } = await query.maybeSingle();

      if (existingOrg && isRenewal) {
        // Renewal logic
        const currentEnd = new Date(existingOrg.subscription_end || new Date());
        const newEnd = currentEnd > new Date() ? currentEnd : new Date();
        newEnd.setMonth(newEnd.getMonth() + durationMonths);

        await supabase.from("organizations").update({
            is_active: true,
            subscription_end: newEnd.toISOString()
        }).eq("id", existingOrg.id);

        return NextResponse.json({
          code: existingOrg.code,
          email: existingOrg.admin_email,
          isOrganization: true,
          organizationName: existingOrg.name,
        });
      } else if (existingOrg) {
        return NextResponse.json({
          code: existingOrg.code,
          email: existingOrg.admin_email,
          isOrganization: true,
          organizationName: existingOrg.name,
        });
      }

      // Create Organization & Dispatch Credentials Email
      const host = request.headers.get("origin") || "http://localhost:3000";
      const createOrgResponse = await fetch(`${host}/api/organizations/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationName,
          adminEmail,
          memberEmails,
          durationMonths,
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
        }),
      });

      const createOrgData = await createOrgResponse.json();
      if (createOrgData.organization) {
        return NextResponse.json({
          code: createOrgData.organization.code,
          email: adminEmail,
          isOrganization: true,
          organizationName,
          adminPassword: createOrgData.organization.adminPassword,
        });
      }
    }

    // 3. Extract metadata for individual sessions
    const planName = session.metadata?.planName || "Training Plan";
    const email =
      session.customer_details?.email || session.customer_email || null;
    const fullName = session.metadata?.fullName || null;
    const phone = session.metadata?.phone || null;
    const age = session.metadata?.age || null;
    const address = session.metadata?.address || null;
    const signature = session.metadata?.signature || null;
    const renewCode = session.metadata?.renewCode || null;

    // Calculate expiration
    let expVal = 1;
    if (planName === "Premium") expVal = 3;
    if (planName === "Elite" || planName === "Personal Training") {
      expVal = parseInt(session.metadata?.durationMonths || "1");
    }

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + expVal);

    let finalCode: string;
    let isRenewal = false;

    // 4. Renewal path: if renewCode is set, find and extend that code
    if (renewCode && renewCode.trim() !== "") {
      const { data: existingUserCode } = await supabase
        .from("access_codes")
        .select("id, code")
        .ilike("code", renewCode.trim())
        .limit(1)
        .maybeSingle();

      if (existingUserCode) {
        isRenewal = true;
        finalCode = existingUserCode.code;

        const { error: renewError } = await supabase
          .from("access_codes")
          .update({
            is_active: true,
            plan: planName,
            expires_at: expiresAt.toISOString(),
            checkout_session_id: sessionId,
            full_name: fullName || undefined,
            phone: phone || undefined,
            age: age || undefined,
            address: address || undefined,
            signature: signature || undefined,
          })
          .eq("id", existingUserCode.id);

        if (renewError) {
          console.error("[get-code] Failed to renew code:", renewError);
        } else {
          console.log(`[get-code] Successfully renewed code ${finalCode} for ${email}`);
        }
      } else {
        finalCode = Code();
      }
    } else {
      // 5. Check if user already has a code for this email (auto-renewal by email)
      if (email && email.trim() !== "") {
        const { data: existingUserCode } = await supabase
          .from("access_codes")
          .select("id, code")
          .ilike("assigned_to", email.trim())
          .eq("is_organization", false)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (existingUserCode) {
          isRenewal = true;
          finalCode = existingUserCode.code;

          const { error: renewError } = await supabase
            .from("access_codes")
            .update({
              is_active: true,
              plan: planName,
              expires_at: expiresAt.toISOString(),
              checkout_session_id: sessionId,
              full_name: fullName || undefined,
              phone: phone || undefined,
              age: age || undefined,
              address: address || undefined,
              signature: signature || undefined,
            })
            .eq("id", existingUserCode.id);

          if (renewError) {
            console.error("[get-code] Failed to renew code by email:", renewError);
          } else {
            console.log(`[get-code] Successfully renewed code ${finalCode} for ${email} by email lookup`);
          }
        } else {
          finalCode = Code();
        }
      } else {
        finalCode = Code();
      }
    }

    // 6. If not a renewal, insert a new code
    if (!isRenewal) {
      const { error: insertError } = await supabase
        .from("access_codes")
        .insert({
          code: finalCode,
          is_active: true,
          assigned_to: email,
          expires_at: expiresAt.toISOString(),
          checkout_session_id: sessionId,
          plan: planName,
          is_organization: false,
          full_name: fullName,
          phone: phone,
          age: age,
          address: address,
          signature: signature,
        });

      if (insertError) {
        console.error("[get-code] Insert failed:", insertError);
        // Race condition — maybe another request inserted just now
        const { data: retryCodes } = await supabase
          .from("access_codes")
          .select("code, assigned_to")
          .eq("checkout_session_id", sessionId)
          .limit(1);

        if (retryCodes && retryCodes.length > 0) {
          return NextResponse.json({
            code: retryCodes[0].code,
            email: retryCodes[0].assigned_to,
          });
        }

        return NextResponse.json(
          { error: "Failed to save code" },
          { status: 500 }
        );
      }
    }

    // 7. Send email (once — deduplication handled inside sendAccessCodeEmail)
    if (email) {
      await sendAccessCodeEmail({
        email,
        code: finalCode,
        planName,
        fullName: fullName || undefined,
        isRenewal,
      });
    }

    return NextResponse.json({
      code: finalCode,
      email,
      isRenewal,
    });
  } catch (err: any) {
    console.error("[API/get-code] Internal Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
