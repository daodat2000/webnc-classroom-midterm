const express = require('express');
const router = express.Router();
const Course = require('../models/courses.models');
const mongoose = require('mongoose');
const verifyToken = require('../middlewares/auth.mdw');
const EnrollMent = require('../models/enrollments.models');
const nodemailer = require('nodemailer');
const usersModels = require('../models/users.models');
const statusModels = require('../models/statuses.model');
const notificationModels = require('../models/notifications.model');
const gradesModel = require('../models/grades.model');
const profilesModels = require('../models/profiles.models');
const studentList = require('../models/studentList.model');
const Json2csvParser = require('json2csv').Parser;
const fs = require('fs');
const csvtojson = require('csvtojson');
const gradestructureModel = require('../models/gradestructure.model');
const grades = require('../models/grades.model');
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
  for (let i = users.length - 1; i >= 0; i--) {
    news.push({ content: status[i].content, user: users[i].name });
  }
  console.log(news);
  res.json({ status: news });
});


router.get('/notifications/:courseId', verifyToken, async function (req, res) {
  const { courseId } = req.params;
  console.log(courseId)
  const notificationList = await notificationModels.find({ courseId: courseId });
  console.log(notificationList)
  const users = await Promise.all(
    notificationList.map(async (s) => {
      const user = await usersModels.find({
        _id: mongoose.Types.ObjectId(s.userId),
      });
      return user[0];
    })
  );
  let notifications = [];
  for (let i = users.length - 1; i >= 0; i--) {
    notifications.push({ content: notificationList[i].content, user: users[i].name });
  }
  console.log(notifications);
  res.json({ notification: notifications });
});


router.get('/gradestructure/:courseId', verifyToken, async function (req, res) {
  const { courseId } = req.params;
  //console.log("Grade structure test");
  //console.log(courseId);
  //const structure = gradestructureModel({courseId});
  const data = await gradestructureModel.find({ courseId }).sort('index');
  console.log(data);
  return res.json({ gradeStruture: data });
});

router.get('/grades/:courseId', verifyToken, async function (req, res) {
  const { courseId } = req.params;
  console.log('Grades test');
  console.log(courseId);
  //const structure = gradestructureModel({courseId});
  const data = await grades.find({ courseId });
  console.log(data);
  return res.json({ grades: data });
});

router.get('/getStudentList/:courseId', verifyToken, async function (req, res) {
  const { courseId } = req.params;
  //console.log("abc")
  const stuList = await studentList.find({ courseId });
  //console.log(stuList)

  res.json({ students: stuList });
});

router.post('/gradestructure/edit', verifyToken, async function (req, res) {
  console.log(req.body);
  //console.log("test courseId");
  const courseId = req.body.gradeStructure[0].courseId;

  const gradeStructure = req.body.gradeStructure;
  gradeStructure.forEach(async (item, id) => {
    gradeStructure[id].index = id + 1;
  });
  console.log(gradeStructure);

  if (req.body.gradeStructure) {
    gradestructureModel.find({ courseId: courseId }).remove().exec();
  }

  console.log(gradeStructure);
  await Promise.all(
    gradeStructure.map(async (item) => {
      const structure = await new gradestructureModel(item);
      structure.save();
    })
  );
  return res.json({ gradeStruture: req.body });
});

