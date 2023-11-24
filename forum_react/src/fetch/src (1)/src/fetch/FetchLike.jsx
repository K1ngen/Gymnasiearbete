import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Cookies from 'js-cookie';

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

  // Function to handle like and dislike actions
  const handleLike = async (action) => {
    if (hasLiked) {
      console.log('You have already liked this post.');
      return;
    }

    try {
      // Check whether the user has already liked the post from the server
      const response = await fetch('http://127.0.0.1:8000/like_post', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_id: document.cookie, // Replace with the actual user ID
          post_id: post.post_id,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setHasLiked(responseData.hasLiked);
      } else {
        console.error('Error checking like status:', responseData.error);
      }

      // If the user has not liked the post, proceed with the like/dislike action
      if (!hasLiked) {
        const likeResponse = await fetch('http://127.0.0.1:8000/like_post', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: document.cookie, // Replace with the actual user ID
            post_id: post.post_id,
            action: action,
          }),
        });

        const likeData = await likeResponse.json();

        if (likeResponse.ok) {
          // Update the state with the new post data
          setPost(likeData.post);
          setHasLiked(true);
          console.log('Post liked/disliked successfully:', likeData);
        } else {
          console.error('Error liking/disliking post:', likeData.error);
        }
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