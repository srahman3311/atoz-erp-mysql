const router = require("express").Router();
// Authorization
const auth = require("../middlewares/auth");
// DB Connection
const connection = require("../config/mysqlConnection");





router.post("/", auth, (req, res) => {

    const { limit, offset, searchText } = req.body;
    
    // Database query with searchText
    let sql = "select * from credits where job LIKE '%" + [searchText] + "%' OR remarks LIKE '%" + [searchText] + "%'";

    // results parameter is for just database length
    connection.query(sql, (err, results) => {

        if(err) return res.status(500).send(err);

        // if there is no record return with empty array
        if(!results.length) return res.status(200).json({results, credits: results});

        // if there are records then perform offset limit operation and send records
        sql2 = sql + " limit " + [limit] + " offset " + [offset];

        connection.query(sql2, (err, credits) => {

            if(err) return res.status(500).send(err);

            // if there are no items after offsetting then substract the limit value from offset and send found items. 
            if(!credits.length) {

                const sql3 = sql + " limit " + [limit] + " offset " + [offset - limit];

                connection.query(sql3, (err, creditResults) => {

                    if(err) res.status(500).send(err);

                    res.status(200).json({credits: creditResults, results});

                });
            } 
            // else just send the items after offsetting
            else {
                res.status(200).json({credits, results});
            }
        });
    });   
    
});





// Adding/Updating Credit
router.post("/add", auth, (req, res) => {
    
    let { job, amount, remarks } = req.body.credit;
    let { date } = req.body;
    const credit_id = Number(req.body.creditID);
    amount = Number(amount);

    let serial_no = 1001;

    // separating job name from job+job description
    const jobName = job.substring(0, job.indexOf(`(`));

    // datepicker module sends date as string so it must be converted to date
    // Javascript always outputs the date time as per local timezone. Bangladesh time is 6 hours more from UTC/Z timezone
    // as a result correct dates are not displayed. So adding 6 hours with default time will solve this issue
    date = new Date(date);
    date = new Date(date.getTime() + 21600000);

    // check to see if credit update request is made. if credit_id is not zero then it is update request
    if(credit_id) {
    
        connection.query("select * from credits where serial_no = ?", [credit_id], (err, credit) => {
        
            if(err) return res.status(500).send(err);

            // need to check if update request is for entirely a different job or not
            // if both of the above job names are not same then update request is for a different job than previously added
            const creditJobName = credit[0].job.substring(0, credit[0].job.indexOf(`(`));

            if(jobName !== creditJobName) {

                // update the credit value of previously updated job by this credit's values
                connection.query("select * from jobs where name = ?", [creditJobName], (err, jobResult) => {
                    
                    if(err) return res.status(500).send(err);

                    const updatedCredit = Number(jobResult[0].credit) - Number(credit[0].amount);
        
                    const sql = "update jobs set credit=? where name=?";
                    const data = [updatedCredit, creditJobName];

                    connection.query(sql, data, (err) => {
                         
                        if(err) return res.status(500).send(err);

                        // previously updated job now has been re-updated, go ahead and add the credit to the requested job
                        connection.query("select * from jobs where name = ?", [jobName], (err, newJobResult) => {
                             
                            if(err) return res.status(500).send(err);
                           
                            const newCredit = Number(newJobResult[0].credit) + amount;

                            const newSql = "update jobs set credit=? where name=?";
                            const newData = [newCredit, jobName];

                            connection.query(newSql, newData, (err) => {
                                 
                                if(err) return res.status(500).send(err);

                                // updating credits table with new amount
                                const sql = "update credits set date_time=?, job=?, amount=?, remarks=? where serial_no=?";
                                const data = [date, job, amount, remarks, credit_id];
                    
                                connection.query(sql, data, (err) => {
                                    
                                    if(err) return res.status(500).send(err);

                                    return res.json({msg: "One credit Successfully Updated"});
                                });
                            });
                        });
                    });
                });
            }
            // if both jobs are same then update the requested job's values
            else {
                // find the job to update
                connection.query("select * from jobs where name = ?", [jobName], (err, jobResult) => {
                    
                    if(err) return res.status(500).send(err);

                    const updatedCredit = Number(jobResult[0].credit) - Number(credit[0].amount) + amount;
        
                    const sql = "update jobs set credit=? where name=?";
                    const data = [updatedCredit, jobName];

                    connection.query(sql, data, (err) => {
                        
                        if(err) return res.status(500).send(err);

                        // update credit
                        const sql = "update credits set date_time=?, job=?, amount=?, remarks=? where serial_no=?";
                        const data = [date, job, amount, remarks, credit_id];
            
                        connection.query(sql, data, (err) => {
                            
                            if(err) return res.status(500).send(err);

                            return res.json({msg: "One credit Successfully Updated"});
                        });
                    });
                });
            }
            
        });
    }
    // else, new credit add request has been made
    else {
        // this query is for setting a unique credit serial_no
        connection.query("select * from credits", (err, credits) => {

            if(err) return res.status(500).send(err);
    
            // if credits are already present in the job table
            if(credits.length) serial_no = credits[credits.length - 1].serial_no + 1;

            connection.query("select * from jobs where name = ?", [jobName], (err, jobResult) => {
                
                if(err) return res.status(500).send(err);

                
                const newCredit = Number(jobResult[0].credit) + amount;
                console.log(newCredit, typeof newCredit);
                

                const newSql = "update jobs set credit=? where name=?";
                const newData = [newCredit, jobName];

                connection.query(newSql, newData, (err) => {
                    
                    if(err) return res.status(500).send(err);

                    let sql = "insert into credits values ?";
                    let values = [[serial_no, date, job, amount, remarks]];
    
                    connection.query(sql, [values], (err) => {
                        
                        if(err) return res.status(500).send(err);

                        return res.json({msg: "One credit successfully added"});
                    });

                   
                });
            }); 


            
        });
    }

});




