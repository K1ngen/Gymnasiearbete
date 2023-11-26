import React, { useState } from 'react';

const CommentForm = ({ postId, onCommentSubmit }) => {
  const [author, setAuthor] = useState('');
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');


  const handleAuthorChange = (e) => {
    setAuthor(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if both author and content are provided before submitting
    if (content) {
      const newComment = {
        content: content,
        postId: postId, // Assuming postId is passed as a prop
      };

      try {
        // Send the new comment to the backend API
        const response = await fetch('http://127.0.0.1:8000/addComment', {
          method: 'POST',
          credentials : "include",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newComment),
        });

        // Handle the response from the server as needed
        const data = await response.json();
        console.log('New comment added:', data);

        // Call the callback function to update the parent component with the new comment
        onCommentSubmit(data);
        
        // Reset the form fields
        setAuthor('');
        setContent('');
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    } else {
      // Handle the case where either author or content is missing
      alert('You need to write in the textfield.');
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Comment:
          <textarea value={content} onChange={handleContentChange} />
        </label>
      </div>
      <div>
        <button type="submit">Submit Comment</button>
      </div>
      <div>
          <h2>Comments</h2>
          {comments.map((comment, index) => (
            <div key={index}>
            <strong>{comment.author}:</strong> {comment.content}
           </div>
        ))}
      </div>  
    </form>
    </>
  );
};

export default CommentForm;