const router = require("express").Router();
const fs = require("fs");
const fileUpload = require("express-fileupload");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Authorization
const auth = require("../middlewares/auth");
// DB Connection
const connection = require("../config/mysqlConnection");
// const e = require("express");


// For Report Component
router.get("/", auth, (request, response) => {

    connection.query("select * from users", (err, users) => {
        // Error Checking
        if(err) return response.status(500).send(err);

        return response.status(200).json(users);
    });
});


// For Report Component Job Filtering
router.post("/search", auth, (request, response) => {

    const { searchText } = request.body;

    let sql = "select * from users where username LIKE '%" + [searchText] + "%'";

    connection.query(sql, (err, users) => {
        // Error Checking
        if(err) return response.status(500).send(err);

        return response.status(200).json(users);
    });


});



router.post("/", auth, (req, res) => {
    // Destructuring req.body object
    const { limit, offset, searchText } = req.body;
    // results are for just job list length
    let sql = "select * from users where first_name LIKE '%" + [searchText] + "%' OR last_name LIKE '%" + [searchText] 
    + "%' OR username LIKE '%" + [searchText] + "%' OR designation LIKE '%" + [searchText] + "%' OR status LIKE '%" + 
    [searchText] + "%'";

    connection.query(sql, (err, results) => {
        // Error Checking
        if(err) return res.status(500).send(err);
        // if there are no items then return the empty array
        if(!results.length) return res.status(200).json({results, users: results});

        sql2 = sql + " limit " + [limit] + " offset " + [offset];
        connection.query(sql2, (err, users) => {
            // Error Checking
            if(err) return res.status(500).send(err);
            // if there are no items after offsetting then substract the limit value from offset and send found items. 
            if(!users.length) {

                const sql3 = sql + " limit " + [limit] + " offset " + [offset - limit];

                connection.query(sql3, (err, userResults) => {
                    // Error Checking
                    if(err) res.status(500).send(err);

                    res.status(200).json({users: userResults, results});
                });
            } 
                // else just send the items after offsetting
            else {
                res.status(200).json({users, results});
            }
        });
    });
            
    
});

/*
router.post("/", (req, res) => {
    // for user details editing at the frontend
    if(typeof req.body.user_id !== "undefined") {
        const searchId = Number(req.body.user_id);

        connection.query("select * from users where user_id = ?", [searchId], (err, user) => {
            if(err) res.status(500).send(err);

            return res.json(user);
        });
    } else {

        // For sending payorder data at the Payorder Component startup
        connection.query("select * from users", (err, results) => {

            if(err) res.status(500).send(err);

            const { limit, offset } = req.body;

            sql = "select * from users limit " + [limit] + " offset " + [offset];
            connection.query(sql, (err, users) => {

                if(err) res.status(500).send(err);

                res.status(200).json({results, users});
            });
        });
    }  
});

*/

// To find a specific user in order to populate the Profile Component
router.post("/user", (req, res) => {
    
    connection.query("select * from users where username = ?", [req.body.username], (err, user) => {

        if(err) throw err;

        if(!user.length) {
            res.status(404).json({msg: "User doesn't exist"});
        } else {
            res.status(200).json(user[0]);
        }
    });
});




// Login Route
router.post("/login", (req, res) => {

    const {username, password} = req.body;

    connection.query("select * from users where username = ?", [username], (err, user) => {
        if(err) throw err;

        if(!user.length) {
            res.status(404).json({msg: "User doesn't exist"});
        } else {
            bcrypt.compare(password, user[0].password, (err, isMatch) => {

                if(err) throw err;

                // If passwords match
                if(isMatch) {

                    // jwt expiresIn option is measured in seconds
                    jwt.sign(
                        {id: user[0].user_id},
                        process.env.SECRET_KEY,
                        {expiresIn: 3600},
                        (err, token) => {

                            if(err) throw err;

                            // with maxAge httpOnly must be set to false, otherwise cookie won't be saved in browser
                            res.cookie("jwtToken", token, {maxAge: 3600000, httpOnly: false});
                            // res.json({
                            //     userDetails: {
                            //         username: user[0].username,
                            //         status: user[0].status,
                            //         role: user[0].role
                            //     }
                            // });
                            res.json(user);
                        }
                    );
                } 
                // If passwords don't match
                else {
                    res.status(400).json({msg: "Incorrect password"});
                }

            });
        }
    });
    
});




