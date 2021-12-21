const express = require('express');
const router = express.Router();
const Course = require('../models/courses.models');
const mongoose = require('mongoose');
const verifyToken = require('../middlewares/auth.mdw');
const EnrollMent = require('../models/enrollments.models');
const nodemailer = require('nodemailer');
const usersModels = require('../models/users.models');
const statusModels = require('../models/statuses.model');
const gradesModel = require('../models/grades.model');
const profilesModels = require('../models/profiles.models');
const studentList = require('../models/studentList.model')
const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");
const csvtojson = require("csvtojson");
const gradestructureModel = require('../models/gradestructure.model');

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

router.get('/news/:courseId', verifyToken, async function (req, res) {
  const { courseId } = req.params;
  //console.log(courseId)
  const status = await statusModels.find({ courseId: courseId });
  const users = await Promise.all(
    status.map(async (s) => {
      const user = await usersModels.find({
        _id: mongoose.Types.ObjectId(s.userId),
      });
      return user[0];
    })
  );
  let news = [];
  for (let i = 0; i < users.length; i++) {
    news.push({ content: status[i].content, user: users[i].name });
  }
  console.log(news);
  res.json({ status: news });
});


router.get('/gradestructure/:courseId', verifyToken, async function (req, res) {
  const { courseId } = req.params;
  console.log("Grade structure test");
  console.log(courseId);
  //const structure = gradestructureModel({courseId});
  const data = await gradestructureModel.find({courseId});
  console.log(data);
  return res.json({gradeStruture: data});
});

router.post('/gradestructure/edit', verifyToken, async function (req, res) {
  console.log(req.body);
  //console.log("test courseId");
  const courseId = req.body.gradeStructure[0].courseId;


  const gradeStructure = req.body.gradeStructure;
  gradeStructure.forEach(async (item, id) =>{
    gradeStructure[id].index = id + 1;
  });
  console.log(gradeStructure);

  if (req.body.gradeStructure){
    gradestructureModel.find({ courseId: courseId }).remove().exec();
  }

  console.log(gradeStructure);
  await Promise.all(
    gradeStructure.map(async (item) => {
      const structure = await new gradestructureModel(item);
      structure.save();
    })
  );
  return res.json({gradeStruture: req.body});
});

// router.get('/grades/:courseId', verifyToken, async function (req, res) {
//   const { courseId } = req.params;
//   console.log(typeof (mongoose.Types.ObjectId(req.userId)))
//   const user = await profilesModels.findOne({ userId: mongoose.Types.ObjectId(req.userId) })
//   console.log("user")

//   console.log(user);
//   //console.log(courseId)
//   const grades = await gradesModel.find({ courseId: courseId, studentId: user.studentId });
//   console.log(grades);
//   res.json({ grades: grades });
// });





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

router.post('/news/', verifyToken, async function (req, res) {
  console.log(req.body);

  const { content, courseId } = req.body;
  console.log(content);
  console.log(courseId);
  console.log(req.userId);
  if (!content || !courseId) {
    return res.status(400).json({ message: 'Missing required value' });
  }
  try {
    const userId = req.userId;
    const newStatus = new Status({ courseId, userId, content });
    await newStatus.save();
    return res.json({
      message: 'Status created successfully',
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
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

router.post('/downloadStudentList/', verifyToken, async function (req, res) {
  const { students, fileName } = req.body;
  if (!students || !fileName) {
    return res.status(400).json({ message: 'Missing required value' });
  }
  try {
    const profileStudents = await Promise.all(
      students.map(async (student) => {
        const user = await profilesModels.find({
          userId: mongoose.Types.ObjectId(student._id),
        });
        return user[0];
      })
    );

    let studentList = [];
    for (let i = 0; i < students.length; i++) {
      studentList.push({ studentName: students[i].name, studentId: profileStudents[i].studentId })
    }
    console.log(studentList);
    const json2csvParser = new Json2csvParser({ header: true });
    const csvData = json2csvParser.parse(studentList);

    fs.writeFile(fileName, csvData, function (error) {
      if (error) throw error;
      console.log("Write successfully!");
    });
    return res.json({
      message: 'Write successfully!',
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/uploadStudentList/', verifyToken, async function (req, res) {
  const { fileName, courseId } = req.body;
  if (!fileName) {
    return res.status(400).json({ message: 'Missing required value' });
  }
  try {


    csvtojson()
      .fromFile(fileName)
      .then(csvData => {
        //console.log(csvData);
        csvData.map(async (s)=>{
          const student = new studentList({
            courseId:mongoose.Types.ObjectId(courseId),
            studentId:s.studentId,
            fullName:s.studentName
          });
          console.log(student)
          await student.save();
        })
      });
     




    return res.json({
      message: 'Read successfully!',
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
