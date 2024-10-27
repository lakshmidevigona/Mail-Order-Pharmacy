import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './login.css';
import logo from './images/capsulecart.jpg'; // Update with the actual path of the uploaded logo

export function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [isValid, setIsValid] = useState({ email: '', password: '', confirmPassword: '' });
    const navigate = useNavigate();

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setForm({ email: '', username: '', password: '', confirmPassword: '' });
        setIsValid({ email: '', password: '', confirmPassword: '' });
    };

    const onChangeInputs = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            login();
        } else {
            signup();
        }
    };

    const login = () => {
        const { email, password } = form;
        const body = { email, password };

        axios.post("http://localhost:3000/users/login", body)
            .then((response) => {
                const { role, token } = response.data;
                if (response.status === 200) {
                    localStorage.setItem("user", JSON.stringify({
                        email: response.data.email,
                        role: role,
                        token: token
                    }));
                    const redirectPath = localStorage.getItem("redirectPath");
                    const druginformation = JSON.parse(localStorage.getItem('selectedDrug'))
                    localStorage.removeItem("redirectPath");
                    localStorage.removeItem("selectedDrug");
                   
                    if (redirectPath) {
                        navigate(redirectPath,{ state: { drug: druginformation} }); // Go to the stored redirect path
                    } else {
                        // Redirect based on user role
                        switch (role) {
                            case 'admin':
                                navigate('/admin');  // Redirect to admin page
                                break;
                            case 'user':
                                navigate('/user');   // Redirect to user dashboard
                                break;
                            case 'deliveryboy':
                                navigate('/delivery', { state: { email: response.data.email } }); // Redirect to delivery dashboard
                                break;
                            default:
                                navigate('/'); // Default redirect if role is unrecognized
                        }
                    }


                }
            })

            .catch((err) => {
                alert("Invalid credentials: " + err.response.data.message);
            });
    };

    const signup = () => {
        const { email, username, password } = form;
        const body = { email, username, password };

        axios.post("http://localhost:3000/users", body)
            .then((response) => {
                if (response.status === 201) {
                    alert("Successfully signed up");
                    toggleForm();
                }
            })
            .catch(err => {
                alert("Error: " + err.response.data.message);
            });
    };

    return (
        <div className="centered-page">
            <div className="form-module">
                <div className="login-header">
                    <img src={logo} alt="Capsule Cart Logo" className="logo" />
                    <h1>Capsule Cart</h1>
                </div>

                <div className="toggle" onClick={toggleForm}>
                    <i className={`fa ${isLogin ? 'fa-pencil' : 'fa-times'}`}></i>
                    <div className="tooltip">{isLogin ? 'Sign Up' : 'Login'}</div>
                </div>

                {isLogin ? (
                    <div className="form">
                        <h2>Login to your account</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Email"
                                className="input-bordered"
                                name="email"
                                onChange={onChangeInputs}
                                value={form.email}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                onChange={onChangeInputs}
                                value={form.password}
                                required
                            />
                            <button className="btn-hover">Login</button>
                        </form>
                    </div>
                ) : (
                    <div className="form">
                        <h2>Create an account</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="email"
                                placeholder="Email"
                                className="input-bordered"
                                name="email"
                                onChange={onChangeInputs}
                                value={form.email}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Username"
                                className="input-bordered"
                                name="username"
                                onChange={onChangeInputs}
                                value={form.username}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                onChange={onChangeInputs}
                                value={form.password}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                name="confirmPassword"
                                onChange={onChangeInputs}
                                value={form.confirmPassword}
                                required
                            />
                            <button className="btn-hover">Register</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
