const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express()
const PORT = 8000

const mysql = require("mysql2")
const db = mysql.createConnection({
    host: "192.168.1.222", //Förmodligen localhost för dig
    user: "henjoh", //sql username
    password : '1qaz!QAZ2wsx@WSX', //sql password
    database : "henjoh", //sql databasnamnet,
});

const secret = "this is a super super long secret ideally done in environment variables";
const secret2 = "this is a different but equally long secret which should also be ideally done in environment variables";

app.use(cookieParser(secret));

app.use(
   express.urlencoded({
     extended: true,
   }) 
);

const cors = require("cors");

app.use(cors({
 credentials : true,
 origin : "http://localhost:5173"
}))

app.use(express.json());
app.use(
    express.urlencoded({
      extended: true,
    })
);

//post method for signup
app.post('/test/signup', (req,res) =>{
    const saltrounds = 10;
    bcrypt.genSalt(saltrounds, (err,salt) =>{
        bcrypt.hash(req.body.password, salt, (err, hash) =>{
            // Din databas query här, INSERT INTO 
            db.query(
                `INSERT INTO accounts (username, password) VALUES ("${req.body.username}", "${hash}")`,
                function(err, results){
                    if(!err){
                        res.status(200).json({message: "User created sucessfully."})
                    }
                    else{
                        console.log(err);
                        res.status(400).json({error:err.sqlMessage})
                    }
                }
            )
        })
    })
})

app.post('/post-sign-in', (req,res) =>{
    jwt.verify(req.cookies["token"], secret2, function(err, decoded) {
        if(err) {
          console.log(err);
        } 
        console.log("user can now post")
    })
})

//post method for login 
app.post('/test/login', (req, res) => {
    db.query(
        `SELECT username, password, account_id FROM accounts WHERE username="${req.body.username}"`,
        function(err, result){
            if(err){
                console.log(err)
                res.send(400).json({message:err.sqlMessage})
            }
            else if(result.length === 0){
                res.status(404).json({message: "User not found"})
            }
            else{
                bcrypt.compare(req.body.password, result[0].password.toString(), (err, match) => {
                    if(match){
                        const sess_id = crypto.randomBytes(32).toString('base64');
                        console.log(result)
                        db.query(
                            `INSERT INTO sessions (session_id, username, account_id) VALUES ("${sess_id}", "${req.body.username}", ${result[0].account_id})`,
                            function(err){
                                if(err){
                                    throw err;
                                }
                                else{
                                    const smth = jwt.sign({username : req.body.username}, secret2, {expiresIn : 43200})
                                    res
                                    .cookie("token", smth, {httpOnly: true, maxAge : 12 * 60 * 60 * 1000, sameSite : "lax"})
                                    .cookie("session_id", sess_id, {httpOnly: false, maxAge : 12 * 60 * 60 * 1000, sameSite : "lax"})
                                    .status(200)
                                    .json({message: "Password match!"})
                                }
                            }
                        )
                        
                    }
                    else{
                        res.status(401).json({message: "Passwords do not match"})
                    }
                })
            }
        }
    ) 
});

app.post('/post', (req,res) =>{
    const saltrounds = 10;
        //query for inserting the posts value into table posts
        db.query(
                `INSERT INTO posts (content) VALUES ("${req.body.content}")`,
                function(err, results){
                    if(!err){
                        res.status(200).json({message: "Post created sucessfully."})
                    }
                    else{
                        console.log(err);
                        res.status(400).json({error:err.sqlMessage})
                    }
        }
     )
})

//post method for commenting
app.post('/comments', (req,res) =>{
    const saltrounds = 10;
        //query for insering comments value into table comment
          db.query(
                `INSERT INTO comments (content) VALUES ("${req.body.content}")`,
                function(err, results){
                    if(!err){
                        res.status(200).json({message: "Comment created sucessfully."})
                    }
                    else{
                        console.log('the comment was not created ' + err);
                        res.status(400).json({error:err.sqlMessage})
                    }
                }
            )
})

//post geting a users username, bio, email and when the acccount was created
app.get('/test/users/:user', (req, res) =>{
    console.log(req.params.user)
    db.query(
        `SELECT username, pass FROM accounts WHERE username = "${req.params.user}"`,
        function(err, results){
            if(err){
                res.status(400).json({error:err.sqlMessage})
            }
            else if (results.length === 0){
                res.status(404).json({message: "User not found."})
            }
            else{
                results[0].pass = results[0].pass.toString();
                res.status(200).json(results)
            }
        }
    )
})

    
  

