const { Router } = require("express");
const router = Router();
const {
  createNewUser,
  loginUser,
  verifyUser,
  checkEmailToChangePassword,
  changePassword,
  validateUserSession,
} = require("../controllers/auth");
const { body, check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");
const { validateAuth } = require("../middlewares/validate-auth");

router.post(
  "/new",
  [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username obligatory!")
      .isLength(4)
      .withMessage("Must have more than 4 characters"),
    body("email").trim().isEmail().withMessage("Email incorrect!"),
    body("password").trim().isLength(8).withMessage("Password incorrect!"),
    body("matchPassword")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Both passwords must be equals!"),
    validateFields,
  ],
  createNewUser
);

router.post(
  "/",
  [
    body("email").trim().isEmail().withMessage("Email incorrect!"),
    body("password").trim().isLength(8).withMessage("Password incorrect!"),
    validateFields,
  ],
  loginUser
);

router.get("/verify-user/:token", verifyUser);

router.put(
  "/check-email",
  [
    body("email").trim().isEmail().withMessage("Email incorrect!"),
    validateFields,
  ],
  checkEmailToChangePassword
);

router.put(
  "/change-password/:token",
  [
    body("password").trim().isLength(8).withMessage("Password incorrect!"),
    body("matchPassword").custom((value, { req }) => value === req.body.password ).withMessage('Both passwords must be equals!'),
    validateFields
  ],
  changePassword
);

router.get("/validate-session", validateAuth, validateUserSession);

module.exports = router;
