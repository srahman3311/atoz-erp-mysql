const router = require("express").Router();
// Authorization
const auth = require("../middlewares/auth");

// DB Connection
const connection = require("../config/mysqlConnection");



// For Report Component
router.get("/", auth, (request, response) => {

    connection.query("select * from subheads", (err, subheads) => {
        // Error Checking
        if(err) return response.status(500).send(err);

        return response.status(200).json(subheads);
    });
});


// For Report Component Subhead Filtering
router.post("/search", auth, (request, response) => {

    const { searchText } = request.body;

    let sql = "select * from subheads where name LIKE '%" + [searchText] + "%'";

    connection.query(sql, (err, subheads) => {
        // Error Checking
        if(err) return response.status(500).send(err);

        return response.status(200).json(subheads);
    });


});




router.post("/", auth, (req, res) => {

    // Destructuring req.body object
    const { limit, offset, searchText } = req.body;

    // When post request is coming from Expense Component
    if(typeof req.body.limit === "undefined") {

        // Destructuring req.body object
        const { keyword } = req.body;

        // Database query
        let sql = "select * from subheads where name LIKE '%" + [keyword] + "%'";
        connection.query(sql, (err, subheads) => {

            // Error Checking
            if(err) return res.status(500).send(err);

            return res.status(200).json(subheads);
        });
    } 
    // Else, post request is coming from Subhead Component
    else {
        // results are for just subhead list length
        let sql = "select * from subheads where name LIKE '%" + [searchText] + "%'";
        connection.query(sql, (err, results) => {
            // Error Checking
            if(err) return res.status(500).send(err);
            // if there are no items then return the empty array
            if(!results.length) return res.status(200).json({results, subheads: results});

            sql2 = sql + " limit " + [limit] + " offset " + [offset];
            connection.query(sql2, (err, subheads) => {
                if(err) return res.status(500).send(err);

                // if there are no items after offsetting then substract the limit value from offset and send found items. 
                if(!subheads.length) {
                    const sql3 = sql + " limit " + [limit] + " offset " + [offset - limit];
                    connection.query(sql3, (err, subheadResults) => {
                        if(err) res.status(500).send(err);

                        return res.status(200).json({subheads: subheadResults, results});
                    });
                } 
                // else just send the items after offsetting
                else {
                    return res.status(200).json({subheads, results});
                }
            });
        });
            
    }
});






// Adding Or Updating subhead
router.post("/add", auth, (req, res) => {

    // Destructuring req.body.subhead
    let {name, unit, status } = req.body.subhead;

    // Required for updating purpose only
    let subheadID = Number(req.body.subheadID); 
  
    // If subheadID is not 0 then update request has been made
    if(subheadID !== 0) {

        // to re-calculate the amount of 'balance' column based on new job value (if)added by user
        connection.query("select * from subheads where serial_no = ?", [subheadID], (err, result) => {

            // Error Checking
            if(err) return res.status(500).send(err);

            // Updating subhead
            const sql = "update subheads set name=? where serial_no=?";
            const data = [name, subheadID];

            connection.query(sql, data, (err) => {

                // Error Checking
                if(err) return res.status(500).send(err);

                return res.json({msg: "One Subhead Successfully Updated"});
            });
        })
    } 
    // Else new add request has been made 
    else {
        // check to see if the subhead already exists or not
        connection.query("select * from subheads where name = ?", [name], (err, result) => {
            
            if(err) return res.status(500).send(err);

            if(result.length) return res.status(400).json({msg: `subhead ${name} already exists`});

            // if subhead doesn't exist, add it
            let serial_no = 1001;
        
            connection.query("select * from subheads", (err, subheads) => {
                
                // Error Checking
                if(err) return res.status(500).send(err);
        
                // if subheads are already present in the subhead table
                if(subheads.length) serial_no = subheads[subheads.length - 1].serial_no + 1;
        
                let sql = "insert into subheads values ?";
                let values = [[serial_no, name]];
                
                connection.query(sql, [values], (err) => {

                    // Error Checking
                    if(err) return res.status(500).send(err);
                    
                    return res.json({msg: "One Subhead successfully added"});
                    
                });
            });
        });
    }

});



