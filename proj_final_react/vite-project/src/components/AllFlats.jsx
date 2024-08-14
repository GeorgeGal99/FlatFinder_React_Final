// // import React, { useState, useEffect } from 'react';
// // import { Box, TextField, IconButton } from '@mui/material';
// // import { Favorite, FavoriteBorder, Send } from '@mui/icons-material';
// // import { db } from '../firebase';
// // import { collection, getDocs, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
// // import { useAuth } from '../contexts/authContext';
// // import { DataGrid } from '@mui/x-data-grid';

// // function AllFlats() {
// //     const [flats, setFlats] = useState([]);
// //     const [filteredFlats, setFilteredFlats] = useState([]);
// //     const [favoriteFlats, setFavoriteFlats] = useState([]);
// //     const { currentUser } = useAuth();

// //     useEffect(() => {
// //         const fetchFlats = async () => {
// //             const flatsCollection = collection(db, 'flats');
// //             const flatsSnapshot = await getDocs(flatsCollection);
// //             const flatsList = flatsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// //             setFlats(flatsList);
// //             setFilteredFlats(flatsList);
// //         };

// //         const fetchFavorites = async () => {
// //             const favoritesCollection = collection(db, 'users', currentUser.uid, 'favorites');
// //             const favoritesSnapshot = await getDocs(favoritesCollection);
// //             const favoritesList = favoritesSnapshot.docs.map(doc => doc.id);
// //             setFavoriteFlats(favoritesList);
// //         };

// //         fetchFlats();
// //         fetchFavorites();
// //     }, [currentUser]);

// //     const handleFavorite = async (flatId) => {
// //         try {
// //             const userFavoritesRef = doc(db, 'users', currentUser.uid, 'favorites', flatId);
// //             const favoriteDoc = await getDoc(userFavoritesRef);

// //             if (favoriteDoc.exists()) {
// //                 await deleteDoc(userFavoritesRef);
// //                 setFavoriteFlats(prev => prev.filter(id => id !== flatId));
// //                 console.log('Removed from favorites');
// //             } else {
// //                 await setDoc(userFavoritesRef, { flatId });
// //                 setFavoriteFlats(prev => [...prev, flatId]);
// //                 console.log('Added to favorites');
// //             }
// //         } catch (error) {
// //             console.error('Error toggling favorite:', error);
// //         }
// //     };

// //     const handleSearch = (event) => {
// //         const searchTerm = event.target.value.toLowerCase();
// //         const results = flats.filter(flat =>
// //             flat.city.toLowerCase().includes(searchTerm) ||
// //             flat.streetName.toLowerCase().includes(searchTerm) ||
// //             flat.rentPrice.toString().includes(searchTerm) ||
// //             flat.areaSize.toString().includes(searchTerm)
// //         );
// //         setFilteredFlats(results);
// //     };

// //     const columns = [
// //         { field: 'city', headerName: 'City', width: 200 },
// //         { field: 'streetName', headerName: 'Street Name', width: 200 },
// //         { field: 'streetNumber', headerName: 'Street Number', width: 150 },
// //         { field: 'areaSize', headerName: 'Area Size', width: 120 },
// //         { field: 'ac', headerName: 'AC', width: 100 },
// //         { field: 'yearBuilt', headerName: 'Year Built', width: 120 },
// //         { field: 'rentPrice', headerName: 'Rent Price $', width: 120 },
// //         { field: 'dateAvailable', headerName: 'Date Available', width: 150 },

// //         {
// //             field: 'actions',
// //             headerName: 'Actions',
// //             width: 150,
// //             renderCell: (params) => (
// //                 <>
// //                     <IconButton onClick={() => handleFavorite(params.row.id)}>
// //                         {favoriteFlats.includes(params.row.id) ? <Favorite sx={{ color: 'red' }} /> : <FavoriteBorder />}
// //                     </IconButton>
// //                     <IconButton
// //                         onClick={() => window.location.href = `mailto:${params.row.currentUser.uid}`} // Trimite email către proprietar
// //                     >
// //                         <Send />
// //                     </IconButton>
// //                 </>
// //             ),
// //         },
// //     ];

// //     return (
// //         <Box>
// //             <TextField
// //                 variant="outlined"
// //                 placeholder="Search..."
// //                 onChange={handleSearch}
// //                 sx={{ marginBottom: 2, width: '300px' }}
// //             />

// //             <DataGrid
// //                 rows={filteredFlats}
// //                 columns={columns}
// //                 pageSize={10}
// //                 rowsPerPageOptions={[10]}
// //                 disableSelectionOnClick
// //                 autoHeight
// //             />
// //         </Box>
// //     );
// // }

