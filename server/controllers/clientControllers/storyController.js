const Story = require('../../models/Story.model');
const mongoose = require('mongoose');

exports.getAllApprovedStories = async (req, res) => {
  try {
    const stories = await Story.find({ isApproved: true }).populate('user').populate('adventure');
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUnapprovedStories = async (req, res) => {
  try {
    console.log("req.user:", req.user);  // Log the user object

    // Check if req.user._id exists and is a valid ObjectId
    if (!req.user || !req.user._id || !mongoose.Types.ObjectId.isValid(req.user._id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Log the type and value of req.user._id
    console.log("User ID type:", typeof req.user._id);
    console.log("User ID value:", req.user._id);

    const stories = await Story.find({ 
      isApproved: false, 
      user: new mongoose.Types.ObjectId(req.user._id) 
    })
    .populate('user')
    .populate('adventure');
    
    res.json(stories);
  } catch (err) {
    console.error("Error fetching unapproved stories:", err);  // Log the error
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUserApprovedStories = async (req, res) => {
  try {
    console.log("req.user:", req.user);  // Log the user object

    // Check if req.user._id exists and is a valid ObjectId
    if (!req.user || !req.user._id || !mongoose.Types.ObjectId.isValid(req.user._id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Log the type and value of req.user._id
    console.log("User ID type:", typeof req.user._id);
    console.log("User ID value:", req.user._id);

    const stories = await Story.find({ 
      isApproved: true, 
      user: new mongoose.Types.ObjectId(req.user._id) 
    })
    .populate('user')
    .populate('adventure');

    res.json(stories);
  } catch (err) {
    console.error("Error fetching approved stories:", err);  // Log the error
    res.status(500).json({ message: err.message });
  }
};

exports.getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).populate('user').populate('adventure');
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    if (!story.isApproved && (!req.user || story.user._id.toString() !== req.user._id.toString())) {
      return res.status(404).json({ message: 'Story not found or access denied' });
    }
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createStory = async (req, res) => {
  try {
    const story = new Story({
      user: req.user._id,
      adventure: req.body.adventure,
      title: req.body.title,
      content: req.body.content,
      images: req.body.images,
      isApproved: false
    });
    const newStory = await story.save();
    res.status(201).json(newStory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteStory = async (req, res) => {
  try {
    console.log(req.params._id);
    const story = await Story.findById(req.params.id);
    if (!story || story.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }
    console.log(story)
    await story.deleteOne({id: req.params.id});
    res.status(200).json({ message: 'Story deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

exports.getUnapprovedStoryById = async (req, res) => {
  try {
    const story = await Story.findOne({ _id: req.params.id, isApproved: false, user: req.user._id }).populate('user').populate('adventure');
    if (!story) {
      return res.status(404).json({ message: 'Story not found or access denied' });
    }
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getApprovedStoryById = async (req, res) => {
  try {
    const story = await Story.findOne({ _id: req.params.id, isApproved: true }).populate('user').populate('adventure');
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
