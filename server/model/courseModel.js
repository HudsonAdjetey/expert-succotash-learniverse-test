const { mongoose } = require("mongoose");

const courseModel = new mongoose.Schema({
  name: { type: String, required: true }, //course title
  description: { type: String, required: true }, //course discription
  duration: { type: String }, //duration of the course in hours
  createdAt: { type: Date, default: Date.now() }, //creation date and time
  link: String,
  price: Number,
  admission: Number,
  monthFee: Number,
  date: Date,
});

// Virtual for bookInstance's URL
courseModel.virtual("url").get(function () {
  return `/catalog/course/${this._id}`;
});

const Course = mongoose.model("class", courseModel);

// Export the Course model
module.exports = Course;
