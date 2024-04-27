const asyncHandler = require("express-async-handler");
const UserModel = require("../model/userModel");
const RegisteredCoursesModel = require("../model/registeredCourse");
const CourseModel = require("../model/courseModel");
const ScheduleModel = require("../model/scheduleModel");

/* ALL STUDENTS */
const fetchAllStudents = asyncHandler(async (req, res) => {
  // find the user

  const findLoggerUser = await UserModel.findOne({ _id: req.user.id });

  if (!findLoggerUser) {
    return res.status(200);
  }

  const students = await UserModel.find();

  if (students.length === 0 || !students) {
    throw new Error("No student found");
  }
  const registeredCoursesStudents = await RegisteredCoursesModel.find();
  let finalData = [];
  let indexValue = 0;
  registeredCoursesStudents.forEach((item) => {
    students.forEach((std) => {
      if (std._id.toString() === item.userID.toString()) {
        item.courses.forEach((cr) => {
          const obj = {
            firstName: std.firstName,
            lastName: std.lastName,
            subscriptionEnd: cr.expiryDate,
            subscription: cr.currentDate,
            status: true,
            courseName: [cr.name].join(", "),
            index: cr._id,
            email: std.email,
            contact: std.contact,
            verified: item.verified,
            indexId: std._id,
          };
          finalData.push(obj);
        });
      }
    });
  });
  res.status(201).json({ success: true, data: finalData });
});
/* ALL STUDENTS */

/* ADMIN ROLE NEEDED -- SUSPEND USER */
const suspendOrUnsuspendStudent = asyncHandler(async (req, res) => {
  // Check if the user is an "Admin"
  const checkForAdmin = await UserModel.findOne({
    _id: req.user.id,
    role: "Admin",
  });

  if (!checkForAdmin) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to perform this action.",
    });
  }

  // Check for the student's course verification status
  const isStudentCourseActive = await RegisteredCoursesModel.findOne({
    userID: req.params.userId,
  });

  if (!isStudentCourseActive) {
    return res.status(404).json({
      success: false,
      message: "User does not have any active courses.",
    });
  }

  // Toggle the verification status based on the current status
  const updatedVerificationStatus = !isStudentCourseActive.verified;

  // Update the verification status for the student's courses
  await RegisteredCoursesModel.updateOne(
    { userID: req.params.userId },
    { $set: { verified: updatedVerificationStatus } }
  );

  res.status(201).json({
    success: true,
    data: updatedVerificationStatus ? "User unsuspended." : "User suspended.",
    state: updatedVerificationStatus ? true : false,
  });
});
/* ADMIN ROLE NEEDED -- SUSPEND USER */

/* REGISTERING CLASS ==> REGISTERED MODEL */
const registerCourse = asyncHandler(async (req, res) => {
  const userID = req.user.id;

  // Check if the user exists in the database
  const findUser = await UserModel.findOne({ _id: userID });
  if (!findUser) {
    return res.status(404).json({ message: "No such user found" });
  }

  const fetchAllClasses = await CourseModel.find();
  let registeredCourses = [];

  // Retrieve courses from request body and find matching classes
  if (req.body.courses && fetchAllClasses.length > 0) {
    req.body.courses.forEach((item) => {
      const foundClass = fetchAllClasses.find(
        (cla) => item.name.toLowerCase() === cla.name.toLowerCase()
      );

      if (foundClass) {
        item.id = foundClass._id;
        item.link = foundClass.link;
        item.price = foundClass.price;
        item.description = foundClass.description;
        item.duration = foundClass.duration;
        item.time = foundClass.time;
        item.date = foundClass.date;
      }

      registeredCourses.push(item);
    });
  }

  // Get the existing document for the user
  let existingUserCourses = await RegisteredCoursesModel.findOne({ userID });

  if (!existingUserCourses) {
    // If no document exists for the user, create a new one
    existingUserCourses = new RegisteredCoursesModel({
      userID,
      verified: true,
      courses: registeredCourses.map((item) => ({
        ...item,
        currentDate: new Date(),
        expiryDate: calculateExpiryDate(req.body.month),
      })),
    });

    await existingUserCourses.save();
  } else {
    // Check if the user is already registered for any active course in the request
    const activeCourses = existingUserCourses.courses.filter((course) =>
      registeredCourses.some(
        (item) =>
          item.name.toLowerCase() === course.name.toLowerCase() &&
          new Date() < new Date(course.expiryDate)
      )
    );

    if (activeCourses.length > 0) {
      return res.status(400).json({
        message: "User is already registered for an active course",
        activeCourses,
      });
    }

    // If no active course found, add the new courses to the existing document
    existingUserCourses.courses = [
      ...existingUserCourses.courses,
      ...registeredCourses.map((item) => ({
        ...item,
        currentDate: new Date(),
        expiryDate: calculateExpiryDate(req.body.month),
      })),
    ];

    await existingUserCourses.save();
  }

  return res.status(201).json({
    message: "Courses registered successfully",
  });
});
/* REGISTERING CLASS ==> REGISTERED MODEL */

