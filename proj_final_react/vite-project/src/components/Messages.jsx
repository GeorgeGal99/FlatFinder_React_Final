// import React, { useState, useEffect } from 'react';
// import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
// import { Delete, Reply } from '@mui/icons-material';
// import { db } from '../firebase';
// import { collection, getDocs, deleteDoc, doc, query, where, addDoc } from 'firebase/firestore';
// import { useAuth } from '../contexts/authContext';
// import Header from './Header';

// function Messages() {
//     const { currentUser } = useAuth();
//     const [messages, setMessages] = useState([]);
//     const [open, setOpen] = useState(false);
//     const [replyMessage, setReplyMessage] = useState('');
//     const [recipientUid, setRecipientUid] = useState('');

//     useEffect(() => {
//         const fetchMessages = async () => {
//             try {

//                 const messagesCollection = collection(db, 'messages');
//                 const q = query(messagesCollection, where('recipientUid', '==', currentUser.uid));
//                 const messagesSnapshot = await getDocs(q);
//                 const messagesList = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//                 setMessages(messagesList);

//             } catch (error) {
//                 console.error('Error fetching messages:', error);
//             }
//         };

//         fetchMessages();
//     }, [currentUser]);

//     const handleDeleteMessage = async (messageId) => {
//         try {
//             await deleteDoc(doc(db, 'messages', messageId));
//             setMessages(messages.filter(message => message.id !== messageId));
//             console.log('Message deleted');
//         } catch (error) {
//             console.error('Error deleting message:', error);
//         }
//     };



//     const handleSendReply = async () => {
//         try {
//             // Verifică dacă recipientUid este definit
//             if (!recipientUid) {
//                 console.error('recipientUid is undefined. Cannot send message.');
//                 return; // Nu trimite mesajul dacă recipientUid nu este definit
//             }

//             // Verifică dacă mesajul este definit
//             if (!replyMessage || replyMessage.trim() === '') {
//                 console.error('Message content is undefined or empty.');
//                 return; // Nu trimite mesajul dacă conținutul mesajului este invalid
//             }

//             // Trimiterea mesajului către Firebase
//             await addDoc(collection(db, 'messages'), {
//                 senderUid: currentUser.uid,
//                 recipientUid: recipientUid,
//                 message: replyMessage,
//                 timestamp: new Date(),
//             });

//             handleClose(); // Închide modalul
//             console.log('Reply sent successfully');
//         } catch (error) {
//             console.error('Error sending message:', error);
//         }
//     };

//     const handleReply = (senderUid) => {
//         // Asigură-te că `senderUid` este setat corect
//         if (!senderUid) {
//             console.error('senderUid is undefined');
//             return;
//         }
//         setRecipientUid(senderUid);
//         setOpen(true);
//     };

//     const handleClose = () => {
//         setOpen(false);
//         setReplyMessage('');
//     };

