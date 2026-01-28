import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 24px;">
      <div style="max-width: 520px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); overflow: hidden;">
        
        <div style="background: linear-gradient(135deg, #7c3aed, #6366f1); padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px;">FinSight AI</h1>
          <p style="color: #e9d5ff; margin: 4px 0 0; font-size: 13px;">
            Smarter insights for your money
          </p>
        </div>

        <div style="padding: 24px;">
          <h2 style="color: #0f172a; font-size: 18px; margin-bottom: 8px;">
            Verify your email address
          </h2>

          <p style="color: #334155; font-size: 14px; line-height: 1.6;">
            You're almost ready to start using <strong>FinSight</strong>.
            To keep your account secure, please confirm your email address
            using the verification code below.
          </p>

          <div style="margin: 24px 0; text-align: center;">
            <div style="
              display: inline-block;
              padding: 14px 28px;
              font-size: 24px;
              letter-spacing: 6px;
              font-weight: bold;
              background-color: #f1f5f9;
              border-radius: 8px;
              color: #4f46e5;
            ">
              ${otp}
            </div>
          </div>

          <p style="color: #334155; font-size: 14px; line-height: 1.6;">
            ⏱️ This code is valid for <strong>10 minutes</strong>.
          </p>

          <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin-top: 16px;">
            If you didn’t request this verification, you can safely ignore this email.
            Your account will remain secure.
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

          <p style="color: #64748b; font-size: 12px; line-height: 1.6;">
            Need help? Reach out to us anytime at
            <a href="mailto:support@finsight.ai" style="color: #4f46e5; text-decoration: none;">
              support@finsight.ai
            </a>
          </p>
        </div>
      </div>

      <p style="text-align: center; color: #94a3b8; font-size: 11px; margin-top: 16px;">
        © ${new Date().getFullYear()} FinSight AI. All rights reserved.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"FinSight AI" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your email to continue with FinSight",
      html: htmlTemplate,
    });

    console.log("📧 FinSight OTP email sent successfully");
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    throw error;
  }
};
