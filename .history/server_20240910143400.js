const express = require('express')
const pool = require("./database")
const bcrypt = require('bcryptjs"
const jwt = require('jsonwebtoken') 
const cors = require('cors') 
require('dotenv').config() 