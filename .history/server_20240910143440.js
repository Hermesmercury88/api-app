const express = require('express')
const pool = require("./database")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken') 
const cors = require('cors') 
require('dotenv').config() 

const app = express()
app. use(cors())
app. use(express. json())

const port - 4000
app.get('/', (req, res) => res.send('Hello World!'))