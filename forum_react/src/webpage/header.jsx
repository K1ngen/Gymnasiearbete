import { Link } from "react-router-dom"
import person from '../assets/icons/person.png'

export default function Header () {
  return (
     <>
      <header> 
      <Link to="/LoginSignup"><img className="icon"src="src\assets\icons/Skärmbild 2023-10-23 135730.png" alt="" /></Link>
      <div className="register-container">
        <img className = "register-icon" src={person} alt="" />
       <Link className="register" to="../FetchCreate" style={{ textDecoration: 'none'}} >Registera dig här</Link>   
       </div>        
      </header>
     </>
  )  
}