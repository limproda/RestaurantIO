import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { AuthContext } from '../../contexts/AuthContext';
import { Toolbar } from '@mui/material';
import MainLayout from '../../layout/MainLayout'


function Dashboard() {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const { setUser } = useContext(AuthContext);


    const Logout = () => {
        removeCookie("token", { path: "/" });
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    return (
        <>
            <h1>Panel de Control</h1>
            <button onClick={Logout}>LOGOUT</button>
        </>
    );
}

export default Dashboard;