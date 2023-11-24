import React, { useState, useEffect } from 'react';
import CommentForm from './FetchComment'; // Assuming you have a CommentForm component

export default function GetContent() {
  const [data, setData] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    async function getPosts() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/get-posts`, {
          credentials: 'include',
        });

        if (!res.ok) {
          const err = await res.text();
          console.error(err);
        } else {
          const promised_data = await res.json();
          setData(promised_data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }

    getPosts();
  }, []);

  const handleViewPost = (postId) => {
    const post = data.find(item => item.post_id === postId);
    setSelectedPost(post);
    setShowCommentForm(false); // Hide the comment form when viewing a post
  };

  const handleToggleCommentForm = () => {
    setShowCommentForm(!showCommentForm);
  };

  const handleCommentSubmit = (postId, newComment) => {
    // Implement the logic to submit the comment for the given post to the backend
    console.log(`Submitting comment for post ${postId}:`, newComment);
    // You can make a fetch request to your backend API to handle comment submission
  };

  return (
    <div>
      {data ? (
        <div className="post-container">
          {data.map((item) => (
            <div className="post" key={item.post_id}>
              <h1 className="title" onClick={() => handleViewPost(item.post_id)}>
                {item.title}
              </h1>
              <p className="content">{item.content}</p>
              <p className="likes">Likes: {item.likes}</p>
              <p className="dislikes">Dislikes: {item.dislikes}</p>
              <p className="post_id">{item.post_id}</p>
              <p className='comments'>Comments:{item.comments}</p>

                <>
                  <h1 className="make-comment" onClick={handleToggleCommentForm}>
                    Make a Comment
                  </h1>
                  {showCommentForm && (
                    <CommentForm postId={item.post_id} onCommentSubmit={comment => handleCommentSubmit(item.post_id, comment)} />
                  )}
                </>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}

      {selectedPost && (
        <div className="post">
          <h1 className="title">{selectedPost.title}</h1>
          <p className="content">{selectedPost.content}</p>
          <p className="likes">{selectedPost.likes}</p>
          <p className="dislikes">{selectedPost.dislikes}</p>
          <p className="post_id">{selectedPost.post_id}</p>
          {/* ... other post details ... */}
        </div>
      )}

      {/* ... other components ... */}
    </div>
  );
}