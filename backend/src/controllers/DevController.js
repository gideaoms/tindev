const axios = require("axios");
const DevModel = require("../models/DevModel");

const findOneDev = DevModel => {
  return username => DevModel.findOne({ user: username });
};

module.exports = {
  async index(req, res) {
    const { user } = req.headers;

    const loggedInDev = await DevModel.findById(user);

    const users = await DevModel.find({
      $and: [
        { _id: { $ne: user } },
        { _id: { $nin: loggedInDev.likes } },
        { _id: { $nin: loggedInDev.dislikes } }
      ]
    });

    return res.json(users);
  },
  async store(req, res) {
    const { username } = req.body;

    const devFound = await findOneDev(DevModel)(username);
    if (devFound) return res.json(devFound);

    const result = await axios.get(`https://api.github.com/users/${username}`);

    const { name, bio, avatar_url: avatar } = result.data;

    const dev = await DevModel.create({
      name,
      user: username,
      bio,
      avatar
    });

    return res.json(dev);
  }
};