router.post("/add-user", (request, response) => {

     // Destructuring req.body object
     let { first_name, last_name, username, designation, role, status, password, userID, filename } = request.body;
     // Getting the file from req.files
     let imageFile = request.files !== null ? request.files.file : null;
     // Creating the imgUrl 
     let imgUrl = imageFile !== null ? "http://localhost:3030/images/" + imageFile.name : null;
     // Need to save the filename as well, to be able to display the filename when user clicks on the update on frontend
     let imageFileName = imageFile !== null ? imageFile.name : null;
   
 
     // Initializing user_id
     let user_id = 1001;

    // First check to see whether add or update request has been made.
    userID = Number(userID);

    // If userID is not 0 then update request has been made
    if(userID) {

        // First, find the user with the userID sent from frontend
        connection.query("select * from users where user_id=?", [userID], (err, user) => {

            // Error Checking
            if(err) return response.status(500).send(err);

            // if user's filename is not null then user previously added an image for profile picture
            if(user[0].filename !== null) {

                 // if user's filename and filename sent from frontend are same then user didn't want to update the profile image
                if(user[0].filename === filename) {

                    if(password) {
                        // need to hash the password first and then replace the existing password with this new hashed one
                        bcrypt.genSalt(10, (err, salt) => {
                            // Error Checking
                            if(err) return response.status(500).send(err);

                            bcrypt.hash(password, salt, (err, hash) => {
                                // Error Checking
                                if(err) return response.status(500).send(err);

                                password = hash;

                                const sql = "update users set first_name=?, last_name=?, username=?, designation=?, role=?, status=?, password=? where user_id=?";
                                const data = [first_name, last_name, username, designation, role, status, password, userID];

                                connection.query(sql, data, err => {

                                    // Error Checking
                                    if(err) return response.status(500).send(err);

                                    return response.json({msg: "User Details have been successfully updated"});
                                });

                            });
                        });
                
                    } else {

                        const sql = "update users set first_name=?, last_name=?, username=?, designation=?, role=?, status=? where user_id=?";
                        const data = [first_name, last_name, username, designation, role, status, userID];

                        connection.query(sql, data, err => {
                            // Error Checking
                            if(err) return response.status(500).send(err);

                            return response.json({msg: "User Details have been successfully updated"});
                            });
                    }
                }
                // else, user wants to update the profile picture
                else {
                    // if request has a valid password
                    if(password) {

                        bcrypt.genSalt(10, (err, salt) => {
                            // Error Checking
                            if(err) return response.status(500).send(err);

                            bcrypt.hash(password, salt, (err, hash) => {
                                // Error Checking
                                if(err) return response.status(500).send(err);

                                password = hash;

                                const sql = "update users set first_name=?, last_name=?, username=?, designation=?, role=?, status=?, password=?, imgUrl=?, filename=? where user_id=?";
                                const data = [first_name, last_name, username, designation, role, status, password, imgUrl, imageFileName, userID];
                
                                connection.query(sql, data, err => {
                                    
                                    // Error Checking
                                    if(err) return response.status(500).send(err);
                            

                                    // First, need to remove the previous file from filesytem
                                    fs.unlink(`./public/images/${user[0].filename}`, err => {
                                        // Error Checking
                                        if(err) return response.status(500).send(err);

                                        imageFile.mv(`./public/images/${imageFileName}`, function(err) {
                                            // Error Checking
                                            if(err) return response.status(500).send(err);

                                            return response.json({msg: "User Details have been successfully updated"});
                                        });
                                    });            
                                });
                            });
                        });
                        
                    } 
                    // if request contains an empty string password
                    else {

                        const sql = "update users set first_name=?, last_name=?, username=?, designation=?, role=?, status=?, imgUrl=?, filename=? where user_id=?";
                        const data = [first_name, last_name, username, designation, role, status, imgUrl, imageFileName, userID];
        
                        connection.query(sql, data, err => {
                            
                            // Error Checking
                            if(err) return response.status(500).send(err);
                    

                            // First, need to remove the previous file from filesytem
                            fs.unlink(`./public/images/${user[0].filename}`, err => {
                                // Error Checking
                                if(err) return response.status(500).send(err);

                                imageFile.mv(`./public/images/${imageFileName}`, function(err) {
                                    // Error Checking
                                    if(err) return response.status(500).send(err);

                                    return response.json({msg: "User Details have been successfully updated"});
                                });
                            });            
                        });
                    }

                    
                }
            } 
            // User didn't have a profile picture
            else {

                // First check to see if user has uploaded an image this time or not
                if(imageFile !== null) {

                    // check to see if password change request has been made or not
                    if(password) {

                        bcrypt.genSalt(10, (err, salt) => {
                            // Error Checking
                            if(err) response.status(500).send(err);

                            bcrypt.hash(password, salt, (err, hash) => {
                                // Error Checking
                                if(err) response.status(500).send(err);

                                password = hash;

                                const sql = "update users set first_name=?, last_name=?, username=?, designation=?, role=?, status=?, password=?, imgUrl=?, filename=? where user_id=?";
                                const data = [first_name, last_name, username, designation, role, status, password, imgUrl, imageFileName, userID];
                
                                connection.query(sql, data, err => {
                                    
                                    // Error Checking
                                    if(err) return response.status(500).send(err);
                            
                                    imageFile.mv(`./public/images/${imageFileName}`, function(err) {
                                        // Error Checking
                                        if(err) return response.status(500).send(err);

                                        return response.json({msg: "User Details have been successfully updated"});
                                    });
                                             
                                });


                            });
                        });

                    } else {

                        const sql = "update users set first_name=?, last_name=?, username=?, designation=?, role=?, status=?, imgUrl=?, filename=? where user_id=?";
                        const data = [first_name, last_name, username, designation, role, status, imgUrl, imageFileName, userID];
                
                        connection.query(sql, data, err => {
                                    
                            // Error Checking
                            if(err) return response.status(500).send(err);
                            
                            imageFile.mv(`./public/images/${imageFileName}`, function(err) {
                                // Error Checking
                                if(err) return response.status(500).send(err);

                                return response.json({msg: "User Details have been successfully updated"});
                            });
                                             
                        });

                    }
                }
                // Eles, user didn't want to set a profile image this time too
                else {

                    if(password) {

                        bcrypt.genSalt(10, (err, salt) => {
                            // Error Checking
                            if(err) response.status(500).send(err);

                            bcrypt.hash(password, salt, (err, hash) => {
                                // Error Checking
                                if(err) response.status(500).send(err);

                                password = hash;

                                const sql = "update users set first_name=?, last_name=?, username=?, designation=?, role=?, status=?, password=? where user_id=?";
                                const data = [first_name, last_name, username, designation, role, status, password, userID];
                
                                connection.query(sql, data, err => {
                                    
                                    // Error Checking
                                    if(err) return response.status(500).send(err);

                                    return response.json({msg: "User Details have been successfully updated"});
                                             
                                });


                            });
                        });

                    } else {

                        const sql = "update users set first_name=?, last_name=?, username=?, designation=?, role=?, status=? where user_id=?";
                        const data = [first_name, last_name, username, designation, role, status, userID];
                
                        connection.query(sql, data, err => {
                                    
                            // Error Checking
                            if(err) return response.status(500).send(err);

                            return response.json({msg: "User Details have been successfully updated"});
                                             
                            });
                    }
                }
            }

        });
    } 
    // Else, new add request has been made
    else {
        // First, check to see if user exists or not
        connection.query("select * from users where username=?", [username], (err, user) => {
            // Error Checking
            if(err) return rresponse.status(500).send(err);

            if(user.length) return response.status(400).json({msg: "User alrady exists"});

            // If user doesn't fill up following fields and wants to add a new user anyway
            if(designation === "") designation = "admin";
            if(role === "") role = "admin";
            if(status === "") status = "Active";

            // hash the password
            bcrypt.genSalt(10, (err, salt) => {
                 // Error Checking
                if(err) return response.status(500).send(err);

                bcrypt.hash(password, salt, (err, hash) => {
                     // Error Checking
                    if(err) return response.status(500).send(err);

                    password = hash;
                    // Below query is just for unique user_id generation, 
                    connection.query("select * from users", (err, users) => {
                        // Error Checking
                        if(err) return response.status.send(err);
                        // if there are no user currently present then user_id will be 1001 but if there are
                        // then dynamically create the new and unique user id
                        if(users.length) user_id = users[users.length - 1].user_id + 1;
    
                        let sql = "insert into users values ?";
                        let values = [[user_id, first_name, last_name, username, designation, password, role, status, imgUrl, imageFileName]];
                        connection.query(sql, [values], err => {
                            // Error Checking
                            if(err) return response.status(500).send(err);
    
                            // if request contains an image/file, upload it
                            if(imageFile !== null) {
                                // Upload method given by express file upload
                                imageFile.mv(`./public/images/${imageFile.name}`, function(err) {
                                    // Error Checking
                                    if (err) return response.status(500).send(err);
                                    // Return with the success message
                                    return response.status(200).json({msg: "One user has been successfully added"});
                                });
                            } 
                            // if request doesn't contain an image/file then just send the success message
                            else {
                                // Return with success message
                                return response.status(200).json({msg: "One user has been successfully added"});
                            }
                        });
    
                    });
                });
            });
        });
    }


});



 





