import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import FetchCreate from './fetch/src (1)/src/fetch/FetchCreate.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FetchLogin from './fetch/src (1)/src/fetch/FetchLogin.jsx';
import FetchAPI from './fetch/src (1)/src/FetchAPI.jsx';
import GetContent from './fetch/src (1)/src/fetch/FetchGetPosts.jsx';
import CreatePost from './fetch/src (1)/src/fetch/FetchCreatePost.jsx';
import FetchDelete from './fetch/src (1)/src/fetch/FetchDelete.jsx';
import LogOut from './fetch/src (1)/src/fetch/FetchLogOut.jsx';
import LikePost from './fetch/src (1)/src/fetch/FetchLike.jsx';
import FetchAccount from './fetch/src (1)/src/fetch/FetchAccount.jsx';
import CommentForm from './fetch/src (1)/src/fetch/FetchComment.jsx';
import GetCommentForm from './fetch/src (1)/src/fetch/FetchGetComments.jsx';

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
          <Route path="/FetchAPI" element={< FetchAPI />} />
          <Route path="/FetchLike" element={< LikePost />} />
          <Route path="/FetchAccount" element={< FetchAccount />} />
          <Route path="/FetchComments" element={< CommentForm />} />
          <Route path="/FetchGetComments" element={< GetCommentForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
