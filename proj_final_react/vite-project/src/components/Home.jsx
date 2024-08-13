// import React, { useState, useEffect } from "react";
// import { Button, Toolbar, AppBar, Typography } from "@mui/material";
// import { useAuth } from "../contexts/authContext";
// import { useNavigate, Outlet, Link } from "react-router-dom";
// import Header from "./Header";
// import { db } from "../firebase";
// import { collection, getDocs, doc, deleteDoc, getDoc } from "firebase/firestore";

// function Home() {
//     const navigate = useNavigate();
//     const { currentUser } = useAuth();

//     // Define state for isAdmin
//     const [isAdmin, setIsAdmin] = useState(false);

//     useEffect(() => {
//         if (!currentUser) {
//             navigate('/login');
//         } else {
//             checkAdminStatus();
//             fetchUsers();
//         }
//     }, [currentUser, navigate]);

//     const fetchUsers = async () => {
//         const usersCollection = collection(db, "users");
//         const usersSnapshot = await getDocs(usersCollection);
//         const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         // setUsers(usersList);
//     };

//     const checkAdminStatus = async () => {
//         const userDoc = doc(db, "users", currentUser.uid);
//         const userSnapshot = await getDoc(userDoc);
//         const userData = userSnapshot.data();
//         if (userData) {
//             setIsAdmin(userData.isAdmin); // Now this function is defined and will update the state
//         }
//     };


//     return (
//         <div>
//             <Header />
//             <AppBar
//                 position="static"
//                 sx={{
//                     backgroundColor: 'transparent', // AppBar transparent
//                     boxShadow: 'none' // Îndepărtează umbra
//                 }}
//             >
//                 <Toolbar>

//                     <Button
//                         color="inherit"
//                         component={Link}
//                         to="/all-flats"
//                         sx={{ color: 'black' }} // Textul butonului în negru
//                     >
//                         All Flats
//                     </Button>
//                     <Button
//                         color="inherit"
//                         component={Link}
//                         to="/my-flats"
//                         sx={{ color: 'black' }} // Textul butonului în negru
//                     >
//                         My Flats
//                     </Button>
//                     <Button
//                         color="inherit"
//                         component={Link}
//                         to="/favorite-flats"
//                         sx={{ color: 'black' }} // Textul butonului în negru
//                     >
//                         Favorite Flats
//                     </Button>
//                     <Button
//                         color="inherit"
//                         component={Link}
//                         to="/add-flat"
//                         sx={{ color: 'black' }} // Textul butonului în negru
//                     >
//                         Add Flat
//                     </Button>
//                 </Toolbar>
//             </AppBar>
//             <div style={{ padding: '20px' }}>
//                 <Outlet />
//             </div>
//         </div>
//     );
// }

// export default Home;



import React, { useState, useEffect } from "react";
import { Button, Toolbar, AppBar, Typography } from "@mui/material";
import { useAuth } from "../contexts/authContext";
import { useNavigate, Outlet, Link } from "react-router-dom";
import Header from "./Header";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

function Home() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // Define state for isAdmin
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        } else {
            checkAdminStatus();
            fetchUsers();
        }
    }, [currentUser, navigate]);

    const fetchUsers = async () => {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Decomentează această linie dacă vrei să setezi utilizatorii într-o stare
        // setUsers(usersList);
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

    return (
        <div>
            <Header />
            <AppBar
                position="static"
                sx={{
                    backgroundColor: 'transparent', // AppBar transparent
                    boxShadow: 'none' // Îndepărtează umbra
                }}
            >
                <Toolbar>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/all-flats"
                        sx={{ color: 'black' }} // Textul butonului în negru
                    >
                        All Flats
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/my-flats"
                        sx={{ color: 'black' }} // Textul butonului în negru
                    >
                        My Flats
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/favorite-flats"
                        sx={{ color: 'black' }} // Textul butonului în negru
                    >
                        Favorite Flats
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/add-flat"
                        sx={{ color: 'black' }} // Textul butonului în negru
                    >
                        Add Flat
                    </Button>
                </Toolbar>
            </AppBar>
            <div style={{ padding: '20px' }}>
                <Outlet />
            </div>
        </div>
    );
}

export default Home;