// Deleting credits
router.post("/delete", auth, (req, res) => {

    let { creditName, limit, offset, searchText} = req.body;

    creditName = Number(creditName);
   

    connection.query("select * from credits where serial_no = '" + [creditName] + "'", (err, credit) => {
        
        if(err) return res.status(500).send(err);

        // find the job to update credit
        const jobName = credit[0].job.substring(0, credit[0].job.indexOf(`(`));

        connection.query("select * from jobs where name = '" + [jobName] + "'", (err, job) => {
            
            if(err) return res.status(500).send(err);

            const newCredit = job[0].credit - credit[0].amount;

            const sql = "update jobs set credit=? where name=?";
            const data = [newCredit, jobName];

            connection.query(sql, data, (err) => {
                
                if(err) return res.status(500).send(err);

                connection.query("delete from credits where serial_no = '" + [creditName] + "'", (err) => {

                    if(err) return res.status(500).send(err);
            
                    let sql = "select * from credits where job LIKE '%" + [searchText] + "%' OR remarks LIKE '%" + [searchText] + "%'";

                    connection.query(sql, (err, results) => {

                        if(err) return res.status(500).send(err);

                        // if there is no record return with empty array
                        if(!results.length) return res.status(200).json({results, credits: results});
            
                        const sql2 = sql + " limit " + [limit] + " offset " + [offset];

                        connection.query(sql2, (err, credits) => {

                            if(err) return res.status(500).send(err);
            
                            if(!credits.length) {
                                const sql3 = sql + " limit " + [limit] + " offset " + [offset - limit];
                                connection.query(sql3, (err, creditResults) => {
                                    if(err) res.status(500).send(err);
            
                                    return res.status(200).json({credits: creditResults, results});
                                });
                            } else {
                                return res.status(200).json({credits, results});
                            }
                        })
                    })
                });
                
            });
        });
    });
   
});



























































































































































































































































/*
router.get("/", auth, (req, res) => {
    
    connection.query("select * from credits", (err, credits) => {
        if(err) res.status(500).send(err);

        res.json(credits);
    });
});
*/

