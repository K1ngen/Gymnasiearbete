import { useState, useEffect } from "react";
import { NavBar } from "../NavBar";
import { React } from 'react';
import { useNavigate } from 'react-router-dom';

const LikePost = () => {
  const navigate = useNavigate();

  // State to manage the post data
  const [post, setPost] = useState({
    post_id: 128, // Replace with the actual post ID
    likes: 0,
    dislikes: 0,
  });

  // State to track whether the user has already liked the post
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    // Check whether the user has already liked the post
    const checkLikeStatus = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/check_like_status', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            post_id: post.post_id,
          }),
        });

        const responseData = await response.json();

        if (response.ok) {
          setHasLiked(responseData.hasLiked);
        } else {
          console.error('Error checking like status:', responseData.error);
        }
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    checkLikeStatus();
  }, [post.post_id]);

  // Function to handle like and dislike actions
  const handleLike = async (action) => {
    if (hasLiked) {
      console.log('You have already liked this post.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/like_post', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: post.post_id,
          action: action,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Update the state with the new post data
        setPost(responseData.post);
        setHasLiked(true);
        console.log('Post liked/disliked successfully:', responseData);
      } else {
        console.error('Error liking/disliking post:', responseData.error);
      }
    } catch (error) {
      console.error('Error liking/disliking post:', error);
    }
  };

  return (
    <div>
      <button onClick={() => handleLike('like')} disabled={hasLiked}>
        Like
      </button>
      <button onClick={() => handleLike('dislike')} disabled={hasLiked}>
        Dislike
      </button>
      <br />
    </div>
  );
};

export default LikePost;