/* EDIT STUDENTS == ADMIN ROLE REQUIRED */
const editStudent = asyncHandler(async (req, res) => {
  const isAdmin = await UserModel.findOne({ _id: req.user.id, role: "Admin" });

  if (!isAdmin) {
    return res.status(403).json({
      message: "You are not authorized to perform this action.",
    });
  }

  const studentId = req.params.id;
  const updatedInfo = req.body;

  let student = await RegisteredCoursesModel.findOne({ userID: studentId });

  if (!student) {
    return res.status(404).json({ message: "No student with given ID found!" });
  }

  if (updatedInfo.hasOwnProperty("subscriptionEnd")) {
    const courseIdToUpdate = req.body.id;
    const updatedExpiryDate = new Date(req.body.subscriptionEnd);

    student.courses.forEach((cr) => {
      if (cr.id.toString() === courseIdToUpdate) {
        cr.expiryDate = updatedExpiryDate;
      }
    });
  }

  try {
    const update = await student.save();
    res.status(200).json({
      message: "Updated",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Error updating student information." });
  }
});
/* EDIT STUDENTS == ADMIN ROLE REQUIRED */

// Function to calculate expiry date based on months
const calculateExpiryDate = (months) => {
  let expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + months);
  return expiryDate;
};
// Function to calculate expiry date based on months

/* STUDENT UNSUBSCRIBE == DEPRECATED */
const cancelClass = asyncHandler(async (req, res) => {
  // find the class ID to be deleted or cancel
  const { id } = req.params;
  const userID = req.user.id;

  const user = await UserModel.findOne({ _id: userID, role: "Student" });

  if (!user) {
    return res.status(401).send("User not found");
  }

  const registeredCourse = await RegisteredCoursesModel.findOne({
    userID: userID,
  });

  if (registeredCourse) {
    const updated = registeredCourse.courses.filter(
      (item) => String(item.id) !== String(id)
    );
    registeredCourse.courses = updated;

    await registeredCourse.save();

    res.status(200).json({
      success: true,
      data: "This Class has been canceled",
    });
  }
  res.status(404).json({
    error: "No such class found in your registered classes.",
  });
});
/* STUDENT UNSUBSCRIBE */

/* EXPIRY CLASSES -- DEPRECATED */
const expiryClasses = asyncHandler(async (req, res) => {
  const registered = await RegisteredCoursesModel.findOne({
    userID: req.params.id,
  });

  if (!registered) {
    return res
      .status(403)
      .json({ error: "You are not a student or no registered courses found." });
  }

  // Filter and remove expired courses
  const expiredCourses = registered.courses.filter(
    (item) => new Date() > item.expiryDate
  );

  if (expiredCourses.length > 0) {
    // Extract the IDs of expired courses to remove from RegisteredCoursesModel
    const expiredCourseIds = expiredCourses.map((item) => item.id);

    // Remove expired courses from RegisteredCoursesModel
    await RegisteredCoursesModel.updateOne(
      { userID: req.user.id },
      { $pull: { courses: { id: { $in: expiredCourseIds } } } }
    );

    // You can also remove the expired courses from CourseModel (if needed)
    /* await CourseModel.deleteMany({ _id: { $in: expiredCourseIds } }); */
  }
  if (expiredCourses.length == 0) {
    return res.status(200).json({
      message: "There is no expired course for this user.",
    });
  }
  return res.status(200).json({
    message: "Expired Courses have been removed from your account.",
  });
});
/* EXPIRY CLASSES -- DEPRECATED */

/* INDIVIDUAL'S ACTIVE REGISTERED CLASS */
const indClass = asyncHandler(async (req, res) => {
  const registered = await RegisteredCoursesModel.findOne({
    userID: req.user.id,
  });

  if (!registered) {
    return res.status(403).json({
      error: "You are not a student or no registered courses found.",
    });
  }

  // Filter and remove expired courses
  const expiredCourses = registered.courses.filter(
    (item) => new Date() > item.expiryDate
  );

  if (expiredCourses.length > 0) {
    const expiredCourseIds = expiredCourses.map((item) => item.id);

    // Remove expired courses from RegisteredCoursesModel
    await RegisteredCoursesModel.updateOne(
      { userID: req.user.id },
      { $pull: { courses: { id: { $in: expiredCourseIds } } } }
    );
  }

  // Fetch active courses after removing expired ones
  let activeRegistered = await RegisteredCoursesModel.findOne({
    userID: req.user.id,
    verified: true,
  });

  if (!activeRegistered || !activeRegistered.courses) {
    return res.status(404).json({
      message:
        !activeRegistered || !activeRegistered.verified
          ? "Your account is suspended"
          : "No active courses found for the user.",
    });
  }

  const result = [];
  const infoFromSchedule = await ScheduleModel.find();

  activeRegistered.courses.forEach((item) => {
    const scheduleInfo = infoFromSchedule.find(
      (content) =>
        item.name.toLowerCase() === content.className.toLowerCase() &&
        new Date() < item.expiryDate // Check if the course is not expired
    );

    if (scheduleInfo) {
      const obj = {
        courseName: scheduleInfo.className,
        time: scheduleInfo.time,
        courseTitle: scheduleInfo.courseTitle,
        date: scheduleInfo.date,
        whatsAppLink: scheduleInfo.whatsAppLink,
        courseLink: scheduleInfo.courseLink,
      };
      result.push(obj);
    } else {
      // If schedule info is not available, push the existing course information
      result.push(item);
    }
  });

  if (result.length === 0) {
    return res.status(404).json({
      message: "No active courses found for the user.",
    });
  }

  res.status(200).json({
    data: result,
  });
});

/* INDIVIDUAL'S ACTIVE REGISTERED CLASS */

module.exports = {
  registerCourse,
  cancelClass,
  expiryClasses,
  indClass,
  fetchAllStudents,
  suspendOrUnsuspendStudent,
  editStudent,
};
