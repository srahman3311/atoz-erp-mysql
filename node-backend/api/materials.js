const router = require("express").Router();
// Authorization
const auth = require("../middlewares/auth");

// DB Connection
const connection = require("../config/mysqlConnection");






/*
router.get("/", auth, (req, res) => {
    
    connection.query("select * from materials", (err, materials) => {
        if(err) res.status(500).send(err);

        res.json(materials);
    });
});




router.post("/", auth, (req, res) => {

    const {keyword} = req.body;
    console.log(keyword);

    let sql = "select * from materials where name LIKE '%" + [keyword] + "%'";
    
    connection.query(sql, (err, materials) => {
        if(err) res.status(500).send(err);
        res.status(200).json(materials);
    });

});
*/



// For Report Component
router.get("/", auth, (request, response) => {

    connection.query("select * from materials", (err, materials) => {
        // Error Checking
        if(err) return response.status(500).send(err);

        return response.status(200).json(materials);
    });
});


// For Report Component Job Filtering
router.post("/search", auth, (request, response) => {

    const { searchText } = request.body;

    let sql = "select * from materials where name LIKE '%" + [searchText] + "%'";

    connection.query(sql, (err, materials) => {
        // Error Checking
        if(err) return response.status(500).send(err);

        return response.status(200).json(materials);
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
        let sql = "select * from materials where name LIKE '%" + [keyword] + "%' OR unit LIKE '%" + [keyword] + "%'";
        connection.query(sql, (err, materials) => {

            // Error Checking
            if(err) return res.status(500).send(err);

            return res.status(200).json(materials);
        });
    } 
    // Else, post request is coming from Job Component
    else {
        // results are for just job list length
        let sql = "select * from materials where name LIKE '%" + [searchText] + "%' OR unit LIKE '%" + [searchText] + "%'";
        connection.query(sql, (err, results) => {
            // Error Checking
            if(err) return res.status(500).send(err);
            // if there are no items then return the empty array
            if(!results.length) return res.status(200).json({results, materials: results});

            sql2 = sql + " limit " + [limit] + " offset " + [offset];
            connection.query(sql2, (err, materials) => {
                if(err) return res.status(500).send(err);

                // if there are no items after offsetting then substract the limit value from offset and send found items. 
                if(!materials.length) {
                    const sql3 = sql + " limit " + [limit] + " offset " + [offset - limit];
                    connection.query(sql3, (err, materialResults) => {
                        if(err) res.status(500).send(err);

                        return res.status(200).json({materials: materialResults, results});
                    });
                } 
                // else just send the items after offsetting
                else {
                    return res.status(200).json({materials, results});
                }
            });
        });
            
    }
});






// Adding Or Updating Material
router.post("/add", auth, (req, res) => {

    // Destructuring req.body.material
    let {name, unit, status } = req.body.material;

    // Required for updating purpose only
    let materialID = Number(req.body.materialID); 
  
    // If materialID is not 0 then update request has been made
    if(materialID !== 0) {

        // to re-calculate the amount of 'balance' column based on new job value (if)added by user
        connection.query("select * from materials where serial_no = ?", [materialID], (err, result) => {

            // Error Checking
            if(err) return res.status(500).send(err);

            // Updating Material
            const sql = "update materials set name=?, unit=?, status=? where serial_no=?";
            const data = [name, unit, status, materialID];

            connection.query(sql, data, (err) => {

                // Error Checking
                if(err) return res.status(500).send(err);

                return res.json({msg: "One Material Successfully Updated"});
            });
        })
    } 
    // Else new add request has been made 
    else {
        // check to see if the job already exists or not
        connection.query("select * from materials where name = ?", [name], (err, result) => {
            
            if(err) return res.status(500).send(err);

            if(result.length) return res.status(400).json({msg: `Material ${name} already exists`});

            if(status === "") status = "Pending";

            // if Material doesn't exist, add it
            let serial_no = 1001;
        
            connection.query("select * from materials", (err, materials) => {
                
                // Error Checking
                if(err) return res.status(500).send(err);
        
                // if materials are already present in the material table
                if(materials.length) serial_no = materials[materials.length - 1].serial_no + 1;
        
                let sql = "insert into materials values ?";
                let values = [[serial_no, name, unit, status]];
                
                connection.query(sql, [values], (err) => {

                    // Error Checking
                    if(err) return res.status(500).send(err);
                    
                    return res.json({msg: "One Material successfully added"});
                    
                });
            });
        });
    }

});



// Deleting Jobs
router.post("/delete", auth, (req, res) => {
    // Destructuring req.body object
    let { materialName, limit, offset, searchText} = req.body;
  
   
    connection.query("delete from materials where serial_no = '" + [materialName] + "'", (err) => {
        if(err) return res.status(500).send(err);

        const sql = "select * from materials where name LIKE '%" + [searchText] + "%' OR unit LIKE '%" + [searchText] + "%'";
        connection.query(sql, (err, results) => {
            if(err) return res.status(500).send(err);

            if(!results.length) return res.status(200).json({results, materials: results});

            const sql2 = sql + " limit " + [limit] + " offset " + [offset];
            connection.query(sql2, (err, materials) => {
                if(err) return res.status(500).send(err);

                if(!materials.length) {
                    const sql3 = sql + " limit " + [limit] + " offset " + [offset - limit];
                    connection.query(sql3, (err, materialResults) => {
                        if(err) res.status(500).send(err);

                        res.status(200).json({materials: materialResults, results});
                    });
                } else {
                    res.status(200).json({materials, results});
                }
            })
        })
    });
    
});







/*
router.post("/", auth, (req, res) => {


    // for material editing at the frontend
    if(typeof req.body.material_id !== "undefined") {
        const searchId = req.body.material_id;

        connection.query("select * from materials where serial_no = ?", [searchId], (err, material) => {
            if(err) res.status(500).send(err);

            return res.json(material);
        });
    } 
    else {

        let sql;
        // When post request is coming from Expense Component
        if(typeof req.body.limit === "undefined") {
            const {keyword} = req.body;

            sql = "select * from materials where name LIKE '%" + [keyword] + "%'";
            connection.query(sql, (err, materials) => {
                if(err) res.status(500).send(err);
                res.status(200).json(materials);
            });
        } 
        // Else, post request is coming from Job Component
        else {
            // Need to send the table length to frontend, hence the select * from jobs
            connection.query("select * from materials", (err, results) => {

                if(err) res.status(500).send(err);

                const { limit, offset } = req.body;

                sql = "select * from materials limit " + [limit] + " offset " + [offset];
                connection.query(sql, (err, materials) => {
                    if(err) res.status(500).send(err);
                    res.status(200).json({results, materials});
                });
            });
            
        }
    }

});


/*
router.post("/search", auth, (req, res) => {

    const {limit, offset, text} = req.body;

    // to send the table length to frontend
    let sql = "select * from materials where name LIKE '%" + [text] + "%'";
    
    // to send matched subheads 
    let sql2 = sql + " limit " + [limit] + " offset " + [offset];

    connection.query(sql, (err, results) => {
        if(err) throw err;

        connection.query(sql2, (err, materials) => {
            if(err) throw err;

            if(!materials.length) {
                const sql3 = sql + " limit " + [limit] + " offset " + [offset - limit];
                connection.query(sql3, (err, materialResults) => {
                    if(err) res.status(500).send(err);

                    res.status(200).json({materials: materialResults, results});
                });
            } else {
                res.status(200).json({materials, results});
            }

           
            
        });        
    });
});

*/

/*
router.post("/add", auth, (req, res) => {


    const { name, unit } = req.body.material;
    // Required for updating purpose only
    let material_id = Number(req.body.material_id);

    let serial_no = 1001;

     // If material_id is not 0 then update request has been made
     if(material_id !== 0) {

        // if numbers are sent as string from frontend, only thn node mysql module converts them into number and saves in the table
        // but if a specific column requires numbers but gets actual string then error will occur
        const sql = "update materials set name=?, unit=? where serial_no=?";
        const data = [name, unit, material_id];

        connection.query(sql, data, (err) => {
            if(err) res.status(500).send(err);
            res.json({msg: "One Material Successfully Updated"});
        });

    } 
    // Else, new add request has been made.
    else {

        connection.query("select * from materials", (err, materials) => {

            if(err) res.status(500).send(err);

            serial_no = materials.length + serial_no;

            let sql = "insert into materials values ?";
            let values = [[ serial_no, name, unit ]];

            connection.query(sql, [values], (err, result) => {
                if(err) res.status(500).send(err);
                
                res.json({msg: "One Material successfully added"});
                
            });
        });
    }

    
});




router.post("/delete", auth, (req, res) => {

    const { _id } = req.body;

    connection.query("delete from materials where serial_no = '" + [_id] + "'", (err) => {
        if(err) return res.status(500).send(err);

        res.json({msg: "Successfully deleted"});
    });
});


*/













module.exports = router;