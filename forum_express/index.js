const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express()
const PORT = 8000

const mysql = require("mysql2")
const db = mysql.createConnection({
    host: "192.168.1.222", //Förmodligen localhost för dig //10.1.1.222 databas anslunting för jobb hemifrån
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
 origin : "http://127.0.0.1:5173"
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
                            `INSERT INTO sessions (session_id, account_id) VALUES ("${sess_id}", ${result[0].account_id})`,
                            function(err){
                                if(err){
                                    throw err;
                                }
                                else{
                                    const smth = jwt.sign(
                                        {
                                            username : req.body.username,
                                            account_id: req.body.account_id
                                        }
                                        , secret2, {expiresIn : 43200})
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

// Block a User
app.post('/blockUser', (req, res) => {
    const userId = req.body.userId;
    const blockedUserId = req.body.blockedUserId;
  
    const blockUserQuery = `INSERT INTO blocked_users (blocking_user_id, blocked_user_id) VALUES ("${userId}", "${blockedUserId}")`;
    db.query(blockUserQuery, [userId, blockedUserId], (err) => {
      if (err) {
        console.error('Error blocking user: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json({ success: true, message: 'User blocked successfully' });
      }
    });
});

app.post('/post', (req, res) =>{
        //query for inserting the posts value into table posts
        let token;
        try{
         token = jwt.verify(req.cookies["token"],secret2)
         console.log(token)
        }
        catch(err){
            res.status(400).json({error: err})
            return
        }
            db.query(
                `INSERT INTO posts (content, username) VALUES ("${req.body.content}", "${token.username}")`,
                function(err, results){
                    if(!err){
                        res.status(200).json({message: "Post created sucessfully."})
                    }
                    else{
                        console.log(err);
                        res.status(400).json({error:err.sqlMessage})
                    }
            })
})

// Route to get all posts
app.get('/get-posts', (req, res) => {
    const query = 'SELECT * FROM posts';
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query: ', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(results);
      }
    });
  });


app.post('/addComment', (req, res) => {
    const postId = req.body.postId;
    const commentText = req.body.commentText;
    try{
        const token = jwt.verify(req.cookies["token"],secret2)
        console.log(token)
    }
    catch(err){
        res.status(400).json({error: err})
        return
    }
        // Check if the post exists
    const checkPostQuery = 'SELECT * FROM posts WHERE post_id = ?';
    db.query(checkPostQuery, [postId], (err, results) => {
        if (err) {
        console.error('Error checking post existence: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
        } else {
        if (results.length === 0) {
            // Post doesn't exist
            res.status(404).json({ error: 'Post not found' });
        } else {
            // Post exists, add comment
            const addCommentQuery = 'INSERT INTO comments (post_id, content) VALUES (?, ?)';
            db.query(addCommentQuery, [postId, commentText], (err) => {
            if (err) {
                console.error('Error adding comment: ', err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.status(200).json({ success: true, message: 'Comment added successfully' });
            }
            });
        }
        }
    });
  });
  
//post geting a users username, bio, email and when the acccount was created
app.get('/users/:user', (req, res) =>{
    console.log(req.params.user)
    db.query(
        `SELECT username, password, email FROM accounts WHERE username = "${req.params.user}"`,
        function(err, results){
            if(err){
                res.status(400).json({error:err.sqlMessage})
            }
            else if (results.length === 0){
                res.status(404).json({message: "User not found."})
            }
            else{
                results[0].password = results[0].password.toString();
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

app.delete("/delete/:user", (req, res) =>{
    try{
     const token = jwt.verify(req.cookies["token"],secret2)
     console.log(token)
    }

    catch(err) {
     res.status(400).json({error: err})
     return
    }
 
    db.query(
        `DELETE FROM accounts WHERE username ="${req.params.user}"`,
            function(err, result){
               console.log(req.params.user)
               if(err){
                   res.status(400).json({error:err.sqlMessage})
                }
                else{
                  res.status(200).json({message:"User deleted sucessfully"})
                }
            }
        )
    }
)

app.post("/get_user", (req, res) => {
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
        'SELECT username, account_id FROM sessions WHERE session_id = ?',
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

// Endpoint to get posts for a specific user
app.get('/get-user-posts/', (req, res) => {
    const userId = req.body.userId

    const sql = 'SELECT * FROM posts WHERE account_id = ?';
    const values = [userId];

    db.query(sql, values, (err, results) => {
        if (err) {
            console.log('Error fetching user posts:', err);
            res.status(500).json({ error: 'Error fetching user posts' });
        } else {
            console.log('User posts fetched successfully');
            res.status(200).json(results);
        }
    });
});

app.post('/like_post', async (req, res) => {
    try {
      const { user_id, post_id, action } = req.body;
  
      // Check if the user has already liked the post
      const hasLiked = await checkLikeStatus(user_id, post_id);
  
      if (!hasLiked) {
        // Update the database with the new like status
        await updateLikeStatus(user_id, post_id, true);
  
        // Insert a new row into user_post_likes
        await insertLikeStatus(user_id, post_id, true);

        await updatePostLikes(user_id, post_id, true);

  
        // Your existing logic to handle like and dislike actions
        // ...
  
        res.json({ success: true });
      } else {
        res.status(400).json({ error: 'User has already liked the post' });
      }
    } catch (error) {
      console.error('Error liking/disliking post:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Helper function to check like status
  async function checkLikeStatus(account_id, post_id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT has_liked FROM user_post_likes WHERE account_id = ? AND post_id = ?';
      db.query(query, [account_id, post_id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length > 0) {
            resolve(results[0].has_liked === 1);
          } else {
            resolve(false);
          }
        }
      });
    });
  }
  
  // Helper function to update like status
  async function updateLikeStatus(account_id, post_id, hasLiked) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE user_post_likes SET has_liked = ? WHERE account_id = ? AND post_id = ?';
      db.query(query, [hasLiked, account_id, post_id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  async function updatePostLikes(post_id, increment) {
    return new Promise((resolve, reject) => {
      const incrementOperator = increment ? '+' : '-'; // Increment or decrement
      const query = `UPDATE posts SET likes = likes ${incrementOperator} 1 WHERE post_id = ?`;
      db.query(query, [post_id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
  
  // Helper function to insert a new row into user_post_likes
  async function insertLikeStatus(account_id, post_id, hasLiked) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO user_post_likes (account_id, post_id, has_liked) VALUES (?, ?, ?)';
      db.query(query, [account_id, post_id, hasLiked], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
  
app.listen(PORT, () => console.log("App listening on 8000"))