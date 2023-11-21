import { useState } from "react";

export default function FetchChange(){
    const [form, setForm] = useState({});

    function handleChange(event){
        const name = event.target.name;
        const value = event.target.value;
        setForm(values => ({...values, [name]:value}))
    }

    async function handleSubmit(event){
        event.preventDefault();
        // HÄR BEHÖVER DU ÄNDRA SÅ ATT DET FUNKAR
    }

    return(
        <div>
            <>
            Change password for?
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
                            name="pass"
                            value={form.pass || ""}
                            onChange={handleChange}
                        />
                    </label><br/>
                    <input type="submit" value="Log in"></input>
                </form>
            </>
        </div>
    )
}
