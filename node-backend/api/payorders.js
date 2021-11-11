const router = require("express").Router();
// DB Connection
const connection = require("../config/mysqlConnection");
// Authorization
const auth = require("../middlewares/auth");







router.post("/", auth, (req, res) => {
    // Destructuring req.body object
    const { limit, offset, searchText } = req.body;
    // results are for just payorder list length
    let sql = "select * from payorders where payorder_no LIKE '%" + [searchText] + "%' OR bank_name LIKE '%" + [searchText] 
    + "%' OR receiver_name LIKE '%" + [searchText] + "%' OR added_by LIKE '%" + [searchText] + "%' OR remarks LIKE '%" + 
    [searchText] + "%'";

    connection.query(sql, (err, results) => {
        // Error Checking
        if(err) return res.status(500).send(err);
        // if there are no items then return the empty array
        if(!results.length) return res.status(200).json({results, payorders: results});

        sql2 = sql + " limit " + [limit] + " offset " + [offset];
        connection.query(sql2, (err, payorders) => {
            if(err) return res.status(500).send(err);

            // if there are no items after offsetting then substract the limit value from offset and send found items. 
            if(!payorders.length) {
                const sql3 = sql + " limit " + [limit] + " offset " + [offset - limit];
                connection.query(sql3, (err, payorderResults) => {
                    // Error Checking
                    if(err) return res.status(500).send(err);

                    return res.status(200).json({payorders: payorderResults, results});
                });
            } 
            // else just send the items after offsetting
            else {
                return res.status(200).json({payorders, results});
            }
        });
    });
});




// For Adding & Updating Payorders
router.post("/add", auth, (req, res) => {
    // Destructuring req.body object
    let { payorderName, date } = req.body;  
    let { payorder_no, bank_name, branch_name, receiver_name, total_amount, remarks, release_status, approval_status, added_by } = req.body.payorder;

    // datepicker module sends date as string so it must be converted to date
    date = new Date(date);
    // Javascript always outputs the date time as per local timezone. Bangladesh time is 6 hours more from UTC/Z timezone
    // as a result correct dates are not displayed. So adding 6 hours with default time will solve this issue
    date = new Date(date.getTime() + 21600000); // 21600000 miliseconds here equals to 6 hours
    // converting total amount sent from string to Number, though node mysql module converts string to number automatically
    total_amount = Number(total_amount);

    if(!release_status) release_status = "not released";
    if(!approval_status) approval_status = "Pending";

    let serial_no = 1001;
    // If payorder_id is not empty string then update request has been made
    if(payorderName !== null) {

        // if numbers are sent as string from frontend, only thn node mysql module converts them into number and saves in the table
        // but if a specific column requires numbers but gets actual string then error will occur
        const sql = "update payorders set date_time=?, payorder_no=?, bank_name=?, branch_name=?, receiver_name=?, total_amount=?, release_status=?, approval_status=?, remarks=? where payorder_no=?";
        const data = [date, payorder_no, bank_name, branch_name, receiver_name, total_amount, release_status, approval_status, remarks, payorderName];

        connection.query(sql, data, (err) => {
            if(err) res.status(500).send(err);
            res.json({msg: "One Payorder Successfully Updated"});
        });
    } 
    // Else, new add request has been made.
    else {
        // check to see if payorder already exists
        connection.query("select * from payorders where payorder_no = ?", [payorder_no], (err, result) => {
            if(err) return res.status(500).send(err);

            // if result.length is true(not zero) then payorder exists so return with an error message
            if(result.length) return res.status(400).json({msg: `payorder ${payorder_no} already exists`});

            // if payorder doesn't exist then add it
            connection.query("select * from payorders", (err, payorders) => {
                if(err) res.status(500).send(err);
        
                // if payorders are already present in the payorder table
                if(payorders.length) serial_no = payorders[payorders.length - 1].serial_no + 1;
        
                let sql = "insert into payorders values ?";
                let values = [[serial_no, date, payorder_no, bank_name, branch_name, receiver_name, total_amount, release_status, approval_status, remarks, added_by]];
        
                connection.query(sql, [values], (err) => {
                    if(err) res.status(500).send(err);
                    res.json({msg: "One payorder successfully added"});
                });
            });
        });
    }

});




router.post("/delete", auth, (req, res) => {
    // Destructuring req.body object
    let { payorderName, limit, offset, searchText } = req.body;

    connection.query("delete from payorders where payorder_no = '" + [payorderName] + "'", (err) => {

        if(err) return res.status(500).send(err);

        // results are for just payorder list length
        let sql = "select * from payorders where payorder_no LIKE '%" + [searchText] + "%' OR bank_name LIKE '%" + [searchText] 
        + "%' OR receiver_name LIKE '%" + [searchText] + "%' OR added_by LIKE '%" + [searchText] + "%' OR remarks LIKE '%" + 
        [searchText] + "%'";

        connection.query(sql, (err, results) => {
            if(err) return res.status(500).send(err);

            if(!results.length) return res.status(200).json({results, payorders: results});

            const sql2 = sql + " limit " + [limit] + " offset " + [offset];
            connection.query(sql2, (err, payorders) => {
                if(err) return res.status(500).send(err);

                if(!payorders.length) {
                    const sql3 = sql + " limit " + [limit] + " offset " + [offset - limit];
                    connection.query(sql3, (err, payorderResults) => {
                        if(err) return res.status(500).send(err);

                        return res.status(200).json({payorders: payorderResults, results});
                    });
                } else {
                    res.status(200).json({payorders, results});
                }
            })
        })
    });
});











module.exports = router;