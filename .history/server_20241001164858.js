const express = require('express');
const pool = require('./database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const port = 4000;
app.get('/', (req, res) => res.send('Hello World!'));

// ตรวจสอบ user token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
};

// ดึงข้อมูลผู้ใช้งานที่เข้าสู่ระบบ
app.get('/account', authenticateToken, async (req, res) => {
    try {
        const userid = req.user.id;
        const [results] = await pool.query("SELECT email, name, picture FROM users WHERE id = ?", [userid]);
        if (results.length === 0) {
            return res.status(404).json({ error: "ไม่พบผู้ใช้" });
        }
        res.json(results.map(user => ({
            ...user,
            picture: user.picture ? `http://localhost:4000/${user.picture}` : null
        })));
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "เกิดข้อผิดพลาด" });
    }
});

// กำหนดโฟลเดอร์สำหรับเก็บรูป
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
app.use('/uploads', express.static('uploads'));

// แก้ไขข้อมูลบัญชีผู้ใช้งาน

app.put('/update-account', authenticateToken , upload.single('picture') , async (req, res) => {
    const { name, email } = req.body;
    const picturePath = req.file ? `uploads/${req.file.filename}` : null;
    try{
      const userid = req.user.id;
      let query = 'UPDATE users SET name=?, email=?'
  
      let params = [name , email]
  
  
  
      if(picturePath) {
  
        query += ', picture =? '
  
        params.push(picturePath)
  
      }
  
      query += 'WHERE id =? '
  
      params.push(userid)
  
  
  
      const [results] = await pool.query(query, params);
  
  
  
      if(results.affectedRows === 0) {
  
        return res.status(400).json({ error : "ไมพบผู้ใช้"});
  
      }
  
      res.json({message: "แก้ไขข้อมูลเรียบร้อย"});
  
    } catch (err) {
  
      console.log("Error", err);
  
      res.status(500).json( {error : "ผิดพลาด"});
  
    }
  
  })

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
