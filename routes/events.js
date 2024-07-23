const { Router } = require("express");
const router = Router();
// Express validator
const { body, param } = require("express-validator");
// MiddleWares
const { validateFields } = require("../middlewares/validate-fields");
const { validateAuth } = require("../middlewares/validate-auth");
// Controllers
const {
  addNewLink,
  getLinks,
  editLink,
  deleteLink,
} = require("../controllers/events");

router.post(
  "/add-link",
  [
    body("title").trim().notEmpty().withMessage("Title must not be empty!"),
    body("url").trim().isURL().withMessage("URL invalid!"),
    validateFields,
    validateAuth,
  ],
  addNewLink
);

router.get("/get-links", [validateAuth], getLinks);

router.put(
  "/edit-link/:linkId",
  [
    body("title").trim().notEmpty().withMessage("Title must not be empty!"),
    body("url").trim().isURL().withMessage("URL invalid!"),
    param("linkId").notEmpty().withMessage("Incorrect param!"),
    validateFields,
    validateAuth,
  ],
  editLink
);

router.delete(
  "/delete-link/:linkId",
  [
    param("linkId").notEmpty().withMessage("Incorrect param!"),
    validateFields,
    validateAuth,
  ],
  deleteLink
);

module.exports = router;
