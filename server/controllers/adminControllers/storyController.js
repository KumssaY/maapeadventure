const Story = require('../../models/Story.model');

exports.getAllStories = async (req, res) => {
  try {
    const approvedStories = await Story.find({ isApproved: true }).populate('user').populate('adventure');
    const unapprovedStories = await Story.find({ isApproved: false }).populate('user').populate('adventure');
    res.json({ approvedStories, unapprovedStories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).populate('user').populate('adventure');
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    story.isApproved = true;
    await story.save();
    res.json({ message: 'Story approved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.unapproveStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    story.isApproved = false;
    await story.save();
    res.json({ message: 'Story unapproved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
