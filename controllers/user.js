const { response } = require("express");
const User = require("../models/User");

const getUser = async (req, res = response) => {
  const { username } = req.params;

  try {
    const findUser = await User.findOne({ username }).populate("links");

    if (!findUser) return res.status(401).json({
        ok: false,
        msg: 'User not found!'
    })
      return res.json({
        ok: true,
        msg: "Everything ok",
        username: findUser.username,
        links: findUser.links,
      });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: "There is an error, please",
    });
  }
};

module.exports = { getUser };
