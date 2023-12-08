import React from 'react';

const Logout = async () => {
   try {
     // Make a request to your backend API endpoint for logging out
     const response = await fetch('http://127.0.0.1:8000/test/logout', {
       method: 'POST',
       credentials: 'include', // Include credentials for sessions
     });

     if (response.ok) {
       // Logout was successful, you might want to do additional cleanup
       console.log('Logout successful');
       // Redirect the user to the login page or perform any other desired action
     } else {
       console.error('Logout failed');
     }
   } catch (error) {
     console.error('Error during logout:', error);
   }
   return (
    <button onClick={Logout}>Logout</button>
   )
 };
export default Logout;