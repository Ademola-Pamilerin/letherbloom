/**
 * Helper utility to send access code emails to customers via Resend.
 * Reads RESEND_API_KEY or RESENDAPIKEY from process.env.
 */

const sentEmailsCache = new Set<string>();

export async function sendAccessCodeEmail({
  email,
  code,
  planName,
  fullName,
}: {
  email: string;
  code: string;
  planName: string;
  fullName?: string;
}) {
  if (!email || !code) {
    console.log("[Email Helper] Missing email or code, skipping email dispatch.");
    return false;
  }

  const dedupeKey = `${email.toLowerCase()}:${code.toUpperCase()}`;
  if (sentEmailsCache.has(dedupeKey)) {
    console.log(
      `[Email Helper] Email already sent for '${dedupeKey}'. Skipping duplicate send.`
    );
    return true;
  }

  const resendApiKey = process.env.RESEND_API_KEY || process.env.RESENDAPIKEY;

  if (!resendApiKey) {
    console.error(
      `[Email Helper] ERROR: Resend API key (RESEND_API_KEY or RESENDAPIKEY) not found in environment. Could not send code '${code}' to: ${email}`
    );
    return false;
  }

  // Record in deduplication cache before making network call
  sentEmailsCache.add(dedupeKey);

  const recipientName = fullName ? fullName.split(" ")[0] : "Member";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "LetHerBloom <admin@lhbloom.org>",
        to: [email],
        subject: `Your LetHerBloom Live Session Access Code: ${code}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Your LetHerBloom Access Code</title>
            </head>
            <body style="margin:0; padding:0; background-color:#f4f4f5; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout:fixed; background-color:#f4f4f5; padding: 40px 10px;">
                <tr>
                  <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e4e4e7;">
                      
                      <!-- Header -->
                      <tr>
                        <td align="center" style="background: linear-gradient(135deg, #e11d48 0%, #be123c 100%); padding: 36px 30px; text-align: center;">
                          <h1 style="color:#ffffff; font-size:28px; font-weight:800; margin:0; letter-spacing: -0.5px;">LetHerBloom</h1>
                          <p style="color:#fecdd3; font-size:14px; margin:6px 0 0 0; font-weight:500;">Ladies Upper Body Gym & Virtual Gymnastics</p>
                        </td>
                      </tr>

                      <!-- Content -->
                      <tr>
                        <td style="padding: 36px 32px; color: #27272a;">
                          <h2 style="font-size:20px; font-weight:700; margin:0 0 12px 0; color:#18181b;">Welcome, ${recipientName}!</h2>
                          <p style="font-size:15px; line-height:1.6; color:#52525b; margin:0 0 24px 0;">
                            Thank you for joining LetHerBloom! Your subscription for <strong>${planName}</strong> is active. Here is your unique access code for joining our live virtual training sessions:
                          </p>

                          <!-- Access Code Box -->
                          <div style="background-color:#fff1f2; border: 2px dashed #f43f5e; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 28px;">
                            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #be123c; display: block; margin-bottom: 8px;">Your Unique Access Code</span>
                            <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 800; color: #881337; letter-spacing: 3px; display: inline-block;">${code}</span>
                          </div>

                          <p style="font-size:14px; line-height:1.6; color:#52525b; margin:0 0 24px 0;">
                            To join a live class, simply click the button below or navigate to the <strong>Live Training</strong> tab on our website and enter your access code.
                          </p>

                          <!-- CTA Button -->
                          <div style="text-align: center; margin-bottom: 32px;">
                            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lhbloom.org'}/live-training?code=${code}" target="_blank" style="background-color: #e11d48; color: #ffffff; font-size: 16px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 10px; display: inline-block; box-shadow: 0 4px 12px rgba(225, 29, 72, 0.25);">
                              Join Live Session Now →
                            </a>
                          </div>

                          <!-- Additional Info -->
                          <div style="background-color: #fafafa; border-radius: 10px; padding: 16px 20px; font-size: 13px; color: #71717a; border: 1px solid #f4f4f5;">
                            <p style="margin: 0 0 6px 0; font-weight: 600; color: #3f3f46;">Need Help?</p>
                            <p style="margin: 0;">If you have any questions or need assistance accessing your sessions, contact us at <a href="mailto:admin@lhbloom.org" style="color: #e11d48; text-decoration: underline;">admin@lhbloom.org</a> or call (832) 671-2968.</p>
                          </div>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="background-color: #fafafa; padding: 24px 30px; text-align: center; border-top: 1px solid #f4f4f5; font-size: 12px; color: #a1a1aa;">
                          <p style="margin: 0 0 4px 0;">© ${new Date().getFullYear()} LetHerBloom. SugarLand, TX.</p>
                          <p style="margin: 0;">Empower your body with virtual gymnastics and upper body strength training.</p>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error("[Email Helper] Error sending email via Resend:", errData);
      return false;
    }

    console.log(`[Email Helper] Successfully sent access code email to ${email}`);
    return true;
  } catch (error) {
    console.error("[Email Helper] Failed to send email:", error);
    return false;
  }
}