// Deleting User
router.post("/delete", auth, (req, res) => {
    // Destructuring req.body object
    let { userID, limit, offset, searchText} = req.body;


    connection.query("select * from users where user_id =?", [Number(userID)], (err, user) => {
        // Error Checking
        if(err) return res.status(500).send(err);


        if(user[0].filename !== null) {
            // Remove the file from the dirctory first
            fs.unlink(`./public/images/${user[0].filename}`, err => {
                // Error Checking
                if(err) return res.status(500).send(err);

                connection.query("delete from users where user_id = '" + [Number(userID)] + "'", (err) => {
                    if(err) return res.status(500).send(err);
            
                    let sql = "select * from users where first_name LIKE '%" + [searchText] + "%' OR last_name LIKE '%" + [searchText] 
                    + "%' OR username LIKE '%" + [searchText] + "%' OR designation LIKE '%" + [searchText] + "%' OR status LIKE '%" + 
                    [searchText] + "%'";
        
                    connection.query(sql, (err, results) => {
                        if(err) return res.status(500).send(err);
            
                        if(!results.length) return res.status(200).json({results, users: results});
            
                        const sql2 = sql + " limit " + [limit] + " offset " + [offset];
                        connection.query(sql2, (err, users) => {
                            if(err) return res.status(500).send(err);
            
                            if(!users.length) {
                                const sql3 = sql + " limit " + [limit] + " offset " + [offset - limit];
                                connection.query(sql3, (err, userResults) => {
                                    if(err) res.status(500).send(err);
            
                                    res.status(200).json({users: userResults, results});
                                });
                            } else {
                                res.status(200).json({users, results});
                            }
                        })
                    })
                });
                
            });
        
        } else {

            connection.query("delete from users where user_id = '" + [Number(userID)] + "'", (err) => {
                if(err) return res.status(500).send(err);
        
                let sql = "select * from users where first_name LIKE '%" + [searchText] + "%' OR last_name LIKE '%" + [searchText] 
                + "%' OR username LIKE '%" + [searchText] + "%' OR designation LIKE '%" + [searchText] + "%' OR status LIKE '%" + 
                [searchText] + "%'";
    
                connection.query(sql, (err, results) => {
                    if(err) return res.status(500).send(err);
        
                    if(!results.length) return res.status(200).json({results, users: results});
        
                    const sql2 = sql + " limit " + [limit] + " offset " + [offset];
                    connection.query(sql2, (err, users) => {
                        if(err) return res.status(500).send(err);
        
                        if(!users.length) {
                            const sql3 = sql + " limit " + [limit] + " offset " + [offset - limit];
                            connection.query(sql3, (err, userResults) => {
                                if(err) res.status(500).send(err);
        
                                res.status(200).json({users: userResults, results});
                            });
                        } else {
                            res.status(200).json({users, results});
                        }
                    })
                })
            });
        }

        

        
    });
  
   
   
});

































































