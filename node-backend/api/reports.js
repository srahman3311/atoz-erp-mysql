const router = require("express").Router();
// Authorization
const auth = require("../middlewares/auth");
// DB Connection
const connection = require("../config/mysqlConnection");



router.post("/jobs-expenses", auth, (request, response) => {

    let { job, material, subhead, user, status, startDate, endDate } = request.body;

    // console.log(request.body);
    // console.log(typeof startDate, typeof endDate);

    // If any of the below contains string 'All' then setting them to empty string will find all the records
    if(job === "All Jobs") job = "";
    if(material === "All Materials") material = "";
    if(subhead === "All Subheads") subhead = "";
    if(user === "All Users") user = "";
    if(status === "All Statuses") status = "";

    // Node mysql or just mysql requires dates in string to query. But time part should be ommitted to make the query successful  
    // startDate = new Date(startDate);
    // endDate = new Date(endDate);
    console.log(startDate, endDate);
    startDate = startDate.substring(0, startDate.indexOf("T"));
    endDate = endDate.substring(0, endDate.indexOf("T"));

    // But, in actual query string, time should be added to find the matching records. Reason for this is - timezone adjustment at the
    // time of adding a record in database table. For Bangladesh 6 hours should be added to produce the desired results.  
    let sqlQuery = "select * from expenses where date_time >= '" + [startDate] 
                    + " 00:00:00' and date_time <= '" + [endDate] + " 23:59:59' and job LIKE '%" + [job] 
                    + "%' and material_name LIKE '%" + [material] + "%' and subhead LIKE '%" + [subhead] 
                    + "%' and status LIKE '%" + [status] + "%' and spent_by LIKE '%" + [user] + "%'";

    connection.query(sqlQuery, (err, results) => {

        if(err) return response.status(500).send(err);

        return response.json({ results });
    });
});














































/*
    // Date
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    
    let startYear = startDate.getFullYear();
    let startMonth = startDate.getMonth() + 1;
    let startDay = startDate.getDate();

    let endYear = endDate.getFullYear();
    let endMonth = endDate.getMonth() + 1;
    let endDay = endDate.getDate();

    startDate = `${startYear}-${startMonth}-${startDay}`;
    endDate = `${endYear}-${endMonth}-${endDay}`;
    

    if(startMonth < 10) startDate = `${startYear}-0${startMonth}-${startDay}`;
    if(endMonth < 10) endDate = `${endYear}-0${endMonth}-${endDay}`;
    */








    /*
    // Destructuring req.body object. 
    const { limit, offset, searchText } = req.body;
    
    // Database query with searchText
    let sql = "select * from expenses where job LIKE '%" + [searchText] + "%' OR description LIKE '%" + [searchText] 
              + "%' OR material_name LIKE '%" + [searchText] + "%'";
    // results are for just database length length
    connection.query(sql, (err, results) => {

        if(err) return res.status(500).send(err);
        // if there is no record return with empty array
        if(!results.length) return res.status(200).json({results, expenses: results});
        // if there are records then perform offset limit operation and send records
        sql2 = sql + " limit " + [limit] + " offset " + [offset];

        connection.query(sql2, (err, expenses) => {

            if(err) return res.status(500).send(err);

            // if there are no items after offsetting then substract the limit value from offset and send found items. 
            if(!expenses.length) {

                const sql3 = sql + " limit " + [limit] + " offset " + [offset - limit];

                connection.query(sql3, (err, expenseResults) => {

                    if(err) res.status(500).send(err);

                    res.status(200).json({expenses: expenseResults, results});

                });
            } 
            // else just send the items after offsetting
            else {
                res.status(200).json({expenses, results});
            }
        });
    }); 
    */  



