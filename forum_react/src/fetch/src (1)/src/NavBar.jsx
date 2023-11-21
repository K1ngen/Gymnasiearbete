import { Link } from "react-router-dom";

export function NavBar() {
    return(
        <nav>
        <div className="image-container">
        <Link to={'/FetchAPI'} className="home-text"><img className="logo-left-top" src="src\assets\logo.png" alt="" /></Link>
        </div>
         <div className="links">
          <img className="home-logo" src="src\assets\home-solid.svg" alt="home-logo" />
          <Link to={'/FetchAPI'} className="home-text"><h1>Home</h1></Link>
         <div className="comments">
          <Link to={'/FetchGetPosts'} className="home-text"><h1>Posts</h1></Link>
         </div>
          </div>
        </nav>
    )
}