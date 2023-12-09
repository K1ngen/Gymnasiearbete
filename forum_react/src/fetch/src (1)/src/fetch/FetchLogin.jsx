import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login(){
    const navigate = useNavigate();
    useEffect(() =>{
        if (document.cookie){
        }
    }, [navigate])

    const [form, setForm] = useState({});

    function handleChange(event){
        const name = event.target.name;
        const value = event.target.value;
        setForm(values => ({...values, [name]:value}))
    }

    async function handleSubmit(event){
        event.preventDefault();
        const res = await fetch("http://127.0.0.1:8000/test/login", 
            {
                method : 'POST',
                credentials : "include",
                headers: {
                    "Content-Type" : "application/json",
                    Accept : "application/json",
                },
                body : JSON.stringify(form)
            }
        )
        if(!res.ok){
            const err = await res.text()
            console.error(err)
            alert("Error: " + JSON.parse(err).message)
        }
        else{
            alert("Successful login! now what?")
        }
    }

    return(
        <div className="sign-in">
            <>
             <h1 className="log-in-text">Log in</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        <input
                            type="text"
                            name="username"
                            value={form.username || ""}
                            placeholder="Username"
                            onChange={handleChange}
                        />
                    </label><br/>
                    <label>Password:
                        <input
                            type="password"
                            name="password"
                            value={form.password || ""}
                            placeholder="Password"                            
                            onChange={handleChange}
                        />
                    </label><br/>
                    <input className="log-in-button" type="submit" value="Log in"></input>
                </form>
            </>
        </div>
    )
}