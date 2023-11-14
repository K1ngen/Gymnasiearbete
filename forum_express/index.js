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

app.post('/post', (req,res) =>{
    const saltrounds = 10;
        //query for inserting the posts value into table posts
        try{
            const token = jwt.verify(req.cookies["token"],secret2)
            console.log(token)
        }
        catch(err){
            res.status(400).json({error: err})
            return
        }
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
            })
})


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
  
  // Route to handle liking or disliking a post
app.post('/like_post', (req, res) => {
        try{
            const token = jwt.verify(req.cookies["token"],secret2)
            console.log(token)
        }
        catch(err){
            res.status(400).json({error: err})
        }
            // Check if the post exists
        const { post_id, action } = req.body;

        if (!post_id|| !['like', 'dislike'].includes(action)) {
            return res.status(400).json({ error: 'Invalid request' });
        }
        

        db.query('SELECT * FROM posts WHERE post_id = ?', [post_id], (err, results) => {
         if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ error: 'Internal server error' });
         }

         if (results.length === 0) {
            return res.status(404).json({ error: 'Comment not found' });
         }

         const post = results[0];

         // Update likes or dislikes based on the action
         if (action === 'like') {
            post.likes += 1;
         } else if (action === 'dislike') {
            post.dislikes += 1;
         }

        // Update the posts in the database
        db.query('UPDATE posts SET likes = ?, dislikes = ? WHERE post_id = ?',
            [post.likes, post.dislikes, post.post_id],
            (err) => {
                if (err) {
                    console.error('Error updating the comment:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                return res.json({ success: true, post });
            }
          );
         }); 
});



// Route to handle liking or disliking a comment
app.post('/like_dislike', (req, res) => {
    const { comment_id, action } = req.body;

    if (!comment_id || !['like', 'dislike'].includes(action)) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    // Check if the comment exists
    db.query('SELECT * FROM comments WHERE comment_id = ?', [comment_id], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        const comment = results[0];

        // Update likes or dislikes based on the action
        if (action === 'like') {
            comment.likes += 1;
        } else if (action === 'dislike') {
            comment.dislikes += 1;
        }

        // Update the comment in the database
        db.query('UPDATE comments SET likes = ?, dislikes = ? WHERE comment_id = ?',
            [comment.likes, comment.dislikes, comment.comment_id],
            (err) => {
                if (err) {
                    console.error('Error updating the comment:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                return res.json({ success: true, comment });
            }
        );
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

app.delete("delete/:user", (req, res) =>{
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
  
    

app.listen(PORT, () => console.log("App listening on 8000"))