/*
router.post("/add-user", (req, res) => {

    let {first_name, last_name, username, designation, role, password} = req.body;
    let imageFile = req.files !== null ? req.files.file : null;
    let imgUrl = imageFile !== null ? "http://localhost:3030/images/" + imageFile.name : null;
    let user_id = 1001;

    if(designation === "") designation = "admin";
    if(role === "") role = "admin";
    
    bcrypt.genSalt(10, (err, salt) => {
        if(err) res.status(500).send(err);

        bcrypt.hash(password, salt, (err, hash) => {
            if(err) res.status(500).send(err);

            password = hash;

            connection.query("select * from users", (err, users) => {
                if(err) res.status.send(err);
                user_id += users.length;

                let sql = "insert into users values ?";
                let values = [[user_id, first_name, last_name, username, designation, password, role, "active", imgUrl]];

                connection.query(sql, [values], err => {
                    if(err) res.status(500).send(err);

                    // if request contains an image/file, upload it
                    if(imageFile !== null) {

                        imageFile.mv(`./public/images/${imageFile.name}`, function(err) {

                            if (err) {res.status(500).send(err)};

                            connection.query("select * from users where username = ?", [username], (err, user) => {

                                if(err) res.status(500).send(err);

                                res.status(200).json(user[0]);
                            });
                            
                        });
                    } 
                    // if request doesn't contain an image/file then just send the newly added user data
                    else {
                        connection.query("select * from users where username = ?", [username], (err, user) => {
                            if(err) res.status(500).send(err);
                            res.status(200).json(user[0]);
                        });
                    }
                });

            });
            
        });
    });
    
});

*/

router.get("/logout", (req, res) => {
    
    res.clearCookie("jwtToken");

    res.status(200).json({msg: "cookie successfully removed"});
});








module.exports = router;