/*

// Adding/Updating Expense
router.post("/add", auth, (req, res) => {
    console.log(req.body);
    // destructuring expense object from req.body
    let { job, subhead, material, description, status, qty, unit_price, discount, upcharge } = req.body.expense;
    // destructuring materialUnit, date, spent_by from req.body
    let { materialUnit, date, spent_by } = req.body;
    // Required for updating purpose only
    const expense_id = Number(req.body.expenseID);
    // calculating total expense value and initializing expense serial number to update later if necessary
    let total = qty * unit_price;
    let serial_no = 1001;
    // extracting job name from job+job description
    const jobName = job.substring(0, job.indexOf(`(`));
    // converting qty and unit price to numbers;
    qty = Number(qty);
    unit_price = Number(unit_price);
    // datepicker module sends date as string so it must be converted to date
    date = new Date(date);
    // Javascript always outputs the date time as per local timezone. Bangladesh time is 6 hours more from UTC/Z timezone
    // as a result correct dates are not displayed. So adding 6 hours with default time will solve this issue
    date = new Date(date.getTime() + 21600000);

    // check to see if expense update request is made. if expense_id is not zero then it is update request
    if(expense_id) {
        // find the expense with the expense_id from expenses table
        connection.query("select * from expenses where serial_no = ?", [expense_id], (err, expense) => {
            // error checking
            if(err) return res.status(500).send(err);
            // need to check if update request is for entirely a different job or not
            const expenseJobName = expense[0].job.substring(0, expense[0].job.indexOf(`(`));
            // if both of the above job names are not same then update request is for a different job than previously updated
            if(jobName !== expenseJobName) {
                // update the debit, credit and balance value of previously updated job by this expense's values
                connection.query("select * from jobs where name = ?", [expenseJobName], (err, jobResult) => {
                    // error checking
                    if(err) return res.status(500).send(err);

                    const debit = Number(jobResult[0].debit) - Number(expense[0].total);
                    const credit = Number(jobResult[0].credit) + Number(expense[0].total);
                    const balance = Number(jobResult[0].balance) + Number(expense[0].total);
        
                    const sql = "update jobs set debit=?, credit=?, balance=? where name=?";
                    const data = [debit, credit, balance, expenseJobName];

                    connection.query(sql, data, (err) => {
                         // error checking
                        if(err) return res.status(500).send(err);
                        // previously updated job now has been re-updated, go ahead and add the expense to the requested job
                        connection.query("select * from jobs where name = ?", [jobName], (err, newJobResult) => {
                             // error checking
                            if(err) return res.status(500).send(err);
                            const newDebit = Number(newJobResult[0].debit) + total;
                            const newCredit = Number(newJobResult[0].credit) - total;
                            const newBalance = Number(newJobResult[0].balance) - total;

                            const newSql = "update jobs set debit=?, credit=?, balance=? where name=?";
                            const newData = [newDebit, newCredit, newBalance, jobName];

                            connection.query(newSql, newData, (err) => {
                                 // error checking
                                if(err) return res.status(500).send(err);
                                // updating expense
                                const sql = "update expenses set date_time=?, job=?, subhead=?, material_name=?, description=?, qty=?, unit=?, unit_price=?, discount=?, upcharge=?, total=?, status=? where serial_no=?";
                                const data = [date, job, subhead, material, description, qty, materialUnit, unit_price, discount, upcharge, total, status, expense_id];
                    
                                connection.query(sql, data, (err) => {
                                    // error checking
                                    if(err) return res.status(500).send(err);

                                    return res.json({msg: "One Expense Successfully Updated"});
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
                    // error checking
                    if(err) return res.status(500).send(err);

                    const debit = Number(jobResult[0].debit) - Number(expense[0].total) + total;
                    const credit = Number(jobResult[0].credit) + Number(expense[0].total) - total;
                    const balance = Number(jobResult[0].balance) + Number(expense[0].total) - total;
        
                    const sql = "update jobs set debit=?, credit=?, balance=? where name=?";
                    const data = [debit, credit, balance, jobName];

                    connection.query(sql, data, (err) => {
                        // error checking
                        if(err) return res.status(500).send(err);
                        // update expense
                        const sql = "update expenses set date_time=?, job=?, subhead=?, material_name=?, description=?, qty=?, unit=?, unit_price=?, discount=?, upcharge=?, total=?, status=? where serial_no=?";
                        const data = [date, job, subhead, material, description, qty, materialUnit, unit_price, discount, upcharge, total, status, expense_id];
            
                        connection.query(sql, data, (err) => {
                            // error checking
                            if(err) return res.status(500).send(err);

                            return res.json({msg: "One Expense Successfully Updated"});
                        });
                    });
                });
            }
            
        });
    }
    // else, new expense add request has been made
    else {
        connection.query("select * from expenses", (err, expenses) => {
            if(err) return res.status(500).send(err);
    
            // if expenses are already present in the job table
            if(expenses.length) serial_no = expenses[expenses.length - 1].serial_no + 1;

            connection.query("select * from jobs where name = ?", [jobName], (err, jobResult) => {
                // error checking
                if(err) return res.status(500).send(err);

                const debit = Number(jobResult[0].debit) + total;
                const credit = Number(jobResult[0].credit) - total;
                const balance = Number(jobResult[0].balance) - total;

                const newSql = "update jobs set debit=?, credit=?, balance=? where name=?";
                const newData = [debit, credit, balance, jobName];

                connection.query(newSql, newData, (err) => {
                    // error checking
                    if(err) return res.status(500).send(err);

                    let sql = "insert into expenses values ?";
                    let values = [[serial_no, date, job, subhead, material, description, qty, materialUnit, unit_price, discount, upcharge, total, "pending", spent_by]];
    
                    connection.query(sql, [values], (err) => {
                        // error checking
                        if(err) return res.status(500).send(err);

                        return res.json({msg: "One expense successfully added"});
                    });

                   
                });
            }); 


            
        });
    }

});




// Deleting Expenses
router.post("/delete", auth, (req, res) => {
    // destructuring req.body
    let { expenseName, limit, offset, searchText} = req.body;
    // Converting expenseName to Number
    expenseName = Number(expenseName);
   

    connection.query("select * from expenses where serial_no = '" + [expenseName] + "'", (err, expense) => {
        // Error Checking
        if(err) return res.status(500).send(err);
        // find the job to update debit, credit and balance by doing calculations
        const jobName = expense[0].job.substring(0, expense[0].job.indexOf(`(`));
        connection.query("select * from jobs where name = '" + [jobName] + "'", (err, job) => {
            // Error Checking
            if(err) return res.status(500).send(err);
            // performing calculations on job's debit, credit and balance values by total expense value
            const debit = job[0].debit - expense[0].total;
            const credit = job[0].credit + expense[0].total;
            const balance = job[0].balance + expense[0].total;

            const sql = "update jobs set debit=?, credit=?, balance=? where name=?";
            const data = [debit, credit, balance, jobName];

            connection.query(sql, data, (err) => {
                // Error Checking
                if(err) return res.status(500).send(err);

                connection.query("delete from expenses where serial_no = '" + [expenseName] + "'", (err) => {
                    if(err) return res.status(500).send(err);
            
                    let sql = "select * from expenses where job LIKE '%" + [searchText] + "%' OR description LIKE '%" + [searchText] 
                              + "%' OR material_name LIKE '%" + [searchText] + "%'";
                    connection.query(sql, (err, results) => {
                        if(err) return res.status(500).send(err);

                        // if there is no record return with empty array
                        if(!results.length) return res.status(200).json({results, expenses: results});
            
                        const sql2 = sql + " limit " + [limit] + " offset " + [offset];
                        connection.query(sql2, (err, expenses) => {
                            if(err) return res.status(500).send(err);
            
                            if(!expenses.length) {
                                const sql3 = sql + " limit " + [limit] + " offset " + [offset - limit];
                                connection.query(sql3, (err, expenseResults) => {
                                    if(err) res.status(500).send(err);
            
                                    return res.status(200).json({expenses: expenseResults, results});
                                });
                            } else {
                                return res.status(200).json({expenses, results});
                            }
                        })
                    })
                });
                
            });
        });
    });
   
});




*/






















































































































































































































































