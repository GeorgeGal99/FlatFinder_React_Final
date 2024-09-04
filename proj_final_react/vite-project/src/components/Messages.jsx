import React, { useState, useEffect } from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer
} from '@mui/material';
import { Delete, Reply } from '@mui/icons-material';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, query, where, addDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/authContext';
import Header from './Header';
import backgroundImage from '../assets/tokyo.jpg';


function Messages() {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [open, setOpen] = useState(false);
    const [replyMessage, setReplyMessage] = useState('');
    const [recipientUid, setRecipientUid] = useState('');
    const [selectedFlat, setSelectedFlat] = useState(null); // Sau un obiect gol dacă are valori implicite


    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const messagesCollection = collection(db, 'messages');
                const q = query(messagesCollection, where('recipientUid', '==', currentUser.uid));
                const messagesSnapshot = await getDocs(q);
                const messagesList = await Promise.all(
                    messagesSnapshot.docs.map(async (docSnap) => {
                        const messageData = docSnap.data();
                        let flatData = null;

                        // Verificăm dacă există `flatId` în datele mesajului
                        if (messageData.flatId) {
                            const flatRef = doc(db, 'flats', messageData.flatId);
                            const flatDoc = await getDoc(flatRef);
                            if (flatDoc.exists()) {
                                flatData = flatDoc.data();
                                setSelectedFlat(flatDoc.data());

                            }
                        }

                        return {
                            id: docSnap.id,
                            ...messageData,
                            flat: flatData,
                        };
                    })
                );

                setMessages(messagesList);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [currentUser]);

    const handleDeleteMessage = async (messageId) => {
        try {
            await deleteDoc(doc(db, 'messages', messageId));
            setMessages(messages.filter(message => message.id !== messageId));
            console.log('Message deleted');
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };


    const handleSendReply = async () => {
        console.log('selectedFlat:', selectedFlat);


        try {
            // Verifică dacă `currentUser` și `selectedFlat` sunt definiți
            if (!currentUser || !selectedFlat) {
                console.error('User or selected flat is not defined.');
                return;
            } if (!recipientUid) {
                console.lof('recipiend uid is undefined');
                return;
            }
            console.log(selectedFlat);
            await addDoc(collection(db, 'messages'), {
                ownerEmail: currentUser.email,
                senderUid: currentUser.uid,
                recipientUid: recipientUid,
                message: replyMessage,
                // flatId: selectedFlat.id,
                timestamp: new Date(),
                flatList: {
                    city: selectedFlat.city || 'Unknown',
                    streetName: selectedFlat.streetName || 'Unknown',
                    streetNumber: selectedFlat.streetNumber || 'Unknown'
                }
            });

            console.log('Message sent successfully');
            handleClose();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };


    const handleReply = (senderUid, flat) => {
        console.log(flat);
        console.log('handleReply - flat este null:', flat);

        if (!senderUid) {
            console.error('senderUid is undefined');
            return;
        }

        if (!flat) {

            console.error('Flat data is undefined');
            return;
        }

        setRecipientUid(senderUid);
        setSelectedFlat(flat);
        setOpen(true);
    };



    const handleClose = () => {
        setOpen(false);
        setReplyMessage('');
    };



    return (
        <div>

            <img
                src={backgroundImage}
                alt="background"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    // filter: 'blur(0px)', // Efectul de blur
                    zIndex: -1, // Asigură că imaginea este în spate
                    opacity: 0.95, // Aplica un nivel de transparență
                }}
            />
            <Header />
            <h1>Messages</h1>
            <Table>
                <TableContainer >
                    <TableHead
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 1)', // Fundal semi-transparent (alb cu 70% opacitate)
                        }}>

                        <TableRow>
                            <TableCell sx={{ width: '25%' }}>Email Address</TableCell>
                            <TableCell sx={{ width: '25%' }}>Apartment (City, Street, Number)</TableCell>
                            <TableCell sx={{ width: '20%' }}>Timestamp</TableCell>
                            <TableCell sx={{ width: '30%' }}>Message Content</TableCell>
                            <TableCell sx={{ width: '10%' }}>Actions</TableCell>
                        </TableRow>

                    </TableHead>
                    <TableBody
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.4)', // Fundal semi-transparent 
                        }}>

                        {messages.map((message) => (
                            <TableRow key={message.id}>
                                <TableCell>{message.ownerEmail}</TableCell>
                                <TableCell>
                                    {message.flatsList ? (
                                        `${message.flatsList.city}, ${message.flatsList.streetName}, ${message.flatsList.streetNumber}`
                                    ) : (
                                        'N/A'
                                    )}
                                </TableCell>
                                <TableCell>{new Date(message.timestamp.toDate()).toLocaleString()}</TableCell>
                                <TableCell>{message.message}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleDeleteMessage(message.id)}>
                                        <Delete />
                                    </IconButton>
                                    <IconButton onClick={() => handleReply(message.senderUid, message.flatsList)}>
                                        <Reply />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </TableContainer>
            </Table>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Reply to Message</DialogTitle>
                <DialogContent>
                    <textarea
                        rows={4}
                        style={{ width: '100%' }}
                        placeholder="Type your reply..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSendReply} color="primary">
                        Send Reply
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}

export default Messages;
