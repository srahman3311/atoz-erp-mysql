require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser');
const fileUpload = require("express-fileupload") // File system upload middleware, not database upload

// Importing Connection
const connection = require("./config/mysqlConnection");

// Express Module
const app = express();


// Cross Platform Resource Sharing
// sending cookie by res.cookie method requires cors configuration as credentials:true
// same(withCredentials:true) is required on client side axios
app.use(cors({origin: "http://localhost:3000", credentials: true}));

// Using File Upload Middleware so that it can be accessible from any directory/subdirectory
app.use(fileUpload());


// Static Files
app.use(express.static(__dirname + "/public"));

// Cookie Parser
app.use(cookieParser());


// Middlewares
app.use(express.json());


// Database Connection
connection.connect(err => {
    if (err) throw err;
    console.log("mysql database connected");
});


// Inserting a user
/*
let password = "ubaid123";

bcrypt.genSalt(10, (err, salt) => {
    if(err) throw err;

    bcrypt.hash(password, salt, (err, hash) => {

        if(err) throw err;
        password = hash;


        const sql = "insert into users values ?";
        const values = [[1003, "Ubaid", "Rahman", "ubaid123", "Director", password, "admin", "active"]];


        connection.query(sql, [values], err => {
            if(err) throw err;

            console.log("values inserted");
        });
    });

});

*/

/*

let sql = "insert into payorders values ?";
let values = [
    [1045, '2020-12-26', 'cube3311', 'Rupali', 'Uttara', 'Ubaid', 2825.20, 'not released', 'pending', 'added'],
    [1046, '2020-12-27', 'cube3311', 'Rupali', 'Uttara', 'Ubaid', 2825.20, 'not released', 'pending', 'added'],
    [1047, '2020-12-28', 'cube3311', 'Rupali', 'Uttara', 'Ubaid', 2825.20, "not released", "pending", 'added'],
    [1048, '2020-12-29', 'cube3311', 'Rupali', 'Uttara', 'Ubaid', 2825.20, "not released", "pending", 'added'],
    [1049, '2020-12-30', 'cube3311', 'Rupali', 'Uttara', 'Ubaid', 2825.20, "not released", "pending", 'added'],
    [1050, '2020-12-31', 'cube3311', 'Rupali', 'Uttara', 'Ubaid', 2825.20, "not released", "pending", 'added'],
    [1051, '2020-12-10', 'cube3311', 'Rupali', 'Uttara', 'Ubaid', 2825.20, "not released", "pending", 'added'],
    [1052, '2020-12-11', 'cube3311', 'Rupali', 'Uttara', 'Ubaid', 2825.20, "not released", "pending", 'added'],
    [1053, '2020-12-12', 'cube3311', 'Rupali', 'Uttara', 'Ubaid', 2825.20, "not released", "pending", 'added'],
    [1054, '2020-12-13', 'cube3311', 'Rupali', 'Uttara', 'Ubaid', 2825.20, "not released", "pending", 'added'],
    [1055, '2020-12-14', 'cube3311', 'Rupali', 'Uttara', 'Ubaid', 2825.20, "not released", "pending", 'added'],
    [1056, '2020-12-14', 'cube3311', 'Rupali', 'Uttara', 'Ubaid', 2825.20, "not released", "pending", 'added'],
    [1057, '2020-12-15', 'cube3311', 'Rupali', 'Uttara', 'Ubaid', 2825.20, "not released", "pending", 'added'],
    [1058, '2020-12-15', 'cube3311', 'Rupali', 'Uttara', 'Ubaid', 2825.20, "not released", "pending", 'added'],
    [1059, '2020-12-16', 'cube3311', 'Rupali', 'Uttara', 'Ubaid', 2825.20, "not released", "pending", 'added'],
    [1060, '2020-12-15', 'cube3311', 'Rupali', 'Uttara', 'Ubaid', 2825.20, "not released", "pending", 'added'],
    [1061, '2020-12-25', 'cube3311', 'Rupali', 'Uttara', 'Ubaid', 2825.20, "not released", "pending", 'added'],
    [1062, '2020-12-28', 'cube3311', 'Rupali', 'Uttara', 'Ubaid', 2825.20, "not released", "pending", 'added'],
    [1063, '2020-12-27', 'square42', 'Janata', 'mirpur', 'Dhoni', 2825.20, 'not released', 'pending', 'added'],
    [1064, '2020-12-09', 'square42', 'Janata', 'mirpur', 'Dhoni', 2825.20, 'not released', 'pending', 'added'],
    [1065, '2020-12-11', 'square42', 'Janata', 'mirpur', 'Dhoni', 2825.20, 'not released', 'pending', 'added'],
    [1066, '2020-12-11', 'square42', 'Janata', 'mirpur', 'Dhoni', 2825.20, 'not released', 'pending', 'added'],
    [1067, '2020-12-13', 'square42', 'Janata', 'mirpur', 'Dhoni', 2825.20, 'not released', 'pending', 'added'],
    [1068, '2020-12-18', 'square42', 'Janata', 'mirpur', 'Dhoni', 2825.20, 'not released', 'pending', 'added'],
    [1069, '2020-12-13', 'square42', 'Janata', 'mirpur', 'Dhoni', 2825.20, 'not released', 'pending', 'added'],
    [1070, '2020-12-18', 'square42', 'Janata', 'mirpur', 'Dhoni', 2825.20, 'not released', 'pending', 'added'],
    [1071, '2020-12-19', 'square42', 'Janata', 'mirpur', 'Dhoni', 2825.20, 'not released', 'pending', 'added'],
    [1072, '2020-12-19', 'square42', 'Janata', 'mirpur', 'Dhoni', 2825.20, 'not released', 'pending', 'added'],
    [1073, '2020-12-20', 'square42', 'Janata', 'mirpur', 'Dhoni', 2825.20, 'not released', 'pending', 'added'],
    [1074, '2020-12-20', 'square42', 'Janata', 'mirpur', 'Dhoni', 2825.20, 'not released', 'pending', 'added'],
    [1075, '2020-12-21', 'square42', 'Janata', 'mirpur', 'Dhoni', 2825.20, 'not released', 'pending', 'added'],
    [1076, '2020-12-21', 'square42', 'Janata', 'mirpur', 'Dhoni', 2825.20, 'not released', 'pending', 'added'],
    [1077, '2020-12-22', 'square42', 'Janata', 'mirpur', 'Dhoni', 2825.20, 'not released', 'pending', 'added'],
    [1078, '2020-12-23', 'square42', 'Janata', 'mirpur', 'Dhoni', 2825.20, 'not released', 'pending', 'added'],
    [1079, '2020-12-24', 'square42', 'Janata', 'mirpur', 'Dhoni', 2825.20, 'not released', 'pending', 'added'],
    [1080, '2020-12-24', 'square42', 'Janata', 'mirpur', 'Dhoni', 2825.20, 'not released', 'pending', 'added'],
    [1081, '2020-12-24', 'square42', 'Janata', 'mirpur', 'Dhoni', 2825.20, 'not released', 'pending', 'added'],
    [1082, '2020-12-18', 'square42', 'Janata', 'mirpur', 'Dhoni', 2825.20, 'not released', 'pending', 'added'],
    [1083, '2020-12-13', 'square42', 'Janata', 'mirpur', 'Dhoni', 2825.20, 'not released', 'pending', 'added'],
    [1084, '2020-12-14', 'square42', 'Janata', 'mirpur', 'Dhoni', 2825.20, 'not released', 'pending', 'added'],
    [1085, '2020-12-11', 'square42', 'Janata', 'mirpur', 'Dhoni', 2825.20, 'not released', 'pending', 'added'],


];

connection.query(sql, [values], (err, result) => {
    if(err) throw err;
    console.log("one row added");
});


*/










