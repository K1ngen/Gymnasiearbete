
import CommentForm from './FetchAddComment';
import GetPostContent from './FetchGetPost';
import CreatePost from './FetchCreatePost';
import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './styles/comment.css'
import NavBar from '../../../../webpage/NavBar';
import Footer from '../../../../webpage/footer';

export default function GetCommentContent() {
  const [commentData, setCommentData] = useState(null);
  const [postDetails, setPostDetails] = useState(null);
  const [showCommentForm, setShowCommentForm] = useState(false);

  let { state } = useLocation();
  let postId = state.postId;
  let postTitle = state.postTitle;

  console.log(postTitle)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch comments
        const commentsResponse = await fetch(`http://127.0.0.1:8000/get-comments/${postId}`, {
          credentials: 'include',
        });

        if (!commentsResponse.ok) {
          const err = await commentsResponse.text();
          console.error(err);
        } else {
          const commentsData = await commentsResponse.json();
          setCommentData(commentsData);
        }

        // Fetch post details
        const postResponse = await fetch(`http://127.0.0.1:8000/post/${postId}`, {
          credentials: 'include',
        });

        if (!postResponse.ok) {
          const err = await postResponse.text();
          console.error(err);
        } else {
          const postDetails = await postResponse.json();
          setPostDetails(postDetails);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [postId]);

  const handleViewComment = (commentId) => {
    const comment = commentData.find((item) => item.comment_id === commentId);
    setSelectedComment(comment);
  };

  const handleViewPostTitle = (post_id) =>{
    const post = postDetails.find((item) => item.post_id === post_id);
    setPostDetails(post);
  }

  return (
    <>
    <NavBar></NavBar>
    <GetPostContent></GetPostContent>
    <div>
      {commentData ? (
        <div className="comment-container">
          {commentData.map((item) => (
            <div className="comments-content" key={item.comment_id}>
              <h1 className='Author'>Author: {item.username}</h1>
              <h1 className="title" >
                Content: {item.content}
              </h1>
            </div>
          ))}
        </div>
        
      ) : (
        <p>Loading...</p>
      )}

      
      
    </div>
    <Footer></Footer>
     </>
  );
} 
