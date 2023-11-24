import React, { useState } from 'react';

const CommentForm = ({ postId, onCommentSubmit }) => {
  const [author, setAuthor] = useState('');
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
    if (author && content) {
      const newComment = {
        author: author,
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
      alert('Please provide both author and content.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Author:
          <input type="text" value={author} onChange={handleAuthorChange} />
        </label>
      </div>
      <div>
        <label>
          Comment:
          <textarea value={content} onChange={handleContentChange} />
        </label>
      </div>
      <div>
        <button type="submit">Submit Comment</button>
      </div>
    </form>
  );
};

export default CommentForm;