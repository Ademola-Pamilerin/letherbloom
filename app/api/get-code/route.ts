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
    // 1. Check if the code already exists in Supabase
    const { data: codes, error } = await supabase
      .from("access_codes")
      .select("code, assigned_to, plan, full_name")
      .eq("checkout_session_id", sessionId)
      .limit(1);

    if (!error && codes && codes.length > 0) {
      const codeRecord = codes[0];
      if (codeRecord.assigned_to) {
        await sendAccessCodeEmail({
          email: codeRecord.assigned_to,
          code: codeRecord.code,
          planName: codeRecord.plan || "Training Plan",
          fullName: codeRecord.full_name || undefined,
        });
      }
      return NextResponse.json({
        code: codeRecord.code,
        email: codeRecord.assigned_to,
      });
    }

    // 2. Fallback: If webhook hasn't processed yet, retrieve session directly from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (
      session &&
      (session.payment_status === "paid" || session.status === "complete")
    ) {
      const planName = session.metadata?.planName || "Training Plan";
      const email =
        session.customer_details?.email || session.customer_email || null;
      const fullName = session.metadata?.fullName || null;
      const phone = session.metadata?.phone || null;
      const age = session.metadata?.age || null;
      const address = session.metadata?.address || null;
      const signature = session.metadata?.signature || null;

      // Calculate expiration
      let expVal = 1;
      if (planName === "Premium") expVal = 3;
      if (planName === "Elite" || planName === "Personal Training") {
        expVal = parseInt(session.metadata?.durationMonths || "1");
      }

      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + expVal);

      const generatedCode = Code();

      // Insert directly into Supabase
      const { data: inserted, error: insertError } = await supabase
        .from("access_codes")
        .insert({
          code: generatedCode,
          is_active: true,
          assigned_to: email,
          expires_at: expiresAt.toISOString(),
          checkout_session_id: session.id,
          plan: planName,
          is_organization: false,
          full_name: fullName,
          phone: phone,
          age: age,
          address: address,
          signature: signature,
        })
        .select()
        .single();

      if (!insertError && inserted) {
        if (inserted.assigned_to) {
          await sendAccessCodeEmail({
            email: inserted.assigned_to,
            code: inserted.code,
            planName: inserted.plan || planName,
            fullName: inserted.full_name || fullName || undefined,
          });
        }
        return NextResponse.json({
          code: inserted.code,
          email: inserted.assigned_to,
        });
      }

      // If insert failed due to race condition (webhook inserted just now), fetch again
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

      return NextResponse.json({ code: generatedCode, email });
    }

    return NextResponse.json({ code: null });
  } catch (err: any) {
    console.error("[API/get-code] Internal Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
