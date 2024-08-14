import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Delete, Reply } from '@mui/icons-material';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/authContext';
import Header from './Header';

function Messages() {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [open, setOpen] = useState(false);
    const [replyMessage, setReplyMessage] = useState('');
    const [recipientUid, setRecipientUid] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            const messagesCollection = collection(db, 'messages');
            const messagesSnapshot = await getDocs(messagesCollection);
            const messagesList = messagesSnapshot.docs
                .filter(doc => doc.data().recipientUid === currentUser.uid)
                .map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(messagesList);
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



    // const handleSendReply = async () => {
    //     try {
    //         if (!recipientUid) {
    //             console.error('recipientUid is undefined');
    //             return;
    //         }
    //         await addDoc(collection(db, 'messages'), {
    //             senderUid: currentUser.uid,  // UID-ul utilizatorului curent
    //             recipientUid: recipientUid,  // UID-ul utilizatorului care a trimis mesajul original
    //             message: replyMessage,
    //             timestamp: new Date(),
    //         });
    //         handleClose();
    //         console.log('Reply sent successfully');
    //     } catch (error) {
    //         console.error('Error sending message:', error);
    //     }
    // };


    const handleSendReply = async () => {
        try {
            // Verifică dacă recipientUid este definit
            if (!recipientUid) {
                console.error('recipientUid is undefined. Cannot send message.');
                return; // Nu trimite mesajul dacă recipientUid nu este definit
            }

            // Verifică dacă mesajul este definit
            if (!replyMessage || replyMessage.trim() === '') {
                console.error('Message content is undefined or empty.');
                return; // Nu trimite mesajul dacă conținutul mesajului este invalid
            }

            // Adaugă documentul în colecția 'messages'
            await addDoc(collection(db, 'messages'), {
                senderUid: currentUser.uid,  // UID-ul utilizatorului curent
                recipientUid: recipientUid,  // UID-ul utilizatorului care a trimis mesajul original
                message: replyMessage,
                timestamp: new Date(),
            });

            handleClose();
            console.log('Reply sent successfully');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    const handleReply = (senderUid) => {
        // Asigură-te că `senderUid` este setat corect
        if (!senderUid) {
            console.error('senderUid is undefined');
            return;
        }
        setRecipientUid(senderUid);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setReplyMessage('');
    };

    return (
        <div>
            <Header />
            <h1>Messages</h1>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Full Name</TableCell>
                        <TableCell>Sender UID</TableCell>
                        <TableCell>Timestamp</TableCell>
                        <TableCell>Content</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {messages.map((message) => (
                        <TableRow key={message.id}>
                            <TableCell>{message.fullName || 'N/A'}</TableCell> {/* Full name, dacă este disponibil */}
                            <TableCell>{message.senderUid}</TableCell>
                            <TableCell>{new Date(message.timestamp.toDate()).toLocaleString()}</TableCell>
                            <TableCell>{message.message}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleDeleteMessage(message.id)}>
                                    <Delete />
                                </IconButton>
                                <IconButton onClick={() => handleReply(message.senderUid)}>
                                    <Reply />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Modal pentru a trimite un răspuns */}
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



