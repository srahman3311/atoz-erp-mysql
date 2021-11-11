const router = require("express").Router();
// Authorization
const auth = require("../middlewares/auth");
// DB Connection
const connection = require("../config/mysqlConnection");
const { response } = require("express");




// For Report Component
router.get("/", auth, (request, response) => {

    connection.query("select * from jobs", (err, jobs) => {
        // Error Checking
        if(err) return response.status(500).send(err);

        return response.status(200).json(jobs);
    });
});


// For Report Component Job Filtering
router.post("/search", auth, (request, response) => {

    console.log(request.body)
    const { searchText } = request.body;

    let sql = "select * from jobs where name LIKE '%" + [searchText] + "%' OR description LIKE '%" + [searchText] + "%'";

    connection.query(sql, (err, jobs) => {
        // Error Checking
        if(err) return response.status(500).send(err);

        return response.status(200).json(jobs);
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
        let sql = "select * from jobs where name LIKE '%" + [keyword] + "%' OR description LIKE '%" + [keyword] + "%'";
        connection.query(sql, (err, jobs) => {

            // Error Checking
            if(err) return res.status(500).send(err);

            return res.status(200).json(jobs);
        });
    } 
    // Else, post request is coming from Job Component
    else {
        // results are for just job list length
        let sql = "select * from jobs where name LIKE '%" + [searchText] + "%' OR description LIKE '%" + [searchText] + "%'";
        connection.query(sql, (err, results) => {
            // Error Checking
            if(err) return res.status(500).send(err);
            // if there are no items then return the empty array
            if(!results.length) return res.status(200).json({results, jobs: results});

            sql2 = sql + " limit " + [limit] + " offset " + [offset];
            connection.query(sql2, (err, jobs) => {
                if(err) return res.status(500).send(err);

                // if there are no items after offsetting then substract the limit value from offset and send found items. 
                if(!jobs.length) {
                    const sql3 = sql + " limit " + [limit] + " offset " + [offset - limit];
                    connection.query(sql3, (err, jobResults) => {
                        if(err) res.status(500).send(err);

                        return res.status(200).json({jobs: jobResults, results});
                    });
                } 
                // else just send the items after offsetting
                else {
                    return res.status(200).json({jobs, results});
                }
            });
        });
            
    }
});






// Adding Or Updating Job
router.post("/add", auth, (req, res) => {

    // Destructuring req.body.jobItem
    let { heading, name, description, value, credit, status } = req.body.jobItem;

    // Required for updating purpose only
    let jobName = req.body.jobName; 
  
    // If jobName is not null then update request has been made
    if(jobName !== null) {

        // to re-calculate the amount of 'balance' column based on new job value (if)added by user
        connection.query("select * from jobs where name = ?", [jobName], (err, result) => {

            // Error Checking
            if(err) return res.status(500).send(err);

            // Updating Job
            const sql = "update jobs set heading=?, name=?, description=?, value=?, credit=?, balance=?, status=? where name=?";
            const data = [heading, name, description, value, credit, value - result[0].debit, status, jobName];

            connection.query(sql, data, (err) => {

                // Error Checking
                if(err) return res.status(500).send(err);

                return res.json({msg: "One Job Successfully Updated"});
            });
        })
    } 
    // Else new add request has been made 
    else {
        // check to see if the job already exists or not
        connection.query("select * from jobs where name = ?", [name], (err, result) => {
            
            if(err) return res.status(500).send(err);

            if(result.length) return res.status(400).json({msg: `Job ${name} already exists`});

            // if job doesn't exist, add it
            let serial_no = 1001;
        
            connection.query("select * from jobs", (err, jobs) => {

                // Error Checking
                if(err) return res.status(500).send(err);
        
                // if jobs are already present in the job table
                if(jobs.length) serial_no = jobs[jobs.length - 1].serial_no + 1;
        
                let sql = "insert into jobs values ?";
                // 2nd 'value' in the following data array is for 'balance' column of job table
                let values = [[serial_no, heading, name, description, value, credit, 0.00, value, status]];
        
                connection.query(sql, [values], (err) => {

                    // Error Checking
                    if(err) return res.status(500).send(err);
                    
                    return res.json({msg: "One job successfully added"});
                    
                });
            });
        });
    }

});



// Deleting Jobs
router.post("/delete", auth, (req, res) => {
    // Destructuring req.body object
    let { jobName, limit, offset, searchText} = req.body;
  
   
    connection.query("select * from jobs where name = '" + [jobName] + "'", (err, job) => {
        // Error Checking
        if(err) return res.status(500).send(err);
        // if job's debit value is not zero then there are some expenses associated with it. In this case don't delete
        if(job[0].debit) return res.status(400).json({msg: "this job has expenses associated with it, can't be deleted"});

        connection.query("delete from jobs where name = '" + [jobName] + "'", (err) => {
            if(err) return res.status(500).send(err);
    
            const sql = "select * from jobs where name LIKE '%" + [searchText] + "%' OR description LIKE '%" + [searchText] + "%'";
            connection.query(sql, (err, results) => {
                if(err) return res.status(500).send(err);
    
                if(!results.length) return res.status(200).json({results, jobs: results});
    
                const sql2 = sql + " limit " + [limit] + " offset " + [offset];
                connection.query(sql2, (err, jobs) => {
                    if(err) return res.status(500).send(err);
    
                    if(!jobs.length) {
                        const sql3 = sql + " limit " + [limit] + " offset " + [offset - limit];
                        connection.query(sql3, (err, jobResults) => {
                            if(err) res.status(500).send(err);
    
                            res.status(200).json({jobs: jobResults, results});
                        });
                    } else {
                        res.status(200).json({jobs, results});
                    }
                })
            })
        });

    });
    
});



module.exports = router;







































/*
    connection.query(sql, (err, results) => {
        if(err) throw err;
    
        connection.query(sql2, (err, jobs) => {
            if(err) throw err;

            res.status(200).json({jobs, results});
            
        });        
    });
*/






















/*
router.post("/add", auth, (req, res) => {

    let { heading, name, description, value, credit, status } = req.body.job;
    // Required for updating purpose only
    let job_id = Number(req.body.job_id); 

    // if user mistakenly puts string inside input fields value & credit then return with an error message
    if(isNaN(value)) return res.status(400).json({msg: `value must be a number`});
    if(isNaN(credit)) return res.status(400).json({msg: `credit must be a number`});

    // If job_id is not empty string then update request has been made
    if(job_id !== 0) {
        // if numbers are sent as string from frontend, only thn node mysql module converts them into number and saves in the table
        // but if a specific column requires numbers but gets actual string then error will occur
        const sql = "update jobs set heading=?, name=?, description=?, value=?, credit=?, status=? where serial_no=?";
        const data = [heading, name, description, value, credit, status, job_id];

        connection.query(sql, data, (err) => {
            if(err) res.status(500).send(err);
            res.json({msg: "One Job Successfully Updated"});
        });
    } 
    // Else new add request has been made 
    else {
        // check to see if the job already exists or not
        connection.query("select * from jobs where name = ?", [name], (err, result) => {
            
            if(err) res.status(500).send(err);

            if(result.length) return res.status(400).json({msg: `Job ${name} already exists`});

            // if job doesn't exist, add it
            value = Number(value);
            credit = Number(credit);
        
            let serial_no = 1001;
        
            connection.query("select * from jobs", (err, jobs) => {
                if(err) res.status(500).send(err);
        
                serial_no = jobs.length + serial_no;
        
                let sql = "insert into jobs values ?";
                let values = [[serial_no, heading, name, description, value, credit, 0.00, credit, status]];
        
                connection.query(sql, [values], (err, result) => {
                    if(err) res.status(500).send(err);
                    
                    res.json({msg: "One job successfully added"});
                    
                });
            });
        });
    }

});

*/