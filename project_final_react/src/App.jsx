// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>

//     </>
//   )
// }

// export default App

// import React from 'react';
// import { useAuth } from './contexts/authContext';

// function App() {
//   const { currentUser, userLoggedIn } = useAuth();

//   return (
//     <div>
//       {userLoggedIn && currentUser && (
//         <UserTable
//           users={users}
//           isAdmin={currentUser.isAdmin}
//           currentUser={currentUser}
//           onDelete={handleDelete}
//           onEdit={handleEdit}
//           editingUser={editingUser}
//           editedData={editedData}
//           onEditChange={handleEditChange}
//           onEditSubmit={handleEditSubmit}
//           onCloseEditDialog={handleCloseEditDialog}
//         />
//       )}
//     </div>
//   );
// }

// export default App;

// import React from 'react';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import Home from './components/Home';
// import AllFlats from './components/AllFlats';
// import MyFlats from './components/MyFlats';
// import FavoriteFlats from './components/FavoriteFlats';
// import AddFlat from './components/AddFlat';
// import Messages from './components/Messages';


// const router = createBrowserRouter([

//   {
//     path: '/',
//     element: <Messages /> // Asociază ruta cu componenta Messages
//   }
//   ,
//   {
//     path: '/',
//     element: <Home />,
//     children: [
//       {
//         path: 'all-flats',
//         element: <AllFlats />,
//       },
//       {
//         path: 'my-flats',
//         element: <MyFlats />,
//       },
//       {
//         path: 'favorite-flats',
//         element: <FavoriteFlats />,
//       },
//       {
//         path: 'add-flat',
//         element: <AddFlat />,
//       },
//     ],
//   },
// ]);

// function App() {
//   return <RouterProvider router={router} />;
// }

// export default App;

