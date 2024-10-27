import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

export function Protected() {
    const [isValid, setIsValid] = useState(null); // Track if token is valid
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    useEffect(() => {
        const checkToken = async () => {
            try {
                const response = await axios.get("http://localhost:3000/users/verifyToken", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setIsValid(true); // Token is valid
            } catch (err) {
                setIsValid(false); // Token is invalid
                localStorage.removeItem("user"); // Clear invalid token
            }
        };

        if (token) {
            checkToken();
        } else {
            setIsValid(false);
        }
    }, [token]);

    // If token check is still ongoing, show loading
    if (isValid === null) return <p>Loading...</p>;

    return isValid ? <Outlet /> : <Navigate to="/login" />; // Redirect to login if invalid
}