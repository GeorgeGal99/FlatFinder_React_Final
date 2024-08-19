import React, { useState, useEffect } from "react";
import { Button, Toolbar, AppBar } from "@mui/material";
import { useAuth } from "../contexts/authContext";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import Header from "./Header";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import AllFlats from "./AllFlats";

function Home() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const location = useLocation(); // Obține locația curentă

    const [isAdmin, setIsAdmin] = useState(false);
    const [showAllFlats, setShowAllFlats] = useState(true); // Controlează vizibilitatea componentei AllFlats
    const [activeButton, setActiveButton] = useState(location.pathname); // Starea pentru butonul activ

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        } else {
            checkAdminStatus();
            fetchUsers();
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        // Actualizează vizibilitatea lui AllFlats în funcție de ruta curentă
        if (location.pathname === '/') {
            setShowAllFlats(true);
        } else {
            setShowAllFlats(false);
        }

        // Actualizează butonul activ în funcție de locație
        setActiveButton(location.pathname);
    }, [location]);

    const fetchUsers = async () => {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    const checkAdminStatus = async () => {
        if (currentUser) {
            const userDoc = doc(db, "users", currentUser.uid);
            const userSnapshot = await getDoc(userDoc);
            const userData = userSnapshot.data();
            if (userData) {
                setIsAdmin(userData.isAdmin);
            }
        }
    };

    const buttonStyle = (path) => ({
        backgroundColor: activeButton === path ? '#1976d2' : 'transparent', // Fundalul butonului activ
        color: activeButton === path ? '#ffffff' : '#000000', // Textul butonului activ (alb) sau negru
        border: '1px solid #1976d2', // Conturul butonului
        '&:hover': {
            backgroundColor: activeButton === path ? '#1565c0' : 'rgba(0, 0, 0, 0.1)', // Fundal la hover
            color: activeButton === path ? '#ffffff' : '#000000', // Textul la hover
        }
    });

    return (
        <div>
            <Header />

            <AppBar
                position="static"
                sx={{
                    backgroundColor: 'transparent',
                    boxShadow: 'none'
                }}
            >
                <Toolbar>
                    < Button
                        color="inherit"
                        component={Link}
                        to="/all-flats"
                        sx={buttonStyle('/all-flats')}
                        onClick={() => setActiveButton('/all-flats')}
                    >
                        All Flats
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/my-flats"
                        sx={buttonStyle('/my-flats')}
                        onClick={() => setActiveButton('/my-flats')}
                    >
                        My Flats
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/favorite-flats"
                        sx={buttonStyle('/favorite-flats')}
                        onClick={() => setActiveButton('/favorite-flats')}
                    >
                        Favorite Flats
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/add-flat"
                        sx={buttonStyle('/add-flat')}
                        onClick={() => setActiveButton('/add-flat')}
                    >
                        Add Flat
                    </Button>
                </Toolbar>
            </AppBar>
            <div style={{ padding: '20px' }}>
                <Outlet />
            </div>
            {showAllFlats && <AllFlats />} {/* Afișează AllFlats doar dacă showAllFlats este true */}
        </div >
    );
}

export default Home;
