import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, Box } from '@mui/material';
import { Favorite, FavoriteBorder, Send } from '@mui/icons-material'; // Import pictogramele Material UI
import { db } from '../firebase';
import { collection, getDocs, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/authContext';

function AllFlats() {
    const [flats, setFlats] = useState([]);
    const [favoriteFlats, setFavoriteFlats] = useState([]);
    const { currentUser } = useAuth();
    const [sortOrder, setSortOrder] = useState({ rentPrice: null, areaSize: null, city: null });

    useEffect(() => {
        const fetchFlats = async () => {
            const flatsCollection = collection(db, 'flats');
            const flatsSnapshot = await getDocs(flatsCollection);
            const flatsList = flatsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFlats(flatsList);
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

    const handleSort = (field) => {
        const order = sortOrder[field] === 'asc' ? 'desc' : 'asc';
        const sortedFlats = [...flats].sort((a, b) => {
            if (order === 'asc') {
                return a[field] > b[field] ? 1 : -1;
            } else {
                return a[field] < b[field] ? 1 : -1;
            }
        });
        setSortOrder({ ...sortOrder, [field]: order });
        setFlats(sortedFlats);
    };

    return (
        <Box>
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button
                    variant="contained"
                    sx={{ width: '50px', backgroundColor: 'lightblue' }}
                    onClick={() => handleSort('rentPrice')}
                >
                    $
                </Button>
                <Button
                    variant="contained"
                    sx={{ width: '50px', backgroundColor: 'lightblue', ml: 1 }}
                    onClick={() => handleSort('areaSize')}
                >
                    m²
                </Button>
                <Button
                    variant="contained"
                    sx={{ width: '50px', backgroundColor: 'lightblue', ml: 1 }}
                    onClick={() => handleSort('city')}
                >
                    City
                </Button>
            </Box>

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
                        {flats.map(flat => (
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
                                    <IconButton onClick={() => handleFavorite(flat.id)}>
                                        {favoriteFlats.includes(flat.id) ? <Favorite sx={{ color: 'blue' }} /> : <FavoriteBorder />}
                                    </IconButton>
                                    <IconButton>
                                        <Send />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default AllFlats;


//test