/*
router.get("/", auth, (req, res) => {
    
    connection.query("select * from credits", (err, credits) => {
        if(err) res.status(500).send(err);

        const dbLength = credits.length - 15;

        connection.query("select * from credits limit 15 offset " + [dbLength], (err, results) => {
            if(err) res.status(500).send(err);
            
            res.json(results);
        })

    });
});



router.post("/search", auth, (req, res) => {

    let {startDate, endDate, username} = req.body;

    let sql;

    if(startDate !== null && endDate !== null) {
        let x = new Date(startDate);
        let y = new Date(endDate);
    
        let startYear = x.getFullYear();
        let startMonth = x.getMonth() + 1;
        let startDay = x.getDate();

        let endYear = y.getFullYear();
        let endMonth = y.getMonth() + 1;
        let endDay = y.getDate();

        x = `${startYear}-${startMonth}-${startDay}`;
        y = `${endYear}-${endMonth}-${endDay}`;

        if(startMonth < 10) x = `${startYear}-0${startMonth}-${startDay}`;
        if(endMonth < 10) y = `${endYear}-0${endMonth}-${endDay}`;

        console.log(x, y);

        sql = "SELECT * FROM credits WHERE date_time BETWEEN '" + [x] + "' AND '" + [y] + "' AND spent_by = '" + [username] + "'";
    } 
    
    else {
        sql = "SELECT * FROM credits WHERE spent_by = '" + [username] + "'";
    }

    
     

    connection.query(sql, (err, credits) => {

        if(err) res.status(500).send(err);

        if(credits.length === 0) {
            return res.status(404).json({msg: "No Data Found"});
        }

        console.log(credits);
        res.json(credits);
    });

    //const {limit, offset, searchValue} = req.body;
    
    /*
    let sql = "select * from credits where payorder_no LIKE '%" 
                + [searchValue] + "%' OR receiver_name LIKE '%" 
                + [searchValue] + "%' OR bank_name LIKE '%" + [searchValue] + "%' limit " + [limit] + " offset " + [offset];

    */

    /*
    let sql = "select * from credits where payorder_no LIKE '%" 
            + [searchValue] + "%' OR receiver_name LIKE '%" 
            + [searchValue] + "%' OR bank_name LIKE '%" + [searchValue] + "%'";
    
    
    let sql2 = sql + " limit " + [limit] + " offset " + [offset];


    connection.query(sql, (err, results) => {

        if(err) throw err;
    
        connection.query(sql2, (err, credits) => {

            if(err) throw err;

            res.status(200).json({credits, dbLength: results.length});
            
        });        
    });
    */
   /*
});








router.post("/add", auth, (req, res) => {
   
    let {
       date_time, job, subhead, material_name, description, qty, unit, unit_price, discount, upcharge, spent_by
    } = req.body;

   
    // if job doesn't include '(' then it hasn't been selected from dropdown at the frontend
    if(!job.includes("(")) {
        return res.status(404).json({msg: `Job ${req.body.job} not found`});
    }


    // if user mistakenly puts string inside input fields qty, unit price, discount & upcharge then return with an error message
    if(isNaN(qty)) return res.status(400).json({msg: `qty must be a number`});
    if(isNaN(unit_price)) return res.status(400).json({msg: `unit price must be a number`});
    if(isNaN(discount)) return res.status(400).json({msg: `discount must be a number`});
    if(isNaN(upcharge)) return res.status(400).json({msg: `upcharge must be a number`});
    
    // check to see if subhead is selected from dropdown or not
    connection.query("select * from subheads where name = ?", [subhead], (err, subheadResult) => {
        
        if(err) return res.status(500).send(err);

        if(!subheadResult.length) {
            return res.status(404).json({msg: "Subhead " + subhead + " not found"});
        } 


        // else subhead is selected from dropdown, go ahead and save the credit
        date_time = new Date(date_time);
        qty = Number(qty);
        unit_price = Number(unit_price);
        discount = Number(discount);
        upcharge = Number(upcharge);
        let total = qty * unit_price;
        let serial_no = 1001;

        connection.query("select * from credits", (err, credits) => {
            if(err) return res.status(500).send(err);
    
            serial_no = credits.length + serial_no;
    
            let sql = "insert into credits values ?";
            let values = [[serial_no, date_time, job, subhead, material_name, description, qty, unit, unit_price, discount, upcharge, total, "pending", "pending", "pending", spent_by]];
    
            connection.query(sql, [values], (err, result) => {
                if(err) return res.status(500).send(err);
                
                res.json({msg: "One credit successfully added"});
                
            });
        });
       
    });

    /*

    // Material
    connection.query("select * from materials where name = ?", [material_name], (err, result) => {
        if(err) return res.status(404).json({msg: "Material " + material_name + " not found"});
    });
    */




    


    /*
    const jobString = job.substring(0, job.indexOf("("));
    console.log(jobString);

    connection.query("select * from jobs where name = ?", [jobString], (err, jobs) => {
        if(err) return res.status(500).send(err);

        connection.query("update jobs set debit = " + [jobs[0].debit + total] + " where name = '" + [jobs[0].name] + "'", (err, result) => {
            if(err) return res.status(500).send(err);

            console.log("updated");
        })
       
    });
    */
    

   /*
    
});



*/