// Deleting Jobs
router.post("/delete", auth, (req, res) => {
    // Destructuring req.body object
    let { subheadName, limit, offset, searchText} = req.body;

    subheadName = Number(subheadName);

    connection.query("delete from subheads where serial_no = '" + [subheadName] + "'", (err) => {

        if(err) return res.status(500).send(err);

        const sql = "select * from subheads where name LIKE '%" + [searchText] + "%'";
        connection.query(sql, (err, results) => {
            if(err) return res.status(500).send(err);

            if(!results.length) return res.status(200).json({results, subheads: results});

            const sql2 = sql + " limit " + [limit] + " offset " + [offset];
            connection.query(sql2, (err, subheads) => {
                if(err) return res.status(500).send(err);

                if(!subheads.length) {
                    const sql3 = sql + " limit " + [limit] + " offset " + [offset - limit];
                    connection.query(sql3, (err, subheadResults) => {
                        if(err) res.status(500).send(err);

                        res.status(200).json({subheads: subheadResults, results});
                    });
                } else {
                    res.status(200).json({subheads, results});
                }
            })
        });
        
    });
       
});
    





module.exports = router;












/*





router.post("/", auth, (req, res) => {

    // for subhead editing at the frontend
    if(typeof req.body.subhead_id !== "undefined") {
        const searchId = req.body.subhead_id;

        connection.query("select * from subheads where serial_no = ?", [searchId], (err, subhead) => {
            if(err) res.status(500).send(err);

            return res.json(subhead);
        });
    } else {

        let sql;
        // When post request is coming from Expense Component
        if(typeof req.body.limit === "undefined") {
            const {keyword} = req.body;

            sql = "select * from subheads where name LIKE '%" + [keyword] + "%'";
            connection.query(sql, (err, subheads) => {
                if(err) res.status(500).send(err);
                res.status(200).json(subheads);
            });
        } 
        // Else, post request is coming from Job Component
        else {
            // Need to send the table length to frontend, hence the select * from jobs
            connection.query("select * from subheads", (err, results) => {

                if(err) res.status(500).send(err);

                const { limit, offset } = req.body;

                sql = "select * from subheads limit " + [limit] + " offset " + [offset];
                connection.query(sql, (err, subheads) => {
                    if(err) res.status(500).send(err);
                    res.status(200).json({results, subheads});
                });
            });
            
        }
    }

});



router.post("/search", auth, (req, res) => {

    const {limit, offset, text} = req.body;

    // to send the table length to frontend
    let sql = "select * from subheads where name LIKE '%" + [text] + "%'";
    
    // to send matched subheads 
    let sql2 = sql + " limit " + [limit] + " offset " + [offset];

    connection.query(sql, (err, results) => {
        if(err) throw err;
    
        connection.query(sql2, (err, subheads) => {
            if(err) throw err;

            if(!subheads.length) {
                const sql3 = sql + " limit " + [limit] + " offset " + [offset - limit];
                connection.query(sql3, (err, subheadResults) => {
                    if(err) res.status(500).send(err);

                    res.status(200).json({subheads: subheadResults, results});
                });
            } else {
                res.status(200).json({subheads, results});
            }

        });        
    });
});




router.post("/add", auth, (req, res) => {


    const { name } = req.body.subhead;
     // Required for updating purpose only
     let subhead_id = Number(req.body.subhead_id); 

    let serial_no = 1001;

    // If subhead_id is not 0 then update request has been made
    if(subhead_id !== 0) {

        // if numbers are sent as string from frontend, only thn node mysql module converts them into number and saves in the table
        // but if a specific column requires numbers but gets actual string then error will occur
        const sql = "update subheads set name=? where serial_no=?";
        const data = [name, subhead_id];

        connection.query(sql, data, (err) => {
            if(err) res.status(500).send(err);
            res.json({msg: "One Subhead Successfully Updated"});
        });

    } 
    // Else, new add request has been made.
    else {

        connection.query("select * from subheads", (err, subheads) => {

            if(err) res.status(500).send(err);

            serial_no = subheads.length + serial_no;

            let sql = "insert into subheads values ?";
            let values = [[ serial_no, name ]];

            connection.query(sql, [values], (err, result) => {
                if(err) res.status(500).send(err);
                
                res.json({msg: "One subhead successfully added"});
                
            });
        });
    }

    
});



router.post("/delete", auth, (req, res) => {

    //console.log(req.body);
    const { _id } = req.body;

    connection.query("delete from subheads where serial_no = '" + [_id] + "'", (err) => {
        if(err) return res.status(500).send(err);

        res.json({msg: "Successfully deleted"});
    });
});


*/










