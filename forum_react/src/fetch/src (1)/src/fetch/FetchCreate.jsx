import { useState } from "react";

export default function FetchCreate(){
    const [form, setForm] = useState({});

    function handleChange(event){
        const name = event.target.name;
        const value = event.target.value;
        setForm(values => ({...values, [name]:value}))
        
    }

    async function handleSubmit(event){
        event.preventDefault();
        const res = await fetch("http://127.0.0.1:8000/test/signup", 
            {
                method : 'POST',
                credentials : "include",
                headers: {
                    "Content-Type" : "application/json",
                    Accept : "application/json"
                },
                body : JSON.stringify(form)
            }
        )
        if(!res.ok){
            console.error(await res.text())
            console.log(res.status + "user already exist, write another username")
            alert("user already exist, write another username")
        }
        else{
            alert("User created successfully!")
        }
    }

    return(
        <div className="sign-up">
            <>
            Signup:
                <form onSubmit={handleSubmit}>
                    <label>Username:
                        <input
                            type="text"
                            name="username"
                            value={form.username || ""}
                            onChange={handleChange}
                        />
                    </label><br/>
                    <label>Password:
                        <input
                            type="password"
                            name="password"
                            value={form.password || ""}
                            onChange={handleChange}
                        />
                    </label>
                    <br/>
                    <input type="submit" value="Sign up"></input>
                </form>
            </>
        </div>
    )
}