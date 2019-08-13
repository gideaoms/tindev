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

    if (targetDev.likes.includes(loggedInDev._id)) {
      const loggedSocket = req.CONNECTED_USERS[user];
      const targetSocket = req.CONNECTED_USERS[devId];

      if (loggedSocket) {
        req.io.to(loggedSocket).emit("match", targetDev);
      }

      if (targetSocket) {
        req.io.to(targetSocket).emit("match", loggedInDev);
      }
    }

    loggedInDev.likes.push(targetDev._id);

    await loggedInDev.save();

    return res.json(loggedInDev);
  }
};