/*

router.post("/", auth, (req, res) => {

     // for credit editing at the frontend
     if(typeof req.body.credit_id !== "undefined") {
        const searchId = req.body.credit_id;

        connection.query("select * from credits where serial_no = ?", [searchId], (err, credit) => {
            if(err) res.status(500).send(err);

            return res.json(credit);
        });
    } 
    else {

        connection.query("select * from credits", (err, results) => {

            if(err) res.status(500).send(err);

            const { limit, offset } = req.body;

            sql = "select * from credits limit " + [limit] + " offset " + [offset];
            connection.query(sql, (err, credits) => {

                if(err) res.status(500).send(err);

                res.status(200).json({results, credits});
            });
        });
    }
});






router.post("/search", auth, (req, res) => {

    console.log(req.body);
    const {limit, offset, text} = req.body;

    // to send the table length to frontend
    let sql = "select * from credits where job LIKE '%" 
              + [text] + "%' OR description LIKE '%" 
              + [text] + "%' OR material_name LIKE '%" + [text] + "%'";


    // let sql;

    // if(!text) {
    //     sql = "select * from credits";
    // } else {
    //     sql = "select * from credits where job LIKE '%" 
    //           + [text] + "%' OR material_name LIKE '%" 
    //           + [text] + "%' OR description LIKE '%" + [text] + "%'";
    // }

    
    
    // to send matched credits 
    let sql2 = sql + " limit " + [limit] + " offset " + [offset];

    connection.query(sql, (err, results) => {
        if(err) throw err;
    
        connection.query(sql2, (err, credits) => {
            if(err) throw err;

            if(!credits.length) {
                const sql3 = sql + " limit " + [limit] + " offset " + [offset - limit];
                connection.query(sql3, (err, creditResults) => {
                    if(err) res.status(500).send(err);

                    res.status(200).json({credits: creditResults, results});
                });
            } else {
                res.status(200).json({credits, results});
            }
            
        });        
    });
});


*/

