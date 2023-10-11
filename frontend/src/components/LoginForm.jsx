import React, { useState } from 'react'
import { decode_token, saveJWT, JWT_valid } from './Authentication/auth_func';
import "./LoginForm.css"
export default function LoginForm({ authFunc }) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //const isLoggedIn = false;
    //const [isLoggedIn, setIsLoggedIn] = useState(false);
    //const [userId, setUserId] = useState('');
    
    const handleNameEmail = (e) => {
        setName(e.target.value);
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }
    
    // handles object data from login token request
    const handleError = (obj) => {
        const data = obj.body
        const status_err = obj.status;
        if (status_err == 403) {
            alert('Wrong password!');
        } else if (status_err == 401) {
            alert('User does not exist!');
        } else if (status_err == 201) {
            handleLogin(data)
        }
        //handleLogin(data);

    }

    // saves JWT token into local storage, all other api requests if auth is needed should use fetch_with_auth
    const handleLogin = (data) => {

        console.log(data);
        const token = data['authentication'];

        saveJWT(token);
        authFunc(true);
    }

    const handleSubmit = (e) => {

        const login_payload = {
            'email': email,
            'password': password,
            'username': name,
        }

        fetch('/auth_user', {
            method : 'POST',
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify(login_payload)
        })
        .then((response) => response.json().then(data => ({status: response.status, body: data})))
        .then(obj => handleError(obj))
    }
    

    return (
        <div className="loginDiv">
            <form className="signUpForm" onSubmit={(e) => {e.preventDefault()}}>
                <h1> Login </h1>
                <label className="usernameLabel"> &nbsp;</label>
                <br />
                <input type="text" className="usernameInput" placeholder="Username or email" value={name} onChange={handleNameEmail}/>
                <br />
                <label className="passwordLabel"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <br />
                <input type="password" className="passwordInput" placeholder="Password" value={password} onChange={handlePassword}/>
                <br  />
                <button onClick={handleSubmit} className="submitBtn" type="submit">
                    Submit
                </button>
                <br />
                <br />
            </form>
            <br />
        </div>
    
    )  
}
