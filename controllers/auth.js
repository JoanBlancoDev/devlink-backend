const { response } = require("express");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
// HELPERS
const {
  sendEmail,
  sendEmailToChangePassword,
} = require("../helpers/send-email");
const { generateJWT } = require("../helpers/generate-jwt");
const { generateRandomToken } = require("../helpers/generate-random-token");
// MODELS
const User = require("../models/User");

// Controllers AUTH

// Create a new user by email, username and password
const createNewUser = async (req, res = response) => {
  const { username, email, password, matchPassword } = req.body;

  try {
    // DB Interaction
    const user = (await User.findOne({ email })) || User.findOne({ username });
    // Check user existing by email
    if (user.email === email)
      return res.status(400).json({
        ok: false,
        msg: "User already exists!",
      });

    // Check user has an username used
    if (user.username === username)
      return res.status(400).json({
        ok: false,
        msg: "Username already used, try with another",
      });

    // Check user existing by username
    const searchUsername = await User.findOne({ username });

    if (searchUsername)
      return res.status(400).json({
        ok: false,
        msg: "Username already used!",
      });

    // Create a new user
    const newUser = new User({ username, email, password });

    // Generate a random token to verify it
    const token = await generateRandomToken();

    // Add token to verify user
    newUser.token = token;

    // Encrypt password
    const salt = genSaltSync();
    newUser.password = hashSync(password, salt);

    // Saving new User
    await newUser.save();

    // Send an email to verify user with nodemailer
    const { ok } = await sendEmail({ username, email, token });

    return res.status(201).json({
      ok,
      uid: newUser._id,
      username: username,
      msg: "Created correctly, please check your email out to verify your account!",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "There is an error, talk with the admin",
    });
  }
};

// Login in with email and password
const loginUser = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    // Verify if user exist
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({
        ok: false,
        msg: "Email or password incorrect!",
      });

    // Compare passwords
    const match = compareSync(password, user.password);
    if (!match)
      return res.status(400).json({
        ok: false,
        msg: "Password or email incorrect!",
      });

    // Check out the user verification
    if (!user.verified)
      return res.status(401).json({
        ok: false,
        msg: "Your account is not verified, check out your email!",
      });

    // Generate token
    const token = await generateJWT({ username: user.username, uid: user._id });

    return res.json({
      ok: true,
      username: user.username,
      uid: user._id,
      token,
      msg: "Logged succesfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: "There is an error, talk with the admin",
    });
  }
};

// Verify an account using a random token with crypto
const verifyUser = async (req, res = response) => {
  const { token } = req.params;

  try {
    // Find user
    const user = await User.findOne({ token });

    if (!user)
      return res.status(401).json({
        ok: false,
        msg: "Invalid token!",
      });

    if (user?.verified) return res.status(401).json({
      ok: false,
      msg: "You already are verified!",
    }); 
    user.token = null;
    user.verified = true;

    await user.save();

    return res.json({
      ok: true,
      msg: "User verified correctly",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "There is an error, talk with the admin",
    });
  }
};

// Verify email existence and send email to change password
const checkEmailToChangePassword = async (req, res = response) => {
  const { email } = req.body;

  try {
    // Find user by email
    const findUser = await User.findOne({ email });

    // Verify user
    if (!findUser)
      return res.status(400).json({
        ok: false,
        msg: "User no exist!",
      });

    if (!findUser.verified)
      return res.status(400).json({
        ok: false,
        msg: "The user is not verified, please check out your email",
      });

    // Generate random token
    const token = await generateRandomToken();

    // Update user found
    findUser.token = token;
    await findUser.save();

    // Send an email
    const { ok } = await sendEmailToChangePassword({
      username: findUser.username,
      email: findUser.email,
      token: token,
    });

    return res.json({
      ok,
      msg: "Check out your email to change your password",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: "There is an error, talk with the admin",
    });
  }
};

// Change password
const changePassword = async (req, res = response) => {
  const { password, matchPassword } = req.body;
  const { token } = req.params;

  try {
    // Find user by Token
    const findUserByToken = await User.findOne({ token });

    if (!token || !findUserByToken)
      return res.status(401).json({
        ok: false,
        msg: "Invalid token!",
      });


    // Encrypt password and Save changed password
    const salt = genSaltSync();
    const passwordHash = hashSync(password, salt);
    // Edit user
    const userPasswordEdited = await User.findOneAndUpdate(
      findUserByToken._id,
      { password: passwordHash, token: null },
      { returnOriginal: false }
    );

    return res.json({
      ok: true,
      msg: 'Password changed succesfully!'
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: "There is an error, talk with the admin",
    });
  }
};


// Validate authentication with token

const validateUserSession = async (req, res = response) => {
  const { username, uid } = req;
  const token = req.headers.authorization.split(" ")[1];
  try {
    return res.json({
      username,
      uid,
      token
    })
    
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: "There is an error, talk with the admin",
    });
  }
}  
module.exports = {
  createNewUser,
  loginUser,
  verifyUser,
  checkEmailToChangePassword,
  changePassword,
  validateUserSession
};
