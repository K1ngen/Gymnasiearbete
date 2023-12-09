import { Link } from "react-router-dom";
import Login from "../fetch/src (1)/src/fetch/FetchLogin";
import NavBar from "./NavBar";
import Footer from "./footer";
import Header from "./header";
import SignUp from "./signup";

export default function LoginSignUp () {
  return (
     <div className="log-in-container">
      <Header></Header>
      <NavBar></NavBar>  
      <div className="log-in-forum-container">
      <SignUp></SignUp>
      </div> 
      <div className="login">
        <Login></Login>
      </div>
      <Footer></Footer>
      </div>    
  )  
}