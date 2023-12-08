import { useState, useEffect } from "react";
import { NavBar } from "../NavBar";
import { Link } from "react-router-dom";

export default function FetchDelete() {
    const [form, setForm] = useState({
        username: '',
        password: '',
    });

    useEffect(() => {
        // This code will run when the component mounts
        setForm({
            username: '',
            password: '',
        });
    }, []); // The empty dependency array ensures that this effect runs only once when the component mounts

    
    async function handleSubmit(event) {
        event.preventDefault();

        const url = `http://127.0.0.1:8000/delete?username=${encodeURIComponent(form.username)}&password=${encodeURIComponent(form.password)}`;

        const res = await fetch(url, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        if (!res.ok) {
            const err = await res.text();
            console.error(err);
        } else {
            alert('User deleted successfully!');
        }
    }

    function handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    }

    return (
        <div>
            <NavBar></NavBar>
            <div>
                <Link className="delete-text" to="/FetchDelete" style={{ textDecoration: 'none' }}>
                    Delete your account
                </Link>
            </div>
            <div className="logout-container">
                <Link className="logout-text" to="/FetchLogOut" style={{ textDecoration: 'none' }}>
                    Log out
                </Link>
            </div>
            <h1>Delete user?</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Username: <br />
                    <input type="text" name="username" value={form.username} onChange={handleChange} autoComplete="new password" // Disable autofill for the password field
 />
                </label>
                <br />
                <label>
                    Password: <br />
                    <input type="password" name="password" value={form.password} onChange={handleChange} autoComplete="new password" // Disable autofill for the password field
                    />
                    
                </label>
                <br />
                <input type="submit" value="Delete"></input>
            </form>
        </div>
    );
}