/*
let sql = "insert into jobs values ?";
let values = [
    [1052, 'A', 'A-3', 'Construction', 25344.20, 258578.20, 2825.20, 254857, 'active'],
    [1053, 'A', 'A-4', 'HUUUUU', 25344.20, 258578.20, 2825.20, 254857, 'active'],
    [1054, 'A', 'A-5', 'Done', 25344.20, 258578.20, 2825.20, 254857, 'active'],
    [1055, 'A', 'A-6', 'Uli', 25344.20, 258578.20, 2825.20, 254857, 'active'],
    [1056, 'A', 'A-7', 'Kueer', 25344.20, 258578.20, 2825.20, 254857, 'active'],
    [1057, 'C', 'C-1', 'Werik', 25344.20, 258578.20, 2825.20, 254857, 'active'],
    [1058, 'C', 'C-2', 'Hubby', 25344.20, 258578.20, 2825.20, 254857, 'active'],
    [1059, 'A', 'A-8', 'Jker', 25344.20, 258578.20, 2825.20, 254857, 'active'],
    [1060, 'A', 'A-9', 'Gathering', 25344.20, 258578.20, 2825.20, 254857, 'active'],
    [1061, 'A', 'A-10', 'Sticker', 25344.20, 258578.20, 2825.20, 254857, 'active'],
    [1062, 'A', 'A-12', 'Label', 25344.20, 258578.20, 2825.20, 254857, 'active'],
    [1063, 'A', 'A-13', 'Heavy Plant', 25344.20, 258578.20, 2825.20, 254857, 'active']


];

connection.query(sql, [values], (err, result) => {
    if(err) throw err;
    console.log("one row added");
});
*/









// API Routes
app.use("/api/users", require("./api/users"));
app.use("/api/jobs", require("./api/jobs"));
app.use("/api/payorders", require("./api/payorders"));
app.use("/api/materials", require("./api/materials"));
app.use("/api/subheads", require("./api/subheads"));
app.use("/api/expenses", require("./api/expenses"));
app.use("/api/credits", require("./api/credits"));
app.use("/api/reports", require("./api/reports"));

// Port & Server
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));