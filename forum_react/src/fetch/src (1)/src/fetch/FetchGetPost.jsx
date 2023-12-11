import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../../../../webpage/NavBar";

export default function GetPostContent() {
  const [postDetails, setPostDetails] = useState(null);

  let { state } = useLocation();
  let postId = state.postId;

  console.log({postId}) 

  useEffect(() => {
    async function fetchData() {
      try {
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

  return (
    <>
    <div>
      {postDetails ? (
        <div className="post-container">
          {postDetails.map((item) => (
           <div className="post-content" key={item.post_id}>
              {console.log(item)}
              <h1 className="post-title">
                Title for the post: {item.title}
              </h1>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    </>
  );
}