import React, { useState } from 'react';
import { TextField, Button, Container, Table, TableBody, TableCell, TableContainer, TableRow, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
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
    const { currentUser } = useAuth()
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        let tempErrors = {};
        tempErrors.city = flatData.city ? "" : "City is required.";
        tempErrors.streetName = flatData.streetName ? "" : "Street Name is required.";
        tempErrors.streetNumber = flatData.streetNumber ? "" : "Street Number is required.";
        tempErrors.areaSize = flatData.areaSize && !isNaN(flatData.areaSize) ? "" : "Area Size is required and must be a number.";
        tempErrors.ac = flatData.ac ? "" : "AC status is required.";
        tempErrors.yearBuilt = flatData.yearBuilt && !isNaN(flatData.yearBuilt) ? "" : "Year Built is required and must be a number.";
        tempErrors.rentPrice = flatData.rentPrice && !isNaN(flatData.rentPrice) ? "" : "Rent Price is required and must be a number.";
        tempErrors.dateAvailable = flatData.dateAvailable ? "" : "Date Available is required.";


        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    };

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
        setIsSubmitted(true);  // Setăm că formularul a fost trimis
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
                                    disabled={isFormValid}
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


