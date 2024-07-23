const { transporter } = require("../config/mailer");

const sendEmail = async ({username, email, token}) => {
  try {
    const info = await transporter.sendMail({
      from: "DevLink 👻", // sender address
      to: email, // list of receivers
      subject: "Verify User", // Subject line
      html: `
            <h1>Verify User</h1>
            <p>Hello <b>${username}</b> to verify your account you must click on this link <a href="${process.env.FRONTEND_HOST}/auth/verify-user/${token}">Click here</a></p>
            <p>If you didn't create an account on DevLink, please ignore this</p>
            
            `, // html body
    });
    return { 
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      msg: 'Email could not be sent',
    };
  }
};

const sendEmailToChangePassword = async ({username, email, token}) => {
  try {
    const info = await transporter.sendMail({
      from: "DevLink 👻", // sender address
      to: email, // list of receivers
      subject: "Change Password", // Subject line
      html: `
            <h1>Change your password</h1>
            <p>Hello <b>${username}</b> to change your password you must click on this link <a href="${process.env.FRONTEND_HOST}/auth/change-password/${token}">Click here</a></p>
            <p>If you didn't request change it, please ignore this</p>
            
            `, // html body
    });
    return { 
      ok: true,
    };

  } catch (error) {
    return {
      ok: false,
      msg: 'Email could not be sent',
    };
  }
};

module.exports = { sendEmail, sendEmailToChangePassword };
