import FetchChange from "./fetch/FetchChange";
import FetchCreate from "./fetch/FetchCreate";
import FetchDelete from "./fetch/FetchDelete";
import CreatePost from "./fetch/FetchCreatePost";
import FetchLogin from "./fetch/FetchLogin";
import { NavBar } from "./NavBar";
import { Link } from "react-router-dom";
import "./fetch/fetch.css"

export default function FetchAPI(){
    return(
      <>
      <NavBar></NavBar>
      <div className="grid-container">
       <div className="forum-container">
         <FetchLogin/>
       </div> 
       <div className="sign-up-container">
          <h1>Har du inget konto?</h1>
          <Link className="register" to="/FetchCreate" style={{ textDecoration: "none"}}>Registrera dig</Link>
         </div> 
        <footer>
          <h1 className="copyright">Copyright © 2023 by Henry Johnsson and Ludvig Agarwal. All rights reserved.</h1>
        </footer> 
      </div>
      </>
    )
}