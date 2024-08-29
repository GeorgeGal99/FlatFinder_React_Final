import React, { useState } from 'react';
import {
    TextField, Button, Container, Table, TableBody, TableCell,
    TableContainer, TableRow, Paper, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

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
        ownerEmail: '',
    });
    const { currentUser } = useAuth();
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        let tempErrors = {};
        const lettersRegex = /^[A-Za-z]+$/;


        // Validarea orașului (doar litere și minim 4 caractere)
        tempErrors.city = flatData.city.length >= 4 && lettersRegex.test(flatData.city)
            ? ""
            : "City must be at least 4 characters long and contain only letters.";

        // Validarea numelui străzii (doar litere și minim 4 caractere)
        tempErrors.streetName = flatData.streetName.length >= 4 && lettersRegex.test(flatData.streetName)
            ? ""
            : "Street Name must be at least 4 characters long and contain only letters.";

        tempErrors.streetNumber = flatData.streetNumber && !isNaN(flatData.streetNumber) ? "" : "Street Number is required and must be a number.";
        tempErrors.areaSize = flatData.areaSize && !isNaN(flatData.areaSize) && flatData.areaSize > 0 ? "" : "Area Size is required and must be a positive number.";
        tempErrors.ac = flatData.ac ? "" : "AC status is required.";
        const currentYear = new Date().getFullYear();
        tempErrors.yearBuilt = flatData.yearBuilt && !isNaN(flatData.yearBuilt) && flatData.yearBuilt > 1800 && flatData.yearBuilt <= currentYear
            ? ""
            : `Year Built is required, must be a number, and cannot be greater than ${currentYear}.`;
        tempErrors.rentPrice = flatData.rentPrice && !isNaN(flatData.rentPrice) && flatData.rentPrice > 0 ? "" : "Rent Price is required and must be a positive number.";
        tempErrors.dateAvailable = flatData.dateAvailable ? "" : "Date Available is required.";

        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFlatData(prevData => ({ ...prevData, [name]: value }));
        validate();
    };

    const handleDateChange = (e) => {
        setFlatData(prevData => ({ ...prevData, dateAvailable: e.target.value }));
        validate();
    };

    const handleACChange = (e, newAC) => {
        if (newAC !== null) {
            setFlatData(prevData => ({ ...prevData, ac: newAC }));
            validate();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        if (validate()) {
            setIsFormValid(true);
            try {
                if (currentUser) {
                    const flatData1 = { ...flatData, ownerUid: currentUser.uid }

                    const flatsCollection = collection(db, 'flats');
                    await addDoc(flatsCollection, flatData1);
                }
                navigate('/all-flats');
            } catch (error) {
                console.error("Error adding flat: ", error);
            }
        } else {
            setIsFormValid(false);
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
                                    error={isSubmitted && !!errors.city}
                                    helperText={isSubmitted && errors.city}
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
                                    error={isSubmitted && !!errors.streetName}
                                    helperText={isSubmitted && errors.streetName}
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
                                    error={isSubmitted && !!errors.streetNumber}
                                    helperText={isSubmitted && errors.streetNumber}
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
                                    error={isSubmitted && !!errors.areaSize}
                                    helperText={isSubmitted && errors.areaSize}
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
                                {isSubmitted && errors.ac && <div style={{ color: 'red', fontSize: '12px' }}>{errors.ac}</div>}
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
                                    error={isSubmitted && !!errors.yearBuilt}
                                    helperText={isSubmitted && errors.yearBuilt}
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
                                    error={isSubmitted && !!errors.rentPrice}
                                    helperText={isSubmitted && errors.rentPrice}
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
                                    error={isSubmitted && !!errors.dateAvailable}
                                    helperText={isSubmitted && errors.dateAvailable}
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
                                // disabled={isFormValid}  // Butonul este dezactivat dacă formularul nu este valid
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
