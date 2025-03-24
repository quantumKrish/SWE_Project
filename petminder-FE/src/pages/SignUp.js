import React from "react";
import { Link } from "react-router-dom";

function SignUp(){
    return (
        <div>
            <h1>Sign Up</h1>
            <form>
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
                <button type="submit">Sign Up</button>
            </form>
            <p>
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </div>
    );
}

export default SignUp;
// In the above snippet, we have a simple SignUp component that displays a form for users to enter a username and password.
//  The form doesn't actually submit data to a server; it's just a placeholder for now.