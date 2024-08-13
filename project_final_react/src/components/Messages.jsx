// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase';

// import { collection, getDocs } from 'firebase/firestore';

// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Button,
//     IconButton,
//     Tooltip,
// } from '@mui/material';
// import { Star, Delete } from '@mui/icons-material';



// const Messages = ({ messages, onDelete, onFavorite }) => {
//     const [order, setOrder] = useState('asc');
//     const [orderBy, setOrderBy] = useState('timestamp');

//     const handleRequestSort = (property) => {
//         const isAsc = orderBy === property && order === 'asc';
//         setOrder(isAsc ? 'desc' : 'asc');
//         setOrderBy(property);
//     };

//     const sortedMessages = [...messages].sort((a, b) => {
//         if (orderBy === 'timestamp') {
//             return order === 'asc'
//                 ? new Date(a[orderBy]) - new Date(b[orderBy])
//                 : new Date(b[orderBy]) - new Date(a[orderBy]);
//         }
//         return order === 'asc'
//             ? a[orderBy].localeCompare(b[orderBy])
//             : b[orderBy].localeCompare(a[orderBy]);
//     });

//     return (
//         // <div>
//         //     dfewcwerfcrefc
//         // </div>
//         <TableContainer component={Paper}>
//             <Table aria-label="inbox table">
//                 <TableHead>
//                     <TableRow>
//                         <TableCell>Full Name</TableCell>
//                         <TableCell>Sender Email</TableCell>
//                         <TableCell>Content</TableCell>
//                         <TableCell>Receiver UID</TableCell>
//                         <TableCell>Flats</TableCell>
//                         <TableCell>Apartments</TableCell>
//                         <TableCell>
//                             <TableSortLabel
//                                 active={orderBy === 'timestamp'}
//                                 direction={order}
//                                 onClick={() => handleRequestSort('timestamp')}
//                             >
//                                 Timestamp
//                             </TableSortLabel>
//                         </TableCell>
//                         <TableCell>Actions</TableCell>
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {sortedMessages.map((message) => (
//                         <TableRow key={message.id}>
//                             <TableCell>{message.fullName}</TableCell>
//                             <TableCell>{message.senderEmail}</TableCell>
//                             <TableCell>{message.content}</TableCell>
//                             <TableCell>{message.receiverUID}</TableCell>
//                             <TableCell>{message.flats}</TableCell>
//                             <TableCell>{message.apartments}</TableCell>
//                             <TableCell>{new Date(message.timestamp).toLocaleString()}</TableCell>
//                             <TableCell>
//                                 <Tooltip title="Favorite">
//                                     <IconButton onClick={() => onFavorite(message.id)}>
//                                         <Star color={message.isFavorite ? 'primary' : 'disabled'} />
//                                     </IconButton>
//                                 </Tooltip>
//                                 <Tooltip title="Delete">
//                                     <IconButton onClick={() => onDelete(message.id)}>
//                                         <Delete color="secondary" />
//                                     </IconButton>
//                                 </Tooltip>
//                             </TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//         </TableContainer>
//     );
// };

// export default Messages;

import React from 'react'
import Header from './Header'

function Messages() {
    return (
        <div>
            <Header />
            <h1>Mesages</h1>
        </div>
    )
}

export default Messages
