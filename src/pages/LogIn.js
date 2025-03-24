import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

function LogIn() {
    const {user, login} = useContext(UserContext);
    const data = {
        id: 123456,
        name: "John",
        role: "minder"
    };

    const handleLogin = () => {
        login(data);
    }

    return (
        <div>
        <h1>Log In</h1>
        
        <label>
            Username:
            <input type="text" name="username" />
        </label>
        <br />
        <label>
            Password:
            <input type="password" name="password" />
        </label>
        <br />
        <button onClick={handleLogin}>Log In</button>
        
        <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
        </div>
    );  
}

export default LogIn;
// In the above snippet, we have a simple LogIn component that displays a form for users to enter their username and password.
//  The form doesn't actually submit data to a server; it's just a placeholder for now.