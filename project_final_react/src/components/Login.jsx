import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../contexts/authContext';
import { doSignInWithEmailAndPassword } from '../auth';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const { userLoggedIn } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await doSignInWithEmailAndPassword(email, password);
            navigate('/');
        } catch (error) {
            console.error("Login failed:", error);
        }
    };



    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f5f5f5', // poți schimba sau elimina această culoare de fundal
            }}
        >
            <Box sx={{
                maxWidth: 300,
                border: '2px solid black',
                padding: 3,
                backgroundColor: 'white' // pentru a face caseta mai vizibilă
            }}>
                <Typography variant="h4" component="h4" gutterBottom>
                    Login Form
                </Typography>
                <TextField
                    required
                    id="email"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    required
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                />
                <Button
                    variant="contained"
                    onClick={handleLogin}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                >
                    Login
                </Button>
                <Typography variant="body2">
                    Dacă nu aveți cont, <Link to="/register">Register</Link>
                </Typography>
            </Box>
        </Box>
    );
}

export default Login;