import React, { useState } from 'react';
import { TextField, Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

function AddFlat() {
    const [flatData, setFlatData] = useState({
        city: '',
        streetName: '',
        streetNumber: '',
        areaSize: '',
        ac: '',
        yearBuilt: '',
        rentPrice: '',
        dateAvailable: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFlatData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleDateChange = (e) => {
        setFlatData(prevData => ({ ...prevData, dateAvailable: e.target.value }));
    };

    const handleACChange = (e, newAC) => {
        if (newAC !== null) {
            setFlatData(prevData => ({ ...prevData, ac: newAC }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const flatsCollection = collection(db, 'flats');
            await addDoc(flatsCollection, flatData);
            navigate('/all-flats');
        } catch (error) {
            console.error("Error adding flat: ", error);
        }
    };

    return (
        <Container sx={{ maxWidth: '100%', padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'start', minHeight: '100vh' }}>
            <TableContainer component={Paper} sx={{ width: '450px', padding: 1 }}>
                <Table sx={{ minWidth: 300 }}>
                    <TableBody>
                        <TableRow sx={{ height: '40px' }}>
                            <TableCell sx={{ padding: '10px 8px' }}>
                                <TextField
                                    name="city"
                                    label="City"
                                    onChange={handleChange}
                                    sx={{ width: '100%', margin: 0 }}
                                    InputProps={{ sx: { height: '40px' } }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow sx={{ height: '40px' }}>
                            <TableCell sx={{ padding: '10px 8px' }}>
                                <TextField
                                    name="streetName"
                                    label="Street Name"
                                    onChange={handleChange}
                                    sx={{ width: '100%', margin: 0 }}
                                    InputProps={{ sx: { height: '40px' } }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow sx={{ height: '40px' }}>
                            <TableCell sx={{ padding: '10px 8px' }}>
                                <TextField
                                    name="streetNumber"
                                    label="Street Number"
                                    onChange={handleChange}
                                    sx={{ width: '100%', margin: 0 }}
                                    InputProps={{ sx: { height: '40px' } }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow sx={{ height: '40px' }}>
                            <TableCell sx={{ padding: '10px 8px' }}>
                                <TextField
                                    name="areaSize"
                                    label="Area Size"
                                    onChange={handleChange}
                                    sx={{ width: '100%', margin: 0 }}
                                    InputProps={{ sx: { height: '40px' } }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow sx={{ height: '40px' }}>
                            <TableCell sx={{ padding: '10px 8px' }}>
                                <ToggleButtonGroup
                                    value={flatData.ac}
                                    exclusive
                                    onChange={handleACChange}
                                    aria-label="Toggle Button"
                                    sx={{ width: '100%' }}
                                >
                                    <ToggleButton value="yes" sx={{ height: '30px' }}>Has AC</ToggleButton>
                                    <ToggleButton value="no" sx={{ height: '30px' }}>No AC</ToggleButton>
                                </ToggleButtonGroup>
                            </TableCell>
                        </TableRow>
                        <TableRow sx={{ height: '40px' }}>
                            <TableCell sx={{ padding: '10px 8px' }}>
                                <TextField
                                    name="yearBuilt"
                                    label="Year Built"
                                    onChange={handleChange}
                                    sx={{ width: '100%', margin: 0 }}
                                    InputProps={{ sx: { height: '40px' } }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow sx={{ height: '40px' }}>
                            <TableCell sx={{ padding: '10px 8px' }}>
                                <TextField
                                    name="rentPrice"
                                    label="Rent Price"
                                    onChange={handleChange}
                                    sx={{ width: '100%', margin: 0 }}
                                    InputProps={{ sx: { height: '40px' } }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow sx={{ height: '40px' }}>
                            <TableCell sx={{ padding: '10px 8px' }}>
                                <TextField
                                    required
                                    id="dateAvailable"
                                    label="Date Available"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={flatData.dateAvailable}
                                    onChange={handleDateChange}
                                    sx={{ marginBottom: 0, width: '100%' }}
                                    InputProps={{ sx: { height: '40px' } }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="center" sx={{ padding: '4px 8px' }}>
                                <Button
                                    onClick={handleSubmit}
                                    sx={{
                                        backgroundColor: 'green',
                                        color: 'white',
                                        width: '100px',
                                        height: '30px',
                                        marginTop: 1
                                    }}
                                >
                                    Save
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default AddFlat;