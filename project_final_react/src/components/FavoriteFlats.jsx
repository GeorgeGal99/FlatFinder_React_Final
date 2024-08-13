import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { db } from '../firebase';
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/authContext';

function FavoriteFlats() {
    const [favoriteFlats, setFavoriteFlats] = useState([]);
    const { currentUser } = useAuth();

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

    const handleDelete = async (flatId) => {
        try {
            // Șterge apartamentul favorit din colecția 'favorites' a utilizatorului
            const favoriteDocRef = doc(db, 'users', currentUser.uid, 'favorites', flatId);
            await deleteDoc(favoriteDocRef);

            // Actualizează starea pentru a elimina apartamentul șters
            setFavoriteFlats(prevFlats => prevFlats.filter(flat => flat.id !== flatId));
            console.log('Favorite deleted');
        } catch (error) {
            console.error('Error deleting favorite:', error);
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
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
                <TableBody>
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
                                    onClick={() => handleDelete(flat.id)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default FavoriteFlats;


