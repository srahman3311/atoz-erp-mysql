const express = require("express");
const jwt = require("jsonwebtoken");


function auth(req, res, next) {
    const token = req.headers["x-auth-token"];

    if(!token) {
        res.status(401).json({msg: "No token, authorization denied"});
    } else {

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded;
            next();

        } catch(e) {
            res.status(400).json({msg: "invalid token"});
        }
       
    }

}

module.exports = auth;