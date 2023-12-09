import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import NavBar from '../../../../webpage/NavBar';
import Footer from '../../../../webpage/footer';
import Header from '../../../../webpage/header';
import "./styles/post.css"


const CreatePost = () => {
 const navigate = useNavigate();

  // State to manage the post data
  const [postData, setPostData] = useState({
    title: '',
    content: '',
  }); 
  
  // Function to handle changes in the form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData({
      ...postData,
      [name]: value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to your backend API using fetch
      const response = await fetch('http://127.0.0.1:8000/post', {
        method: 'POST',
        credentials : "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      // Parse the response JSON
      const responseData = await response.json();

      // Handle the response as needed (e.g., show a success message)
      console.log('Post created successfully:', responseData);
      navigate("/FetchGetPosts")
    
      // Clear the form after successful submission
      setPostData({
        title: '',
        content: '',
      });
    } catch (error) {
      // Handle errors (e.g., show an error message)
      console.error('Error creating post:', error);
    }
  };

  return (
    <>
    <Header></Header>
    <NavBar></NavBar>
    <div className='create-post-form'>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={postData.title}
          placeholder='title for your post'
          onChange={handleChange}
          required
        />

        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          name="content"
          value={postData.content}
          placeholder='content for your post'
          onChange={handleChange}
          required
        />

        <button type="submit">Create Post</button>
      </form>
    </div>
    <Footer></Footer>
    </>
  );
};

export default CreatePost;


