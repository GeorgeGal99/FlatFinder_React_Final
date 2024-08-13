import React from 'react'
import { Button, Toolbar, AppBar, Typography } from "@mui/material";
import { useNavigate, Outlet, Link } from "react-router-dom";
import Header from './Header';


function AllUsers() {
    return (
        <div>
            <Header />
            <h1>All users</h1>
        </div>
    )
}

export default AllUsers
