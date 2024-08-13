import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { Button, Typography, AppBar, Toolbar } from '@mui/material';
import Logout from './Logout';

function Header() {
    const { currentUser, userLoggedIn, isAdmin } = useAuth();

    return (
        <AppBar position="static">
            <Toolbar>
                {userLoggedIn && (
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        FlatFinder Welcome, {currentUser.email}
                    </Typography>
                )}
                <Button color="inherit" component={Link} to="/">
                    Home
                </Button>
                {userLoggedIn && (
                    <>
                        <Button color="inherit" component={Link} to="/my-profiles">
                            My Profile
                        </Button>

                        <Button color="inherit" component={Link} to="/messages">
                            Messages
                        </Button>

                        {isAdmin && (
                            <Button color="inherit" component={Link} to="/all-users">
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

