import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField
} from '@mui/material';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/authContext';

function MyFlats() {
    const { currentUser } = useAuth();
    const [flats, setFlats] = useState([]);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedFlat, setSelectedFlat] = useState(null);
    const [editedFlat, setEditedFlat] = useState({});
    const [favoriteFlats, setFavoriteFlats] = useState(new Set());
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [flatToDelete, setFlatToDelete] = useState(null);

    useEffect(() => {
        const fetchFlats = async () => {
            const flatsCollection = collection(db, 'flats');
            const q = query(flatsCollection, where('ownerUid', '==', currentUser.uid));
            const flatsSnapshot = await getDocs(q);
            const flatsList = flatsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFlats(flatsList);
        };

        fetchFlats();
    }, [currentUser.uid]);

    useEffect(() => {
        const fetchFavorites = async () => {
            const userFavoritesRef = collection(db, 'users', currentUser.uid, 'favorites');
            const favoritesSnapshot = await getDocs(userFavoritesRef);
            const favoritesList = new Set(favoritesSnapshot.docs.map(doc => doc.id));
            setFavoriteFlats(favoritesList);
        };

        fetchFavorites();
    }, [currentUser.uid]);


    // handleDelete pentru a deschide dialogul de confirmare de stergere
    const handleDelete = (flatId) => {
        setFlatToDelete(flatId);
        setDeleteOpen(true);
    };

    // funcția care confirmă ștergerea
    const confirmDelete = async () => {
        try {
            await deleteDoc(doc(db, 'flats', flatToDelete));
            setFlats(flats.filter(flat => flat.id !== flatToDelete));
            console.log('Flat deleted successfully');
        } catch (error) {
            console.error('Error deleting flat:', error);
        } finally {
            setDeleteOpen(false);
            setFlatToDelete(null);
        }
    };

    const handleFavorite = async (flatId) => {
        try {
            const userFavoritesRef = doc(db, 'users', currentUser.uid, 'favorites', flatId);
            const favoriteDoc = await getDoc(userFavoritesRef);

            if (favoriteDoc.exists()) {
                await deleteDoc(userFavoritesRef);
                setFavoriteFlats(prev => {
                    const updatedFavorites = new Set(prev);
                    updatedFavorites.delete(flatId);
                    return updatedFavorites;
                });
                console.log('Removed from favorites');
            } else {
                await setDoc(userFavoritesRef, { flatId });
                setFavoriteFlats(prev => new Set(prev).add(flatId));
                console.log('Added to favorites');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const handleEditClick = (flat) => {
        setSelectedFlat(flat);
        setEditedFlat(flat);
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setEditOpen(false);
        setSelectedFlat(null);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedFlat(prevState => ({ ...prevState, [name]: value }));
    };

    const handleEditSave = async () => {
        try {
            const flatRef = doc(db, 'flats', editedFlat.id);
            await updateDoc(flatRef, editedFlat);
            setFlats(flats.map(flat => flat.id === editedFlat.id ? editedFlat : flat));
            handleEditClose();
            console.log('Flat updated successfully');
        } catch (error) {
            console.error('Error updating flat:', error);
        }
    };

    const favoriteButtonStyle = (flatId) => ({
        backgroundColor: favoriteFlats.has(flatId) ? '#1976d2' : 'transparent',
        color: favoriteFlats.has(flatId) ? '#ffffff' : '#000000',
        border: '1px solid #1976d2',
        '&:hover': {
            backgroundColor: favoriteFlats.has(flatId) ? '#1565c0' : 'rgba(0, 0, 0, 0.1)',
            color: favoriteFlats.has(flatId) ? '#ffffff' : '#000000',
        }
    });

    return (
        <div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>

                        <TableRow>
                            <TableCell>City</TableCell>
                            <TableCell>Street Name</TableCell>
                            <TableCell>Street Number</TableCell>
                            <TableCell>Area Size</TableCell>
                            <TableCell>Has AC</TableCell>
                            <TableCell>Year Built</TableCell>
                            <TableCell>Rent Price</TableCell>
                            <TableCell>Date Available</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {flats.map(flat => (
                            <TableRow key={flat.id}>
                                <TableCell>{flat.city}</TableCell>
                                <TableCell>{flat.streetName}</TableCell>
                                <TableCell>{flat.streetNumber}</TableCell>
                                <TableCell>{flat.areaSize}</TableCell>
                                <TableCell>{flat.ac ? 'Yes' : 'No'}</TableCell>
                                <TableCell>{flat.yearBuilt}</TableCell>
                                <TableCell>{flat.rentPrice}</TableCell>
                                <TableCell>{flat.dateAvailable}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        onClick={() => handleFavorite(flat.id)}
                                        sx={favoriteButtonStyle(flat.id)}
                                    >
                                        Favorite
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleDelete(flat.id)}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => handleEditClick(flat)}
                                    >
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal pentru editarea unui flat */}
            {selectedFlat && (
                <Dialog open={editOpen} onClose={handleEditClose}>
                    <DialogTitle>Edit Flat</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="City"
                            name="city"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={editedFlat.city || ''}
                            onChange={handleEditChange}
                        />
                        <TextField
                            margin="dense"
                            label="Street Name"
                            name="streetName"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={editedFlat.streetName || ''}
                            onChange={handleEditChange}
                        />
                        <TextField
                            margin="dense"
                            label="Street Number"
                            name="streetNumber"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={editedFlat.streetNumber || ''}
                            onChange={handleEditChange}
                        />
                        <TextField
                            margin="dense"
                            label="Area Size"
                            name="areaSize"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={editedFlat.areaSize || ''}
                            onChange={handleEditChange}
                        />

                        <TextField
                            margin="dense"
                            label="Rent Price"
                            name="rentPrice"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={editedFlat.rentPrice || ''}
                            onChange={handleEditChange}
                        />
                        <TextField
                            margin="dense"
                            label="Date Available"
                            name="dateAvailable"
                            type="date"
                            fullWidth
                            variant="outlined"
                            value={editedFlat.dateAvailable || ''}
                            onChange={handleEditChange}
                            InputLabelProps={{ shrink: true }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleEditSave} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Dialog de confirmare stergere */}
            <Dialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                aria-labelledby="confirm-delete-dialog-title"
                aria-describedby="confirm-delete-dialog-description"
            >
                <DialogTitle id="confirm-delete-dialog-title">
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-delete-dialog-description">
                        Are you sure you want to delete this flat? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default MyFlats;

