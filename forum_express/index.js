const express = require("express");
const bcrypt = require("bcrypt");

const app = express()
const PORT = 8000

const mysql = require("mysql2")
const db = mysql.createConnection({
    host: "192.168.1.222", //Förmodligen localhost för dig
    user: "henjoh", //sql username
    password : '1qaz!QAZ2wsx@WSX', //sql password
    database : "henjoh", //sql databasnamnet,
});

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

//post method for login 
app.post('/test/login', (req, res) => {
         //query selecting the password that is being writen.
        db.query(` SELECT password FROM accounts WHERE username = "${req.body.username}"`,
            function(err, result){
                if(result.length > 0) {
                    bcrypt.compare(req.body.password, result[0].password.toString(), (err, match)=>{
                        if(match){
                           console.log('user succesfully logged in'); 
                           res.status(200).json({message: "User sucessfully logged in"});
                        } else {
                           console.log('wrong username or password'); 
                           res.status(400).json({message: "the password or username is wrong"});  
                        }
                    })
                } 
        });  
});


app.post('/post', (req,res) =>{
    const saltrounds = 10;
        //query for insering the posts value into table posts
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
app.get('users/:user', (req, res) =>{
    console.log(req.params.user)
    db.query(
        `SELECT username, bio, email, account_created FROM accounts WHERE username = "${req.params.user}"`,
        function(err, results){
            if(err){
                res.status(400).json({error:err.sqlMessage})
            }
            else{
                console.log(results.user)
                res.status(200).json(results)
            }
        }
    )
})   
  

app.put("/test/change", (req, res) => {
})

//delete method for deleting a user
app.delete("/test/delete/:user", (req, res) =>{
    // code for deleting a user
    db.query(
      `DELETE FROM accounts where username = "${req.params.user}"`,
      function(err, results){
      if(results){
        res.json(results)
      }
       else{
        console.log(err);
        res.status(500).json({error:err.sqlMessage})
      }
      }
    ) 
})
  
app.listen(PORT, () => console.log("App listening on 8000"))