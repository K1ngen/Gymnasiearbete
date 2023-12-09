import { Link } from "react-router-dom";


export default function NavBar () {
    return (
      <nav>
       <div className="links">
       <Link to="../LoginSignup" textDecoration="none">Home</Link> 
       <Link to="../FetchGetPosts">Post</Link>
       </div>   
      </nav>
    )  
  }