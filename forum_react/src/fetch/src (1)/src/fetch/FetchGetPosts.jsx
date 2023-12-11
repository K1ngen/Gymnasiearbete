
import CommentForm from './FetchAddComment';
import CreatePost from './FetchCreatePost';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import GetCommentContent from './FetchGetComments';
import NavBar from '../../../../webpage/NavBar';
import Header from '../../../../webpage/header';
import "./styles/post.css"

export default function GetContent() {
  const [postData, setData] = useState(null);
  const [commentsData, setCommentData] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
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
    const post = postData.find((item) => item.post_id === postId);
    setSelectedPost(post);
  };
   
  return (
    <div>
      <Header></Header>
      <NavBar></NavBar>
      <div></div>
      <div className="account">
       </div>
      {postData ? (
        <div className="post-container">
          {postData.map((item) => (
            <div className="post" key={item.post_id}>
              <h1 className="title" onClick={() => handleViewPost(item.post_id)}>
                {item.title}
              </h1>
              <p className='created-by'>post by: {item.username}</p>
              <p className="content"> {item.content}</p>
              <div className='like-stats'>
               <p className="likes">Likes: {item.likes}</p>
               <p className="dislikes">Dislikes: {item.dislikes}</p>
              </div>
              <div className="create-stuff">
              <Link to={"/FetchGetComments/"} className='view-comment' state={{postId: item.post_id}}>View Comments</Link>
              <Link to={"/FetchAddComment"} className='add-comment' state={{postId: item.post_id}}>Add a comment</Link>
              </div>     
            </div>
             
          ))}
        
        </div>
      ) : (
        <p>Loading...</p>
      )}  

  
       <div className="account">
        <div className="delete-container">
        <Link to={"/FetchDelete"} className="my-account">My Account</Link>
        </div>
         <Link to={"/FetchCreatePost"} className='create-post'  >Create a post</Link>
      </div>


      {/* ... other compon  ents ... */}
    </div>
  );
}