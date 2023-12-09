import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import GetCommentContent from './FetchGetComments';
import NavBar from '../../../../webpage/NavBar';

const CommentForm = () => {
  const [commentContent, setCommentContent] = useState('');
  const navigate = useNavigate();

  let { state } = useLocation();
  console.log(state.postId)
  let postId = state.postId;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to your backend API endpoint to add a comment
      const response = await fetch(`http://127.0.0.1:8000/addComment`, {
        method: 'POST',
        credentials : "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: postId,
          content: commentContent,
        }),
      });

      if (response.ok) {
        // Handle success, e.g., show a success message or update state
        console.log('Comment added successfully');
        // Clear the comment content after submission
         setCommentContent('');
         navigate('/FetchGetComments/', {state: {postId: state.postId}})

      } else {
        // Handle errors, e.g., show an error message
        console.log(response);
        console.error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="comment-form">
    <NavBar></NavBar>
    <form onSubmit={handleSubmit}>
      <label>
        Comment:
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          required
        />
      </label>
      <button type="submit">Add Comment</button>
    </form>
    </div>
  );
};

export default CommentForm;