/*
router.post("/add", auth, (req, res) => {

    let {
        date_time, job, subhead, material_name, description, qty, unit, unit_price, discount, upcharge, spent_by
     } = req.body.data;

    
    //console.log(job.substring(0, job.indexOf(`(`)));
    // Required for updating purpose only
    const credit_id = Number(req.body.credit_id);

     // if job doesn't include '(' then it hasn't been selected from dropdown at the frontend
     if(!job.includes("(")) {
        return res.status(404).json({msg: `Job ${req.body.job} not found`});
    }

    // if user mistakenly puts string inside input fields qty, unit price, discount & upcharge then return with an error message
    if(isNaN(qty)) return res.status(400).json({msg: `qty must be a number`});
    if(isNaN(unit_price)) return res.status(400).json({msg: `unit price must be a number`});
    if(isNaN(discount)) return res.status(400).json({msg: `discount must be a number`});
    if(isNaN(upcharge)) return res.status(400).json({msg: `upcharge must be a number`});
    
    // check to see if subhead is selected from dropdown or not
    connection.query("select * from subheads where name = ?", [subhead], (err, subheadResult) => {
        
        if(err) return res.status(500).send(err);

        if(!subheadResult.length) return res.status(404).json({msg: "Subhead " + subhead + " not found"});
        // datepicker module sends date as string so it must be converted to date
        date_time = new Date(date_time);
        // Javascript always outputs the date time as per local timezone. Bangladesh time is 6 hours more from UTC/Z timezone
        // as a result correct dates are not displayed. So adding 6 hours with default time will solve this issue
        date_time = new Date(date_time.getTime() + 21600000);

        // else subhead is selected from dropdown, go ahead and save the credit
        qty = Number(qty);
        unit_price = Number(unit_price);
        discount = Number(discount);
        upcharge = Number(upcharge);
        let total = qty * unit_price;
        let serial_no = 1001;

        // If credit_id is not 0 then update request has been made
        if(credit_id !== 0) {
            // Updating Job's Debit Value
            connection.query("select * from jobs where name = ?", [job.substring(0, job.indexOf(`(`))], (err, jobResult) => {
                if(err) res.status(500).send(err);
         

                connection.query("select * from credits where serial_no = ?", [credit_id], (err, creditResult) => {
                    if(err) res.status(500).send(err);
            
                    const newDebitValue = Number(jobResult[0].debit) - Number(creditResult[0].total) + total;
        
                    const jobDebitUpdateSql = "update jobs set debit=? where name=?";
                    const jobDebitUpdateData = [newDebitValue, job.substring(0, job.indexOf(`(`))];

                    connection.query(jobDebitUpdateSql, jobDebitUpdateData, (err) => {
                        if(err) res.status(500).send(err);
                        // Updating credit
                        // if numbers are sent as string from frontend, only thn node mysql module converts them into number and saves in the table
                        // but if a specific column requires numbers but gets actual string then error will occur
                        const sql = "update credits set date_time=?, job=?, subhead=?, material_name=?, description=?, qty=?, unit=?, unit_price=?, discount=?, upcharge=?, total=? where serial_no=?";
                        const data = [date_time, job, subhead, material_name, description, qty, unit, unit_price, discount, upcharge, total, credit_id];
            
                        connection.query(sql, data, (err) => {
                            if(err) res.status(500).send(err);
                            res.json({msg: "One credit Successfully Updated"});
                        });
                    });
                });

            });
        } 
        // Else, new add request has been made.
        else {
            connection.query("select * from credits", (err, credits) => {
                if(err) return res.status(500).send(err);
        
                serial_no = credits.length + serial_no;

                let sql = "insert into credits values ?";
                let values = [[serial_no, date_time, job, subhead, material_name, description, qty, unit, unit_price, discount, upcharge, total, "pending", "pending", "pending", spent_by]];
        
                connection.query(sql, [values], (err) => {
                    if(err) return res.status(500).send(err);

                    connection.query("select * from jobs where name = ?", [job.substring(0, job.indexOf(`(`))], (err, jobResult) => {
                        if(err) return res.status(500).send(err);

                        const newDebitValue = Number(jobResult[0].debit) + total;
                        const newCreditValue = Number(jobResult[0].credit) - total;
                        const jobDebitUpdateSql = "update jobs set debit=?, credit=? where name=?";
                        const jobDebitUpdateData = [newDebitValue, newCreditValue, job.substring(0, job.indexOf(`(`))];

                        connection.query(jobDebitUpdateSql, jobDebitUpdateData, (err) => {
                            if(err) return res.status(500).send(err);
                            res.json({msg: "One credit successfully added"});
                        });
                    });
                    
                    
                });
            });
        }
    });

});





router.post("/delete", auth, (req, res) => {

    const { _id } = req.body;

    /*
    // Need to reduce the related job's debit and credit values first, then delete
    connection.query("select * from credits where serial_no = ?", [_id], (err, credit) => {
        if(err) return res.status(500).send(err);

        const job = credit[0].job.substring(0, credit[0].job.indexOf(`(`));

        connection.query("select * from jobs where name = ?", [job], (err, job) => {
            if(err) return res.status(500).send(err);
        });
    });
    */

/*

    connection.query("delete from credits where serial_no = '" + [_id] + "'", (err) => {
        if(err) return res.status(500).send(err);

        res.json({msg: "Successfully deleted"});
    });
});
*/












module.exports = router;