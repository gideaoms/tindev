const DevModel = require("../models/DevModel");

module.exports = {
  async store(req, res) {
    const { user } = req.headers;
    const { devId } = req.params;

    const loggedInDev = await DevModel.findById(user);
    const targetDev = await DevModel.findById(devId);

    if (!targetDev) {
      return res.status(400).json({ error: "Dev not exists" });
    }

    loggedInDev.dislikes.push(targetDev._id);

    await loggedInDev.save();

    return res.json(loggedInDev);
  }
};
