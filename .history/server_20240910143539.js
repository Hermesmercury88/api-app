const express = require('express')
const pool = require("./database")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken') 
const cors = require('cors') 
require('dotenv').config() 

const app = express()
app. use(cors())
app. use(express. json())

const port = 4000
app.get('/', (req, res) => res.send('Hello World!'))

app.post('/register', async (req, res) => {
    const { email, password, name } - req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const [result] - await pool.query('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', [email, hashedPassword, name]);
res.status(201).send('Uesr registerd');