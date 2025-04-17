import {useContext, useState} from "react";
import {context, dispatchContext} from "../context.jsx";
import axios from "axios";
import './login.css'

function Login() {
    const state = useContext(context)
    const dispatch = useContext(dispatchContext)
    const [user_email, set_user_email] = useState('')
    const [user_password, set_password] = useState('')
    const url = "https://svu-csc-django-backend.online/api-token-auth/"
    const body = {
        username: user_email,
        password: user_password,
    }
    const header = {
        header: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    }
    const [errors, set_errors] = useState('')
    const [loading, set_loading] = useState(true);

    async function GetToken(){
        try{
            const response = await axios.post(url, body, header)
            dispatch({
                type: 'set_token',
                token: response.data.token,
            })
            dispatch({
                type: 'update_login_form_visibility',
                show_login_form: false
            })
            dispatch({
                type: 'change_user',
                user: 1
            })
            console.log(response.data.token)
            set_loading(false)
        } catch(error){
            console.log(error)
            set_errors("Wrong Email or Password.")
            set_loading(false)
        }
    }
    return (
        <div className="login">
            <h1>Login</h1>
            <p className="login-text">Username</p>
            <input className="login-input" type='text' placeholder='username' value={user_email} onChange={e => {set_user_email(e.target.value)}}/>
            <p className="login-text">Password</p>
            <input className='login-input' type='password' placeholder='password' value={user_password} onChange={e => {set_password(e.target.value)}}/>
            <button type='submit' className='login-button' onClick={GetToken}>Log in</button>
            <div className="errors">{errors}</div>
        </div>
    )
}
export default Login;