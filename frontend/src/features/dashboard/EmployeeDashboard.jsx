import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { AuthContext } from '../../contexts/AuthContext';
import TopbarContainer from '../../components/TopbarContainter';
import { Toolbar } from '@mui/material';

function EmployeeDashboard() {
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
            <Toolbar></Toolbar>
            <TopbarContainer></TopbarContainer>
            <h1>Employee Dashboard</h1>
            <button onClick={Logout}>LOGOUT</button>
        </>
    );
}

export default EmployeeDashboard;