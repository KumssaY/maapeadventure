const Adventure = require('../../models/Adventure.model');

exports.createAdventure = async (req, res) => {
  try {
    const adventure = new Adventure(req.body);
    await adventure.save();
    res.status(201).send(adventure);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.updateAdventure = async (req, res) => {
  try {
    const adventure = await Adventure.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!adventure) return res.status(404).send({ message: "Adventure not found" });

    res.status(200).send(adventure);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.deleteAdventure = async (req, res) => {
  try {
    const adventure = await Adventure.findByIdAndDelete(req.params.id);
    if (!adventure) return res.status(404).send({ message: "Adventure not found" });

    res.status(200).send({ message: "Adventure deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.getAllAdventures = async (req, res) => {
  try {
    const adventures = await Adventure.find();
    res.status(200).send(adventures);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.getAdventureById = async (req, res) => {
  try {
    const adventure = await Adventure.findById(req.params.id);
    if (!adventure) return res.status(404).send({ message: "Adventure not found" });
    res.status(200).send(adventure);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.setActiveStatus = async (req, res) => {
  try {
    const adventure = await Adventure.findById(req.params.id);
    if (!adventure) return res.status(404).send({ message: "Adventure not found" });

    adventure.activeOrInactiveAdventure = !adventure.activeOrInactiveAdventure;
    await adventure.save();

    res.status(200).send({ message: `Adventure is now ${adventure.activeOrInactiveAdventure ? 'active' : 'inactive'}` });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};


exports.getAdventureById = async (req, res) => {
  try {
    const adventure = await Adventure.findById(req.params.id);
    if (!adventure) return res.status(404).send({ message: "Adventure not found" });
    res.status(200).send(adventure);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
