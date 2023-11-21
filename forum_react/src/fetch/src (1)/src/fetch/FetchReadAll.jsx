import { useState } from "react";

export default function FetchReadAll(){
    const [data, setData] = useState(null);

    async function handleSubmit(event){
        event.preventDefault();
        setData(null);
        // ÄNDRA HÄR SÅ ATT DET FUNKAR
    }

    return(
        <div>
            <>
            Get all users?
                <form onSubmit={handleSubmit}>
                    <input type="submit" value="Get All"></input>
                </form>
                <br></br>
            </>
            {data && data.map((data) => 
            <>
                Username: {data.username} <br></br>
                Hashed pass: {data.pass.toString()} <br></br>
                <br></br>
            </>)
            }
        </div>
    )
}
