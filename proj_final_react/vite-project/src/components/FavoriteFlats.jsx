import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { db } from '../firebase';
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/authContext';

function FavoriteFlats() {
    const [favoriteFlats, setFavoriteFlats] = useState([]);
    const { currentUser } = useAuth();

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [flatToDelete, setFlatToDelete] = useState(null);

    useEffect(() => {
        const fetchFavoriteFlats = async () => {
            try {
                const favoritesCollection = collection(db, 'users', currentUser.uid, 'favorites');
                const favoritesSnapshot = await getDocs(favoritesCollection);
                const flatIds = favoritesSnapshot.docs.map(doc => doc.data().flatId);

                if (flatIds.length > 0) {
                    const flatsQuery = query(collection(db, 'flats'), where('__name__', 'in', flatIds));
                    const flatsSnapshot = await getDocs(flatsQuery);
                    const flatsList = flatsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setFavoriteFlats(flatsList);
                }
            } catch (error) {
                console.error('Error fetching favorite flats:', error);
            }
        };

        fetchFavoriteFlats();
    }, [currentUser]);

    const handleOpenConfirmDelete = (flatId) => {
        setFlatToDelete(flatId);
        setConfirmDeleteOpen(true);
    };

    const handleCloseConfirmDelete = () => {
        setConfirmDeleteOpen(false);
        setFlatToDelete(null);
    };

    const handleDelete = async () => {
        try {
            if (flatToDelete) {
                // Șterge apartamentul favorit din colecția 'favorites' a utilizatorului
                const favoriteDocRef = doc(db, 'users', currentUser.uid, 'favorites', flatToDelete);
                await deleteDoc(favoriteDocRef);

                // Actualizează starea pentru a elimina apartamentul șters
                setFavoriteFlats(prevFlats => prevFlats.filter(flat => flat.id !== flatToDelete));
                console.log('Favorite deleted');
                handleCloseConfirmDelete();
            }
        } catch (error) {
            console.error('Error deleting favorite:', error);
        }
    };

    return (
        <>
            <TableContainer >
                <Table>
                    <TableHead
                        sx={{
                            backgroundColor: 'rgba( 222, 235, 250, 0.6)', // Fundal semi-transparent 
                        }}>
                        <TableRow>
                            <TableCell>City</TableCell>
                            <TableCell>Street Name</TableCell>
                            <TableCell>Street Number</TableCell>
                            <TableCell>Area Size</TableCell>
                            <TableCell>AC</TableCell>
                            <TableCell>Year Built</TableCell>
                            <TableCell>Rent Price $</TableCell>
                            <TableCell>Date Available</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.5)', // Fundal alb semi-transparent
                            boxShadow: 'none', // Opțional: elimină shadow-ul implicit al Paper
                        }}>
                        {favoriteFlats.map(flat => (
                            <TableRow key={flat.id}>
                                <TableCell>{flat.city}</TableCell>
                                <TableCell>{flat.streetName}</TableCell>
                                <TableCell>{flat.streetNumber}</TableCell>
                                <TableCell>{flat.areaSize}</TableCell>
                                <TableCell>{flat.ac}</TableCell>
                                <TableCell>{flat.yearBuilt}</TableCell>
                                <TableCell>{flat.rentPrice}</TableCell>
                                <TableCell>{flat.dateAvailable}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleOpenConfirmDelete(flat.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={confirmDeleteOpen}
                onClose={handleCloseConfirmDelete}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete this flat from your favorites? This action cannot be undone.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="secondary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default FavoriteFlats;
