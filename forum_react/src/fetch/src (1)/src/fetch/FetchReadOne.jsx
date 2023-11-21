import { useState } from "react";

export default function FetchReadOne(){
    const [form, setForm] = useState({});
    const [data, setData] = useState(null);

    function handleChange(event){
        const name = event.target.name;
        const value = event.target.value;
        setForm(values => ({...values, [name]:value}))
    }

    async function handleSubmit(event){
        event.preventDefault();
        setData(null);
        const res = await fetch(`http://127.0.0.1:8000/test/users/${form.username}`)
        if(!res.ok){
            const err = await res.text()
            console.error(err)
            alert("Error: " + JSON.parse(err).message)
        }
        else{
            const promised_data = await res.json()
            setData(promised_data)
        }
    }

    return(
        <div>
            <>
            Get username and pass for?
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
                <br></br>
            </>
            {data && 
                <>
                    Username: {data[0].username} <br></br>
                    Hashed pass: {data[0].pass} <br></br>
                    Why are we revealing a password? No idea!
                </>
            }
        </div>
    )
}