app.put("/test/change", (req, res) => {
    console.log(req.cookies)
    const token = req.cookies["token"] && req.cookies["token"].split(' ')[1]
    console.log(token);

    const saltrounds = 10;

    bcrypt.genSalt(saltrounds, (err, salt) =>{
        bcrypt.hash(req.body.pass, salt, (err, hash) => {
            db.query(
                `UPDATE accounts SET pass = "${hash}" WHERE username = "${req.body.username}"`,
                function (err, result){
                    if(err){
                        res.status(400).json({error: err.sqlMessage})
                    }
                    else{
                        res.status(200).json({message: "Password updated sucessfully!"})
                    }
                }
            )
        })
    })
})

app.delete("/test/delete/:user", (req, res) =>{
    db.query(
        `DELETE FROM accounts WHERE username ="${req.params.user}"`,
        function(err, result){
            if(err){
                res.status(400).json({error:err.sqlMessage})
            }
            else{
                res.status(200).json({message:"User deleted sucessfully"})
            }
        }
    )
})

app.post('/test/lmao', (req, res) =>{
    console.log(req.cookies["session_id"])
    const username = sessions[req.cookies["session_id"]]
    console.log(username)
    res.status(204).send()
})

app.post("/test/get_user", (req, res) => {
    db.query(
        `SELECT username FROM sessions WHERE session_id = "${req.cookies["session_id"]}"`,
        function(err, results){
            console.log(results)
            if(err){
                res.status(404).clearCookie("session_id").clearCookie("token").send()
            }
            else{
                res.status(200).json({username : results[0].username})
            }
        }
    )
})

app.post("/test/validate", (req,res) => {
    const sessionId = req.cookies["session_id"];

    if (!sessionId) {
        console.log("test")
        return res.status(404).clearCookie("session_id").clearCookie("token").send({ message: 'Session ID not provided' });
    }

    // Use parameterized query to prevent SQL injection
    db.query(
        'SELECT username FROM sessions WHERE session_id = ?',
        [sessionId],
        function (err, results) {
            if (err) {
                console.error("Database error:", err);
                console.log("test")
                return res.status(500).clearCookie("session_id").clearCookie("token").send({ message: 'Internal Server Error' });
            }

            if (results.length === 0) {
                console.log("test");
                return res.status(401).clearCookie("session_id").clearCookie("token").send({ message: 'Unauthorized - Invalid session ID' });
            }

            console.log("test");
            res.status(204).send();
        }
    );

})


app.post("/test/logout", (req, res) => {
    db.query(
        `DELETE FROM sessions where session_id = "${req.cookies["session_id"]}"`,
        function(err, result){
            if (err){
                res.status(400).json({error:err.sqlMessage})
            }
            else if(result.affectedRows === 0){
                res.status(404).json({error:"Session not found"})
            }
            else{
                res.clearCookie('session_id').clearCookie('token');
                res.status(204).send()
            }
        }
    )
})

//post method for commenting
app.post('/comments', (req,res) =>{
    const saltrounds = 10;
        //query for insering comments value into table comment
          db.query(
                `INSERT INTO comments (content) VALUES ("${req.body.content}")`,
                function(err, results){
                    if(!err){
                        res.status(200).json({message: "Comment created sucessfully."})
                    }
                    else{
                        console.log('the comment was not created ' + err);
                        res.status(400).json({error:err.sqlMessage})
                    }
                }
            )
})

app.post('/post', (req,res) =>{
    const saltrounds = 10;
        //query for insering comments value into table comment
          db.query(
                `INSERT INTO posts (content) VALUES ("${req.body.content}")`,
                function(err, results){
                    if(!err){
                        res.status(200).json({message: "Comment created sucessfully."})
                    }
                    else{
                        console.log('the comment was not created ' + err);
                        res.status(400).json({error:err.sqlMessage})
                    }
                }
            )
})

app.get('/get_posts', (req, res) =>{
    db.query(
        `SELECT content FROM posts`,
        function(err, results){
            if(err){
                res.status(400).json({error:err.sqlMessage})
            }
            else{
                res.status(200).json(results)
            }
        }
    )
})   
  
    

app.listen(PORT, () => console.log("App listening on 8000"))