import { env } from "@/config/env";

export async function sendOtpEmail(toEmail: string, otp: string) {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": env.brevoApiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "MedBot",
          email: env.senderEmail,
        },
        to: [{ email: toEmail }],
        subject: "Your MedBot Verification Code",
        htmlContent: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>MedBot Verification</title>
          </head>
          <body style="margin:0;padding:0;background-color:#0D1B2A;font-family:'Segoe UI',Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0D1B2A;padding:40px 16px;">
              <tr>
                <td align="center">
                  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

                    <!-- Logo -->
                    <tr>
                      <td align="center" style="padding-bottom:32px;">
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="background-color:#0E7A6E;border-radius:8px;width:32px;height:32px;text-align:center;vertical-align:middle;">
                              <span style="color:#ffffff;font-weight:900;font-size:14px;">M</span>
                            </td>
                            <td style="padding-left:10px;vertical-align:middle;">
                              <span style="color:#ffffff;font-weight:700;font-size:16px;letter-spacing:0.5px;">MedBot</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Card -->
                    <tr>
                      <td style="background-color:#112031;border-radius:16px;border:1px solid #1E3448;padding:48px 40px;">

                        <!-- Title -->
                        <p style="margin:0 0 8px 0;font-size:13px;font-weight:600;color:#0E7A6E;letter-spacing:2px;text-transform:uppercase;">Verification</p>
                        <h1 style="margin:0 0 16px 0;font-size:28px;font-weight:800;color:#ffffff;line-height:1.2;">
                          Your verification<br/>code is ready.
                        </h1>
                        <p style="margin:0 0 32px 0;font-size:15px;color:#8A9BB0;line-height:1.6;">
                          Use the code below to verify your MedBot account. It expires in <strong style="color:#ffffff;">10 minutes</strong>.
                        </p>

                        <!-- Divider -->
                        <div style="height:1px;background-color:#1E3448;margin-bottom:32px;"></div>

                        <!-- OTP Code -->
                        <div style="background-color:#0D1B2A;border:1px solid #1E3448;border-radius:12px;padding:28px;text-align:center;margin-bottom:32px;">
                          <p style="margin:0 0 8px 0;font-size:12px;color:#8A9BB0;letter-spacing:2px;text-transform:uppercase;">One-Time Code</p>
                          <p style="margin:0;font-size:42px;font-weight:900;color:#ffffff;letter-spacing:12px;">${otp}</p>
                        </div>

                        <!-- Warning -->
                        <p style="margin:0;font-size:13px;color:#8A9BB0;line-height:1.6;text-align:center;">
                          If you didn't request this code, you can safely ignore this email.<br/>
                          Your account remains secure.
                        </p>

                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td align="center" style="padding-top:28px;">
                        <p style="margin:0;font-size:12px;color:#3D5166;">
                          © 2026 MedBot · AI-powered medical triage
                        </p>
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
      const errorBody = await response.text();
      console.error("Brevo send error:", errorBody);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Brevo send error:", error);
    return false;
  }
}