import React, { useState, useEffect } from 'react';
import { Box, TextField, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { Favorite, FavoriteBorder, Send, Edit, Delete } from '@mui/icons-material';
import { db } from '../firebase';
import { collection, getDocs, doc, addDoc, setDoc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/authContext';
import { DataGrid } from '@mui/x-data-grid';

function AllFlats() {
    const [flats, setFlats] = useState([]);
    const [filteredFlats, setFilteredFlats] = useState([]);
    const [favoriteFlats, setFavoriteFlats] = useState([]);
    const { currentUser, isAdmin } = useAuth(); // Asigură-te că `isAdmin` este returnat din `useAuth`
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [recipientUid, setRecipientUid] = useState('');
    const [editOpen, setEditOpen] = useState(false); // Stare pentru modalul de editare
    const [selectedFlat, setSelectedFlat] = useState(null); // Stare pentru anunțul selectat pentru editare

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


    const handleClose = () => {
        setOpen(false);
        setMessage('');
    };



    const handleSend = async () => {
        console.log('Sending message to:', recipientUid);

        if (!recipientUid) {
            console.error('Recipient UID is undefined. Cannot send message.');
            return;
        }

        try {
            await addDoc(collection(db, 'messages'), {
                senderUid: currentUser.uid,
                recipientUid: recipientUid,
                message: message,
                timestamp: new Date(),
            });
            console.log('Message sent successfully');
            handleClose();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };



    const handleDeleteFlat = async (flatId) => {
        if (window.confirm('Are you sure you want to delete this flat?')) {
            try {
                await deleteDoc(doc(db, 'flats', flatId));
                setFlats(flats.filter(flat => flat.id !== flatId));
                setFilteredFlats(filteredFlats.filter(flat => flat.id !== flatId));
                console.log('Flat deleted successfully');
            } catch (error) {
                console.error('Error deleting flat:', error);
            }
        }
    };

    const handleEditFlat = (flat) => {
        setSelectedFlat(flat);
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setEditOpen(false);
        setSelectedFlat(null);
    };

    const handleUpdateFlat = async () => {
        try {
            const flatRef = doc(db, 'flats', selectedFlat.id);
            await updateDoc(flatRef, selectedFlat);
            setFlats(flats.map(flat => (flat.id === selectedFlat.id ? selectedFlat : flat)));
            setFilteredFlats(filteredFlats.map(flat => (flat.id === selectedFlat.id ? selectedFlat : flat)));
            handleEditClose();
            console.log('Flat updated successfully');
        } catch (error) {
            console.error('Error updating flat:', error);
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
            width: 200,
            renderCell: (params) => (
                <>
                    <IconButton onClick={() => handleFavorite(params.row.id)}>
                        {favoriteFlats.includes(params.row.id) ? <Favorite sx={{ color: 'red' }} /> : <FavoriteBorder />}
                    </IconButton>

                    <IconButton
                        onClick={() => {
                            setRecipientUid(params.row.ownerUid); // se preia  UID-ul destinatarului
                            setOpen(true); // Deschide modalul de trimitere a mesajului
                        }}
                    >
                        <Send />
                    </IconButton>

                    {isAdmin && (
                        <>
                            <IconButton onClick={() => handleEditFlat(params.row)}>
                                <Edit />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteFlat(params.row.id)}>
                                <Delete />
                            </IconButton>
                        </>
                    )}
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

            {/* Modal pentru editarea unui flat */}
            {selectedFlat && (
                <Dialog open={editOpen} onClose={handleEditClose}>
                    <DialogTitle>Edit Flat</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="City"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={selectedFlat.city}
                            onChange={(e) => setSelectedFlat({ ...selectedFlat, city: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Street Name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={selectedFlat.streetName}
                            onChange={(e) => setSelectedFlat({ ...selectedFlat, streetName: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Street Number"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={selectedFlat.streetNumber}
                            onChange={(e) => setSelectedFlat({ ...selectedFlat, streetNumber: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Area Size"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={selectedFlat.areaSize}
                            onChange={(e) => setSelectedFlat({ ...selectedFlat, areaSize: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Rent Price"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={selectedFlat.rentPrice}
                            onChange={(e) => setSelectedFlat({ ...selectedFlat, rentPrice: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateFlat} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
}

export default AllFlats;



