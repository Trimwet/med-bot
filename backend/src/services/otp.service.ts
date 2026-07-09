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
          name: "MediChat",
          email: env.senderEmail,
        },
        to: [{ email: toEmail }],
        subject: "Your MediChat Verification Code",
        htmlContent: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>MediChat Verification</h2>
            <p>Your one-time verification code is:</p>
            <h1 style="letter-spacing: 4px;">${otp}</h1>
            <p>This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
          </div>
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
