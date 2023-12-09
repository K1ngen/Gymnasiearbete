import { Link } from "react-router-dom";

export default function SignUp () {
    return (
      <section>
       <div className="no-account">
         <h1>har du inte ett konto?</h1>
         <Link to="./FetchCreate">Registrera dig</Link>
       </div> 
      </section>     
     )  
  }