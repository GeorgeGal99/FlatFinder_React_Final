import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { Button, Typography, AppBar, Toolbar } from '@mui/material';
import Logout from './Logout';

function Header() {
    const { currentUser, userLoggedIn, isAdmin } = useAuth();

    return (
        <AppBar position="static"

            sx={{
                backgroundColor: 'transparent', // Navbar transparent
                boxShadow: 'none'
            }}
        >

            <Toolbar>
                {userLoggedIn && (
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'black' }}>
                        FlatFinder Welcome, {currentUser.email} {isAdmin && '(Admin)'}
                    </Typography>
                )}


                <Button color="secondary" component={Link} to="/" sx={{ color: 'black' }}>
                    Home
                </Button>
                {userLoggedIn && (
                    <>
                        <Button color="primary" component={Link} to="/my-profiles" sx={{ color: 'black' }}>
                            My Profile
                        </Button>

                        <Button color="primary" component={Link} to="/messages" sx={{ color: 'black' }}>
                            Messages
                        </Button>

                        {isAdmin && (
                            <Button color="primary" component={Link} to="/all-users" sx={{ color: 'black' }}>
                                All Users
                            </Button>
                        )}

                        <Logout />
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Header;