/*
router.get("/", auth, (req, res) => {
    
    connection.query("select * from expenses", (err, expenses) => {
        if(err) res.status(500).send(err);

        res.json(expenses);
    });
});
*/

/*
router.get("/", auth, (req, res) => {
    
    connection.query("select * from expenses", (err, expenses) => {
        if(err) res.status(500).send(err);

        const dbLength = expenses.length - 15;

        connection.query("select * from expenses limit 15 offset " + [dbLength], (err, results) => {
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

        sql = "SELECT * FROM expenses WHERE date_time BETWEEN '" + [x] + "' AND '" + [y] + "' AND spent_by = '" + [username] + "'";
    } 
    
    else {
        sql = "SELECT * FROM expenses WHERE spent_by = '" + [username] + "'";
    }

    
     

    connection.query(sql, (err, expenses) => {

        if(err) res.status(500).send(err);

        if(expenses.length === 0) {
            return res.status(404).json({msg: "No Data Found"});
        }

        console.log(expenses);
        res.json(expenses);
    });

    //const {limit, offset, searchValue} = req.body;
    
    /*
    let sql = "select * from expenses where payorder_no LIKE '%" 
                + [searchValue] + "%' OR receiver_name LIKE '%" 
                + [searchValue] + "%' OR bank_name LIKE '%" + [searchValue] + "%' limit " + [limit] + " offset " + [offset];

    */

    /*
    let sql = "select * from expenses where payorder_no LIKE '%" 
            + [searchValue] + "%' OR receiver_name LIKE '%" 
            + [searchValue] + "%' OR bank_name LIKE '%" + [searchValue] + "%'";
    
    
    let sql2 = sql + " limit " + [limit] + " offset " + [offset];


    connection.query(sql, (err, results) => {

        if(err) throw err;
    
        connection.query(sql2, (err, expenses) => {

            if(err) throw err;

            res.status(200).json({expenses, dbLength: results.length});
            
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


        // else subhead is selected from dropdown, go ahead and save the expense
        date_time = new Date(date_time);
        qty = Number(qty);
        unit_price = Number(unit_price);
        discount = Number(discount);
        upcharge = Number(upcharge);
        let total = qty * unit_price;
        let serial_no = 1001;

        connection.query("select * from expenses", (err, expenses) => {
            if(err) return res.status(500).send(err);
    
            serial_no = expenses.length + serial_no;
    
            let sql = "insert into expenses values ?";
            let values = [[serial_no, date_time, job, subhead, material_name, description, qty, unit, unit_price, discount, upcharge, total, "pending", "pending", "pending", spent_by]];
    
            connection.query(sql, [values], (err, result) => {
                if(err) return res.status(500).send(err);
                
                res.json({msg: "One expense successfully added"});
                
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

     // for expense editing at the frontend
     if(typeof req.body.expense_id !== "undefined") {
        const searchId = req.body.expense_id;

        connection.query("select * from expenses where serial_no = ?", [searchId], (err, expense) => {
            if(err) res.status(500).send(err);

            return res.json(expense);
        });
    } 
    else {

        connection.query("select * from expenses", (err, results) => {

            if(err) res.status(500).send(err);

            const { limit, offset } = req.body;

            sql = "select * from expenses limit " + [limit] + " offset " + [offset];
            connection.query(sql, (err, expenses) => {

                if(err) res.status(500).send(err);

                res.status(200).json({results, expenses});
            });
        });
    }
});






router.post("/search", auth, (req, res) => {

    console.log(req.body);
    const {limit, offset, text} = req.body;

    // to send the table length to frontend
    let sql = "select * from expenses where job LIKE '%" 
              + [text] + "%' OR description LIKE '%" 
              + [text] + "%' OR material_name LIKE '%" + [text] + "%'";


    // let sql;

    // if(!text) {
    //     sql = "select * from expenses";
    // } else {
    //     sql = "select * from expenses where job LIKE '%" 
    //           + [text] + "%' OR material_name LIKE '%" 
    //           + [text] + "%' OR description LIKE '%" + [text] + "%'";
    // }

    
    
    // to send matched expenses 
    let sql2 = sql + " limit " + [limit] + " offset " + [offset];

    connection.query(sql, (err, results) => {
        if(err) throw err;
    
        connection.query(sql2, (err, expenses) => {
            if(err) throw err;

            if(!expenses.length) {
                const sql3 = sql + " limit " + [limit] + " offset " + [offset - limit];
                connection.query(sql3, (err, expenseResults) => {
                    if(err) res.status(500).send(err);

                    res.status(200).json({expenses: expenseResults, results});
                });
            } else {
                res.status(200).json({expenses, results});
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
    const expense_id = Number(req.body.expense_id);

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

        // else subhead is selected from dropdown, go ahead and save the expense
        qty = Number(qty);
        unit_price = Number(unit_price);
        discount = Number(discount);
        upcharge = Number(upcharge);
        let total = qty * unit_price;
        let serial_no = 1001;

        // If expense_id is not 0 then update request has been made
        if(expense_id !== 0) {
            // Updating Job's Debit Value
            connection.query("select * from jobs where name = ?", [job.substring(0, job.indexOf(`(`))], (err, jobResult) => {
                if(err) res.status(500).send(err);
         

                connection.query("select * from expenses where serial_no = ?", [expense_id], (err, expenseResult) => {
                    if(err) res.status(500).send(err);
            
                    const newDebitValue = Number(jobResult[0].debit) - Number(expenseResult[0].total) + total;
        
                    const jobDebitUpdateSql = "update jobs set debit=? where name=?";
                    const jobDebitUpdateData = [newDebitValue, job.substring(0, job.indexOf(`(`))];

                    connection.query(jobDebitUpdateSql, jobDebitUpdateData, (err) => {
                        if(err) res.status(500).send(err);
                        // Updating Expense
                        // if numbers are sent as string from frontend, only thn node mysql module converts them into number and saves in the table
                        // but if a specific column requires numbers but gets actual string then error will occur
                        const sql = "update expenses set date_time=?, job=?, subhead=?, material_name=?, description=?, qty=?, unit=?, unit_price=?, discount=?, upcharge=?, total=? where serial_no=?";
                        const data = [date_time, job, subhead, material_name, description, qty, unit, unit_price, discount, upcharge, total, expense_id];
            
                        connection.query(sql, data, (err) => {
                            if(err) res.status(500).send(err);
                            res.json({msg: "One Expense Successfully Updated"});
                        });
                    });
                });

            });
        } 
        // Else, new add request has been made.
        else {
            connection.query("select * from expenses", (err, expenses) => {
                if(err) return res.status(500).send(err);
        
                serial_no = expenses.length + serial_no;

                let sql = "insert into expenses values ?";
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
                            res.json({msg: "One expense successfully added"});
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
    connection.query("select * from expenses where serial_no = ?", [_id], (err, expense) => {
        if(err) return res.status(500).send(err);

        const job = expense[0].job.substring(0, expense[0].job.indexOf(`(`));

        connection.query("select * from jobs where name = ?", [job], (err, job) => {
            if(err) return res.status(500).send(err);
        });
    });
    */

/*

    connection.query("delete from expenses where serial_no = '" + [_id] + "'", (err) => {
        if(err) return res.status(500).send(err);

        res.json({msg: "Successfully deleted"});
    });
});
*/












module.exports = router;