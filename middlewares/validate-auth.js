const { response } = require("express");
const jwt = require("jsonwebtoken");

const validateAuth = async (req, res = response, next) => {
  try {
    // Headers
    const authorization = req.headers.authorization;
    //   "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NjcxODk2OTNmOTBhNjA5ZmIxYjA1ZjIiLCJ1c2VybmFtZSI6ImpvYW5jaXRvIiwiaWF0IjoxNzE4ODA0Nzk4LCJleHAiOjE3MTg4MDQ3OTh9.bb3gwPoiTxhxZGB7vw7QO2xItt5xkYiTHhSh9ANpeFc"; //req.headers.authorization;
    const bearer = authorization.includes('Bearer');
    const token = authorization.split(" ")[1];

    if (!authorization)
      return res.status(401).json({
        ok: false,
        msg: "Token unauthorized!",
      });
    // Verify if token includes bearer and code
    if (!bearer || !token)
      return res.status(401).json({
        ok: false,
        msg: "Invalid token!",
      });
   
    // Verify jwt
    const { uid, username, iat, exp } = jwt.verify(token, process.env.PRIVATE_KEY);
    req.uid = uid;
    req.username = username;

  } catch (error) {
    console.log(error.name, 'error')
    if(error.name === 'JsonWebTokenError')
    return res.status(400).json({
      ok: false,
      msg: error.message,
    });

    return res.status(400).json({
      ok: false,
      msg: error.message,
    });

  }
  next();
};

module.exports = { validateAuth };

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NjcxODk2OTNmOTBhNjA5ZmIxYjA1ZjIiLCJ1c2VybmFtZSI6ImpvYW5jaXRvIiwiaWF0IjoxNzE4NzE4Mzk4LCJleHAiOjE3MTg4MDQ3OTh9.QQyfiz-bA_BKOTz-Pmk-RVL2GoKC240hHsWnvc1_uR4
