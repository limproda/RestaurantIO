import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function AdminDashboard() {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);

    const Logout = () => {
        removeCookie("token");
        navigate("/login");
    };

    return (
        <>
            <h1>Admin Dashboard</h1>
            <button onClick={Logout}>LOGOUT</button>
        </>
    );
}

export default AdminDashboard;