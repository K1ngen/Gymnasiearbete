import { useState } from "react";
import { Link } from "react-router-dom";

export default function FetchAccount(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [form, setForm] = useState({});
  
    function handleChange(event){
      const name = event.target.name;
      const value = event.target.value;
      setForm(values => ({...values, [name]:value}))
      
    }
     
    const handleUsernameChange = (e) => {
      setUsername(e.target.value);
    };
  
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    };
  
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Send the registration data to your back-end API for processing
      try {
        const response = await fetch('http://127.0.0.1:8000/users/:user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
            email,
          }),
        });
  
        // Handle the response from the server as needed
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    return(
      <div>
          <NavBar></NavBar> 
      <div>    
      <Link className="delete-text" to="/FetchDelete" style={{ textDecoration: "none"}}>Delete your account</Link>
      </div>
     <div className="logout-container">
       <Link className="logout-text" to="/FetchLogOut" style={{ textDecoration: "none"}}>Log out</Link>
      </div>
          <h1>Delete user?</h1>
              <form onSubmit={handleSubmit}>
                  <label>Username: <br></br>
                      <input
                          type="text"
                          name="username"
                          value={form.username || ""}
                          onChange={handleChange}
                      />
                  </label>
                  <input type="submit" value="Get"></input>
              </form>
      </div>
  )
}
