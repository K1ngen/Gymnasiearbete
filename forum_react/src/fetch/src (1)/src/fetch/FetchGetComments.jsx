
import CommentForm from './FetchAddComment';
import CreatePost from './FetchCreatePost';
import { NavBar } from '../NavBar';
import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function GetCommentContent() {
  const [commentData, setData] = useState(null);
  const [commentsData, setCommentData] = useState(null);
  const [showCreateComment, setShowCreateComment] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
   
  let { state } = useLocation();
  console.log(state.postId)
  let postId = state.postId;

  useEffect(() => {
    async function getComment(postId) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/get-comments/${postId}`, {
          credentials: 'include',
        });

        if (!res.ok) {
          const err = await res.text();
          console.error(err);
        } else {
          const promised_data = await res.json();
          console.log("test")
          setData(promised_data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }

    getComment(postId);
  }, []);

  const handleViewComment = (commentId) => {
    const comment = commentData.find((item) => item.comment_id === commentId);
    setSelectedComment(comment);
  };
  

  const handleCreateCommentClick = (commentId) => {
    setSelected(commentId);
    setShowCommentForm(true);
  };

  return (
    <div>
      <p>Comments</p>
      {commentData ? (
        <div className="comment-container">
          {commentData.map((item) => (
            <div className="comments-content" key={item.comment_id}>
              <h1>author: {item.username}</h1>
              <h1 className="title" onClick={() => handleViewComment(item.comment_id)}> 
               content: {item.content}
              </h1>
            </div>
          ))}
          <div className="comments-container">

          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}  

      {/* ... other components ... */}
    </div>
  );
}