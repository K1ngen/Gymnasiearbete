
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NavBar } from "../NavBar";
import FetchAPI from "../FetchAPI";
import LikePost from "./FetchLike";


export default function GetContent() {
    const [data, setData] = useState(null);
      
    useEffect(()=>{
      async function getPosts(){
        const res = await fetch(`http://127.0.0.1:8000/get-posts`)
        if(!res.ok){
            const err = await res.text()
            console.error(err)
        }
        else{
            const promised_data = await res.json()
            
            setData(promised_data);
        }
      }
      
      getPosts();
    },[])
    return (
        <div>
          <NavBar></NavBar>
          
          {data ? (
            <div className="post-container">{data.map((item) => 
              <div className="post">
               <h1 className="username">username: {item.username}</h1>
               <h1 className="title">title: {item.title}</h1>
               <p className="content">content: {item.content}</p>
               <p>Likes: {item.likes}</p>
               <p>Dislikes: {item.dislikes}</p>
               <LikePost></LikePost>
              </div>
            )}</div>
          ) : (
            <p>Loading...</p>
          )}
          <div className="make-post">
            <MakePost/>
          </div>
        </div>
      );
}

export function MakePost() {
  return (
    <div>
    <Link to={'/FetchCreatePost'} className="home-text"><h1>Make a post</h1></Link>
    </div>
  )
}