//     return (
//         <div>
//             <Header />
//             <h1>Messages</h1>
//             <Table>
//                 <TableHead>
//                     <TableRow>
//                         <TableCell>Full Name</TableCell>
//                         <TableCell>Sender UID</TableCell>
//                         <TableCell>Timestamp</TableCell>
//                         <TableCell>Content</TableCell>
//                         <TableCell>Actions</TableCell>
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {messages.map((message) => (
//                         <TableRow key={message.id}>
//                             <TableCell>{message.fullName || 'N/A'}</TableCell> {/* Full name, dacă este disponibil */}
//                             <TableCell>{message.senderUid}</TableCell>
//                             <TableCell>{new Date(message.timestamp.toDate()).toLocaleString()}</TableCell>
//                             <TableCell>{message.message}</TableCell>
//                             <TableCell>
//                                 <IconButton onClick={() => handleDeleteMessage(message.id)}>
//                                     <Delete />
//                                 </IconButton>
//                                 <IconButton onClick={() => handleReply(message.senderUid)}>
//                                     <Reply />
//                                 </IconButton>
//                             </TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>

//             {/* Modal pentru a trimite un răspuns */}
//             <Dialog open={open} onClose={handleClose}>
//                 <DialogTitle>Reply to Message</DialogTitle>
//                 <DialogContent>
//                     <textarea
//                         rows={4}
//                         style={{ width: '100%' }}
//                         placeholder="Type your reply..."
//                         value={replyMessage}
//                         onChange={(e) => setReplyMessage(e.target.value)}
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleClose} color="primary">
//                         Cancel
//                     </Button>
//                     <Button onClick={handleSendReply} color="primary">
//                         Send Reply
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </div>
//     );
// }

// export default Messages;



// import React, { useState, useEffect } from 'react';
// import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
// import { Delete, Reply } from '@mui/icons-material';
// import { db } from '../firebase';
// import { collection, getDocs, deleteDoc, doc, query, where, addDoc, getDoc } from 'firebase/firestore';
// import { useAuth } from '../contexts/authContext';
// import Header from './Header';

// function Messages() {
//     const { currentUser } = useAuth();
//     const [messages, setMessages] = useState([]);
//     const [open, setOpen] = useState(false);
//     const [replyMessage, setReplyMessage] = useState('');
//     const [recipientUid, setRecipientUid] = useState('');

//     useEffect(() => {
//         const fetchMessages = async () => {
//             try {
//                 const messagesCollection = collection(db, 'messages');
//                 const q = query(messagesCollection, where('recipientUid', '==', currentUser.uid));
//                 const messagesSnapshot = await getDocs(q);
//                 const messagesList = await Promise.all(
//                     messagesSnapshot.docs.map(async (doc) => {
//                         const messageData = doc.data();
//                         const flatRef = doc(db, 'flats', messageData.flatId);
//                         const flatDoc = await getDoc(flatRef);

//                         return {
//                             id: doc.id,
//                             ...messageData,
//                             flat: flatDoc.exists() ? flatDoc.data() : null,
//                         };
//                     })
//                 );
//                 setMessages(messagesList);
//             } catch (error) {
//                 console.error('Error fetching messages:', error);
//             }
//         };

//         fetchMessages();
//     }, [currentUser]);

//     const handleDeleteMessage = async (messageId) => {
//         try {
//             await deleteDoc(doc(db, 'messages', messageId));
//             setMessages(messages.filter(message => message.id !== messageId));
//             console.log('Message deleted');
//         } catch (error) {
//             console.error('Error deleting message:', error);
//         }
//     };

//     const handleSendReply = async () => {
//         try {
//             if (!recipientUid) {
//                 console.error('recipientUid is undefined. Cannot send message.');
//                 return;
//             }

//             if (!replyMessage || replyMessage.trim() === '') {
//                 console.error('Message content is undefined or empty.');
//                 return;
//             }

//             await addDoc(collection(db, 'messages'), {
//                 senderUid: currentUser.uid,
//                 recipientUid: recipientUid,
//                 message: replyMessage,
//                 timestamp: new Date(),
//             });

//             handleClose();
//             console.log('Reply sent successfully');
//         } catch (error) {
//             console.error('Error sending message:', error);
//         }
//     };

//     const handleReply = (senderUid) => {
//         if (!senderUid) {
//             console.error('senderUid is undefined');
//             return;
//         }
//         setRecipientUid(senderUid);
//         setOpen(true);
//     };

//     const handleClose = () => {
//         setOpen(false);
//         setReplyMessage('');
//     };

//     return (
//         <div>
//             <Header />
//             <h1>Messages</h1>
//             <Table>
//                 <TableHead>
//                     <TableRow>
//                         <TableCell>Email Address</TableCell>
//                         <TableCell>Apartment (City, Street, Number)</TableCell>
//                         <TableCell>Timestamp</TableCell>
//                         <TableCell>Message Content</TableCell>
//                         <TableCell>Actions</TableCell>
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {messages.map((message) => (
//                         <TableRow key={message.id}>
//                             <TableCell>{message.email}</TableCell>
//                             <TableCell>
//                                 {message.flat ? (
//                                     `${message.flat.city}, ${message.flat.streetName}, ${message.flat.streetNumber}`
//                                 ) : (
//                                     'N/A'
//                                 )}
//                             </TableCell>
//                             <TableCell>{new Date(message.timestamp.toDate()).toLocaleString()}</TableCell>
//                             <TableCell>{message.message}</TableCell>
//                             <TableCell>
//                                 <IconButton onClick={() => handleDeleteMessage(message.id)}>
//                                     <Delete />
//                                 </IconButton>
//                                 <IconButton onClick={() => handleReply(message.senderUid)}>
//                                     <Reply />
//                                 </IconButton>
//                             </TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>

//             <Dialog open={open} onClose={handleClose}>
//                 <DialogTitle>Reply to Message</DialogTitle>
//                 <DialogContent>
//                     <textarea
//                         rows={4}
//                         style={{ width: '100%' }}
//                         placeholder="Type your reply..."
//                         value={replyMessage}
//                         onChange={(e) => setReplyMessage(e.target.value)}
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleClose} color="primary">
//                         Cancel
//                     </Button>
//                     <Button onClick={handleSendReply} color="primary">
//                         Send Reply
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </div>
//     );
// }

// export default Messages;



// import React, { useState, useEffect } from 'react';
// import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
// import { Delete, Reply } from '@mui/icons-material';
// import { db } from '../firebase';
// import { collection, getDocs, deleteDoc, doc, query, where, addDoc, getDoc } from 'firebase/firestore';
// import { useAuth } from '../contexts/authContext';
// import Header from './Header';

// function Messages() {
//     const { currentUser } = useAuth();
//     const [messages, setMessages] = useState([]);
//     const [open, setOpen] = useState(false);
//     const [replyMessage, setReplyMessage] = useState('');
//     const [recipientUid, setRecipientUid] = useState('');

//     useEffect(() => {
//         const fetchMessages = async () => {
//             try {
//                 const messagesCollection = collection(db, 'messages');
//                 const q = query(messagesCollection, where('recipientUid', '==', currentUser.uid));
//                 const messagesSnapshot = await getDocs(q);
//                 const messagesList = await Promise.all(
//                     messagesSnapshot.docs.map(async (docSnap) => {
//                         const messageData = docSnap.data();
//                         let flatData = null;

//                         // Verificăm dacă există `flatId` în datele mesajului
//                         if (messageData.flatId) {
//                             const flatRef = doc(db, 'flats', messageData.flatId);
//                             const flatDoc = await getDoc(flatRef);
//                             if (flatDoc.exists()) {
//                                 flatData = flatDoc.data();
//                             }
//                         }

//                         return {
//                             id: docSnap.id,
//                             ...messageData,
//                             flat: flatData,
//                         };
//                     })
//                 );
//                 setMessages(messagesList);
//             } catch (error) {
//                 console.error('Error fetching messages:', error);
//             }
//         };

//         fetchMessages();
//     }, [currentUser]);

//     const handleDeleteMessage = async (messageId) => {
//         try {
//             await deleteDoc(doc(db, 'messages', messageId));
//             setMessages(messages.filter(message => message.id !== messageId));
//             console.log('Message deleted');
//         } catch (error) {
//             console.error('Error deleting message:', error);
//         }
//     };

//     const handleSendReply = async () => {
//         try {
//             if (!recipientUid) {
//                 console.error('recipientUid is undefined. Cannot send message.');
//                 return;
//             }

//             if (!replyMessage || replyMessage.trim() === '') {
//                 console.error('Message content is undefined or empty.');
//                 return;
//             }

//             await addDoc(collection(db, 'messages'), {

//                 senderUid: currentUser.uid,
//                 recipientUid: recipientUid,
//                 message: replyMessage,
//                 timestamp: new Date(),
//             });

//             handleClose();
//             console.log('Reply sent successfully');
//         } catch (error) {
//             console.error('Error sending message:', error);
//         }
//     };

//     const handleReply = (senderUid) => {
//         if (!senderUid) {
//             console.error('senderUid is undefined');
//             return;
//         }
//         setRecipientUid(senderUid);
//         setOpen(true);
//     };

//     const handleClose = () => {
//         setOpen(false);
//         setReplyMessage('');
//     };

//     return (
//         <div>
//             <Header />
//             <h1>Messages</h1>
//             <Table>
//                 <TableHead>
//                     <TableRow>
//                         <TableCell>Email Address</TableCell>
//                         <TableCell>Apartment (City, Street, Number)</TableCell>
//                         <TableCell>Timestamp</TableCell>
//                         <TableCell>Message Content</TableCell>
//                         <TableCell>Actions</TableCell>
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {messages.map((message) => (
//                         <TableRow key={message.id}>
//                             <TableCell>{message.email}</TableCell>
//                             <TableCell>
//                                 {message.flat ? (
//                                     `${message.flat.city}, ${message.flat.streetName}, ${message.flat.streetNumber}`
//                                 ) : (
//                                     'N/A'
//                                 )}
//                             </TableCell>
//                             <TableCell>{new Date(message.timestamp.toDate()).toLocaleString()}</TableCell>
//                             <TableCell>{message.message}</TableCell>
//                             <TableCell>
//                                 <IconButton onClick={() => handleDeleteMessage(message.id)}>
//                                     <Delete />
//                                 </IconButton>
//                                 <IconButton onClick={() => handleReply(message.senderUid)}>
//                                     <Reply />
//                                 </IconButton>
//                             </TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>

//             <Dialog open={open} onClose={handleClose}>
//                 <DialogTitle>Reply to Message</DialogTitle>
//                 <DialogContent>
//                     <textarea
//                         rows={4}
//                         style={{ width: '100%' }}
//                         placeholder="Type your reply..."
//                         value={replyMessage}
//                         onChange={(e) => setReplyMessage(e.target.value)}
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleClose} color="primary">
//                         Cancel
//                     </Button>
//                     <Button onClick={handleSendReply} color="primary">
//                         Send Reply
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </div>
//     );
// }

// export default Messages;




import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Delete, Reply } from '@mui/icons-material';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, query, where, addDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/authContext';
import Header from './Header';

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

        try {
            // Verifică dacă `currentUser` și `selectedFlat` sunt definiți
            if (!currentUser || !selectedFlat) {
                console.error('User or selected flat is not defined.');
                return;
            }




            await addDoc(collection(db, 'messages'), {
                ownerEmail: currentUser.email,
                senderUid: currentUser.uid,
                recipientUid: recipientUid,
                message: replyMessage,
                flatId: selectedFlat.id,
                timestamp: new Date(),
                // flatList: {
                //     city: selectedFlat.city || 'Unknown',
                //     streetName: selectedFlat.streetName || 'Unknown',
                //     streetNumber: selectedFlat.streetNumber || 'Unknown'
                // }
            });

            console.log('Message sent successfully');
            handleClose();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    const handleReply = (senderUid, flat) => {
        if (!senderUid) {
            console.error('senderUid is undefined');
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
            <Header />
            <h1>Messages</h1>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Email Address</TableCell>
                        <TableCell>Apartment (City, Street, Number)</TableCell>
                        <TableCell>Timestamp</TableCell>
                        <TableCell>Message Content</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {messages.map((message) => (
                        <TableRow key={message.id}>
                            <TableCell>{message.ownerEmail}</TableCell>
                            <TableCell>
                                {message.flat ? (
                                    `${message.flat.city}, ${message.flat.streetName}, ${message.flat.streetNumber}`
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
                                <IconButton onClick={() => handleReply(message.senderUid)}>
                                    <Reply />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
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
