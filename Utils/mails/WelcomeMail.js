const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODEMAILER_MAIL,
        pass: process.env.NODEMAILER_PASSWORD,
    },
});

const WelcomeMail = async (to, name, platformLink) => {
    const subject = "Welcome to DevArena!";
    const html = ` 
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
          <div style="background-color: #1e40af; padding: 20px; color: #ffffff; text-align: center;">
            <h2 style="margin: 0;">Dev Arena</h2>
          </div>
          <div style="padding: 30px;">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Welcome to <strong>Dev Arena</strong>! Your email has been successfully verified.</p>
            <p>We're thrilled to have you on board. Dive into the platform and start exploring exciting dev content, connect with other developers, and grow your skills.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${platformLink}" target="_blank" style="
                background-color: #1e40af;
                color: #ffffff;
                padding: 14px 28px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
                display: inline-block;
              ">Visit DevArena</a>
            </div>
            <p>If you have any questions or need support, feel free to reach out.</p>
            <p>Happy coding!<br/>The Dev Arena Team</p>
          </div>
          <div style="background-color: #f9f9f9; padding: 15px; font-size: 12px; color: #555; text-align: center;">
            &copy; ${new Date().getFullYear()} Dev Arena. All rights reserved.
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
        from: `DevArena <${process.env.NODEMAILER_MAIL}>`,
        to,
        subject,
        html,
    });
};

module.exports = WelcomeMail;
