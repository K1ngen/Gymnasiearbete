import { useState } from "react";
import { NavBar } from "../NavBar";

export default function FetchDelete(){
    const [form, setForm] = useState({});

    function handleChange(event){
        const name = event.target.name;
        const value = event.target.value;
        setForm(values => ({...values, [name]:value}))
        
    }

    async function handleSubmit(event){
        event.preventDefault();
        const res = await fetch(`http://127.0.0.1:8000/delete/${form.username}`, 
            {
                method : 'DELETE',
                credentials: "include",
                headers: {
                    "Content-Type" : "application/json",
                    Accept : "application/json"
                }
            }
        )
        if(!res.ok){
            const err = await res.text()
            console.error(err)
        }
        else{
            alert("User deleted successfully!")
        }
    }

    return(
        <div>
            <NavBar></NavBar>
            <>
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
            </>
        </div>
    )
}