// // export default AllFlats;






import React, { useState, useEffect } from 'react';
import { Box, TextField, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { Favorite, FavoriteBorder, Send } from '@mui/icons-material';
import { db } from '../firebase';
import { collection, getDocs, doc, addDoc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/authContext';
import { DataGrid } from '@mui/x-data-grid';




function AllFlats() {
    const [flats, setFlats] = useState([]);
    const [filteredFlats, setFilteredFlats] = useState([]);
    const [favoriteFlats, setFavoriteFlats] = useState([]);
    const { currentUser } = useAuth();
    const [open, setOpen] = useState(false); // Stare pentru modal
    const [message, setMessage] = useState(''); // Stare pentru mesajul introdus
    const [recipientUid, setRecipientUid] = useState(''); // Stare pentru emailul destinatarului

    useEffect(() => {
        const fetchFlats = async () => {
            const flatsCollection = collection(db, 'flats');
            const flatsSnapshot = await getDocs(flatsCollection);
            const flatsList = flatsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFlats(flatsList);
            setFilteredFlats(flatsList);
        };

        const fetchFavorites = async () => {
            const favoritesCollection = collection(db, 'users', currentUser.uid, 'favorites');
            const favoritesSnapshot = await getDocs(favoritesCollection);
            const favoritesList = favoritesSnapshot.docs.map(doc => doc.id);
            setFavoriteFlats(favoritesList);
        };

        fetchFlats();
        fetchFavorites();
    }, [currentUser]);

    const handleFavorite = async (flatId) => {
        try {
            const userFavoritesRef = doc(db, 'users', currentUser.uid, 'favorites', flatId);
            const favoriteDoc = await getDoc(userFavoritesRef);

            if (favoriteDoc.exists()) {
                await deleteDoc(userFavoritesRef);
                setFavoriteFlats(prev => prev.filter(id => id !== flatId));
                console.log('Removed from favorites');
            } else {
                await setDoc(userFavoritesRef, { flatId });
                setFavoriteFlats(prev => [...prev, flatId]);
                console.log('Added to favorites');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const results = flats.filter(flat =>
            flat.city.toLowerCase().includes(searchTerm) ||
            flat.streetName.toLowerCase().includes(searchTerm) ||
            flat.rentPrice.toString().includes(searchTerm) ||
            flat.areaSize.toString().includes(searchTerm)
        );
        setFilteredFlats(results);
    };

    const handleSendMessage = (uid) => {
        setRecipientUid(uid); // Setează UID-ul destinatarului
        setOpen(true); // Deschide modalul
    };

    const handleClose = () => {
        setOpen(false);
        setMessage(''); // Resetează mesajul când închizi modalul
    };

    const handleSend = async () => {
        try {
            // Adaugă mesajul în colecția "messages" din Firestore
            await addDoc(collection(db, 'messages'), {
                senderUid: currentUser.uid,
                recipientUid: recipientUid,
                message: message,
                timestamp: new Date(), // Adaugă data și ora trimiterii mesajului
            });
            handleClose(); // Închide modalul după trimiterea mesajului
            console.log('Message sent successfully');

        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const columns = [
        { field: 'city', headerName: 'City', width: 200 },
        { field: 'streetName', headerName: 'Street Name', width: 200 },
        { field: 'streetNumber', headerName: 'Street Number', width: 150 },
        { field: 'areaSize', headerName: 'Area Size', width: 120 },
        { field: 'ac', headerName: 'AC', width: 100 },
        { field: 'yearBuilt', headerName: 'Year Built', width: 120 },
        { field: 'rentPrice', headerName: 'Rent Price $', width: 120 },
        { field: 'dateAvailable', headerName: 'Date Available', width: 150 },

        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <>
                    <IconButton onClick={() => handleFavorite(params.row.id)}>
                        {favoriteFlats.includes(params.row.id) ? <Favorite sx={{ color: 'red' }} /> : <FavoriteBorder />}
                    </IconButton>
                    <IconButton
                        onClick={() => handleSendMessage(params.row.email)} // Deschide modalul pentru a trimite un mesaj
                    >
                        <Send />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <Box>
            <TextField
                variant="outlined"
                placeholder="Search..."
                onChange={handleSearch}
                sx={{ marginBottom: 2, width: '300px' }}
            />

            <DataGrid
                rows={filteredFlats}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
                autoHeight
            />

            {/* Modal pentru trimiterea mesajului */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Send a Message</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Message"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSend} color="primary">
                        Send
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default AllFlats;




