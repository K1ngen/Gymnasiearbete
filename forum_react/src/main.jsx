import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import FetchCreate from './fetch/src (1)/src/fetch/FetchCreate.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FetchLogin from './fetch/src (1)/src/fetch/FetchLogin.jsx'
import LoginSignUp from './webpage/LoginSignup.jsx';
import GetContent from './fetch/src (1)/src/fetch/FetchGetPosts.jsx';
import CreatePost from './fetch/src (1)/src/fetch/FetchCreatePost.jsx';
import FetchDelete from './fetch/src (1)/src/fetch/FetchDelete.jsx';
import LogOut from './fetch/src (1)/src/fetch/FetchLogOut.jsx';
import LikePost from './fetch/src (1)/src/fetch/FetchLike.jsx';
import FetchAccount from './fetch/src (1)/src/fetch/FetchAccount.jsx';
import CommentForm from './fetch/src (1)/src/fetch/FetchAddComment.jsx';
import NavBar from './webpage/NavBar.jsx';
import GetCommentContent from './fetch/src (1)/src/fetch/FetchGetComments.jsx';
import Footer from './webpage/footer.jsx';
import Header from './webpage/header.jsx';
import SignUp from './webpage/signup.jsx';

const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<App />} />
          <Route path="/FetchCreate" element={<FetchCreate />} />
          <Route path="/FetchLogin" element={<FetchLogin />} />
          <Route path="/FetchCreatePost" element={<CreatePost />} />
          <Route path="/FetchGetPosts" element={<GetContent />} />
          <Route path="/FetchDelete" element={<FetchDelete />} />
          <Route path="/FetchLogOut" element={< LogOut />} />
          <Route path="/LoginSignup" element={< LoginSignUp />} />
          <Route path="/FetchLike" element={< LikePost />} />
          <Route path="/FetchAccount" element={< FetchAccount />} />
          <Route path="/FetchAddComment" element={< CommentForm />} />
          <Route path="/FetchGetComments" element={< GetCommentContent />} />
          <Route path="/LoginSignup" element={< LoginSignUp />} />
          <Route path="/NavBar" element={< NavBar />} />
          <Route path="/Footer" element={< Footer />} />'
          <Route path="/Header" element={< Header />} />
          <Route path="/signup" element={< SignUp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