router.get('/gradesStudent/:courseId', verifyToken, async function (req, res) {
  
   const user = await profilesModels.findOne({ userId: mongoose.Types.ObjectId(req.userId) })


  const courseId = req.params.courseId;
  const gradeStructure = await gradestructureModel
    .find({ courseId: courseId })
    .sort('index');
 
  var student = user;
  const data = [];
  var checkFinalizeAll =1;
    let total = 0;
    const isEmpty = false;
    const grades = [];
    for (const item of gradeStructure) {
      const grade = await gradesModel.findOne({
        studentId: student.studentId,
        gradeStructureId: item._id,
        
      });
      if (grade&& item.finalized) {
        total += (Number(grade.grade) * item.detail) / 100;
        grades.push(grade);
      } else {
        checkFinalizeAll=0;
        const newGrade = {
          studentId: student.studentId,
          gradeStructureId: item._id,
          courseId: courseId,
          grade: '',
        };
        grades.push(newGrade);
      }
    }
    if(checkFinalizeAll==0){
      total=0;
    }
    const rowData = {
      studentId: student.studentId,
      studentName: student.fullName,
      grades: grades,
      total: parseFloat(total).toFixed(2),
    };
    data.push(rowData);
  
  res.json({ data });
  
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

router.post('/notifications/', verifyToken, async function (req, res) {
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
    const newNotification = new Notice({ courseId, userId, content });
    await newNotification.save();
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
  const { students } = req.body;
  if (!students) {
    return res.status(400).json({ message: 'Missing required value' });
  }
  try {
    const headers = [{ label: 'studentId', key: 'studentId' },{label:"studentName", key:'studentName'}];
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
      studentList.push({
        studentName: students[i].name,
        studentId: profileStudents[i].studentId,
      });
    }
    console.log(studentList);
    const data=studentList;
    return res.json({ data, headers });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/uploadStudentList/', verifyToken, async function (req, res) {
  console.log('upload')
  try {
    // IN REQ.FILES.”YOUR_FILE_NAME” WILL BE PRESENT
    const file = req.files;
    const { courseId } = req.body;
    console.log( courseId);  
    let csvData = req.files.file.data.toString('utf8');
    csvtojson()
      .fromString(csvData)
      .then(async (students) => {
        console.log('upload')
        console.log(students)
        for (const student of students) {
         
          const s = new studentList({
            studentId: student.studentId,
            courseId: mongoose.Types.ObjectId(courseId),
            fullName: student.studentName
          });

          console.log(s)
          await s.save();
        }
       
      

      });
    return res.send('OK');
  } catch (error) {
    res.status(400).send('ERROR');
  }
});

router.post('/grade/upload', function (req, res) {
  try {
    // IN REQ.FILES.”YOUR_FILE_NAME” WILL BE PRESENT
    const file = req.files;
    const { gradeStructureId, courseId } = req.body;
    console.log(gradeStructureId, courseId);
    if (gradeStructureId) {
      gradesModel.find({ gradeStructureId: gradeStructureId }).remove().exec();
    }
    csvData = req.files.file.data.toString('utf8');
    csvtojson()
      .fromString(csvData)
      .then(async (grades) => {
        for (const grade of grades) {
          console.log(grade);
          const newGrade = new gradesModel({
            studentId: grade.MSSV,
            courseId: courseId,
            gradeStructureId: gradeStructureId,
            grade: grade.Grade,
          });
          await newGrade.save();
        }
      });
    return res.send('OK');
  } catch (error) {
    res.status(400).send('ERROR');
  }
});

router.get('/grade/download/:courseId', async function (req, res) {
  const courseId = req.params.courseId;
  const gradeStructure = await gradestructureModel
    .find({ courseId: courseId })
    .sort('index');
  const students = await studentList.find({ courseId: courseId });

  const headers = [{ label: 'MSSV', key: 'studentId' }];
  gradeStructure.forEach(async (item) => {
    headers.push({ label: item.title, key: item.title });
  });
  const data = [];
  for (const student of students) {
    const rowData = { studentId: student.studentId };
    for (const item of gradeStructure) {
      const grade = await gradesModel.findOne({
        studentId: student.studentId,
        gradeStructureId: item._id,
      });
      if (grade) {
        rowData[item.title] = grade.grade;
      } else {
        rowData[item.title] = '';
      }
    }
    data.push(rowData);
  }
  res.json({ data, headers });
});

router.get('/gradeboard/:courseId', async function (req, res) {
  const courseId = req.params.courseId;
  const gradeStructure = await gradestructureModel
    .find({ courseId: courseId })
    .sort('index');
  const students = await studentList.find({ courseId: courseId });

  const data = [];
  for (const student of students) {
    let total = 0;
    const isEmpty = false;
    const grades = [];
    for (const item of gradeStructure) {
      const grade = await gradesModel.findOne({
        studentId: student.studentId,
        gradeStructureId: item._id,
      });
      if (grade) {
        total += (Number(grade.grade) * item.detail) / 100;
        grades.push(grade);
      } else {
        const newGrade = {
          studentId: student.studentId,
          gradeStructureId: item._id,
          courseId: courseId,
          grade: '',
        };
        grades.push(newGrade);
      }
    }
    const rowData = {
      studentId: student.studentId,
      studentName: student.fullName,
      grades: grades,
      total: parseFloat(total).toFixed(2),
    };
    data.push(rowData);
  }
  res.json({ data });
});

router.post('/grade/update', async function (req, res) {
  try {
    const { studentId, gradeStructureId, courseId, grade } = req.body;

    if (gradeStructureId && studentId) {
      gradesModel
        .find({ gradeStructureId: gradeStructureId, studentId: studentId })
        .remove()
        .exec();
    }

    const newGrade = new gradesModel({
      studentId: studentId,
      courseId: courseId,
      gradeStructureId: gradeStructureId,
      grade: grade,
    });
    await newGrade.save();
    return res.send('OK');
  } catch (error) {
    res.status(400).send('ERROR');
  }
});

router.get('/roleAccount/:courseId',verifyToken, async function (req, res) {
  const courseId = req.params.courseId;
  const userId = req.userId;
  const result = await EnrollMent.find({ userId: userId,courseId: courseId })
  var role =0;
  console.log("check role")
  console.log(courseId);
  console.log(userId);
  console.log(result[0].role);
  if(result[0].role=="Teacher"){
    role =1;
  }
  res.json({roleAccount:role});
});



module.exports = router;
