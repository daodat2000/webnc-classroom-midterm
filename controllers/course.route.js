const express = require('express');
const router = express.Router();
const Course = require('../models/courses.models');
const mongoose = require('mongoose');
const verifyToken = require('../middlewares/auth.mdw');
const EnrollMent = require('../models/enrollments.models');
const nodemailer = require('nodemailer');
const usersModels = require('../models/users.models');

router.get('/', verifyToken, async function (req, res) {
  const enrolls = await EnrollMent.find({ userId: req.userId });
  const courses = await Promise.all(
    enrolls.map(async (enroll) => {
      const course = await Course.find({
        _id: mongoose.Types.ObjectId(enroll.courseId),
      });
      return course[0];
    })
  );
  res.json({ courses });
});

router.get('/members/:courseId', verifyToken, async function (req, res) {
  const { courseId } = req.params;
  const teachers = await EnrollMent.find({
    courseId: courseId,
    role: 'Teacher',
  });
  const students = await EnrollMent.find({
    courseId: courseId,
    role: 'Student',
  });
  const userTeachers = await Promise.all(
    teachers.map(async (teacher) => {
      const user = await usersModels.find({
        _id: mongoose.Types.ObjectId(teacher.userId),
      });
      return user[0];
    })
  );
  const userStudents = await Promise.all(
    students.map(async (student) => {
      const user = await usersModels.find({
        _id: mongoose.Types.ObjectId(student.userId),
      });
      return user[0];
    })
  );
  res.json({ teachers: userTeachers, students: userStudents });
});

router.get('/join/:courseId', verifyToken, async function (req, res) {
  const { role } = req.query;
  const { courseId } = req.params;
  if (courseId.length != 24) {
    return res.status(400).json({ message: 'courseId not invalid' });
  }
  const course = await Course.find(
    {
      _id: mongoose.Types.ObjectId(courseId),
    },
    { _id: 1 }
  );
  if (course.length == 0) {
    return res.status(400).json({ message: 'cannot find course' });
  }
  const enrollment = await EnrollMent.find({
    userId: req.userId,
    courseId: course[0],
  });
  if (enrollment.length > 0) {
    return res.status(400).json({ message: 'You enrolled in the course' });
  }
  const newEnrollment = new EnrollMent({
    courseId: course[0]._id,
    userId: req.userId,
    role: role == 'teacher' ? 'Teacher' : 'Student',
  });
  await newEnrollment.save();
  return res.json({
    message: 'Enroll course successfully',
  });
});

router.post('/invite/', verifyToken, async function (req, res) {
  const { courseId, email, role } = req.body;

  if (courseId.length != 24) {
    return res.status(400).json({ message: 'courseId not invalid' });
  }
  const course = await Course.find({
    _id: mongoose.Types.ObjectId(courseId),
  });
  if (course.length == 0) {
    return res.status(400).json({ message: 'cannot find course' });
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'webnc.classroom@gmail.com',
      pass: 'Daodat2000',
    },
  });
  const { URL_ClIENT } = process.env;
  const mailOptions = {
    from: 'webnc.classroom@gmail.com',
    to: email,
    subject: `You received an invitation to join the class`,
    html: `<p>If you want to join the class, press <a href="${URL_ClIENT}/course/join/${courseId}?role=${role}">Join Class</a></p><p>If not, please ignore this message</p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  return res.json({
    message: 'SendEmail',
  });
});

router.get('/:id', async function (req, res) {
  const id = req.params.id;

  const course = await Course.find({
    _id: mongoose.Types.ObjectId(id),
  });
  res.json({ course: course });
});
router.post('/add', verifyToken, async function (req, res) {
  const { name, teacher, description, membership } = req.body;
  if (!name || !teacher || !description || !membership) {
    return res.status(400).json({ message: 'Missing required value' });
  }
  try {
    const newCourse = new Course({ name, teacher, description, membership });
    const course = await newCourse.save();
    const newEnrollment = new EnrollMent({
      courseId: course._id,
      userId: req.userId,
      role: 'Teacher',
    });
    await newEnrollment.save();
    return res.json({
      message: 'Course created successfully',
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
