// import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './contexts/authContext.jsx';
import Login from './components/login.jsx';
import Register from './components/register.jsx';
import Logout from './components/Logout.jsx';
import Home from './components/Home';
import AllFlats from './components/AllFlats';
import MyFlats from './components/MyFlats';
import FavoriteFlats from './components/FavoriteFlats';
import AddFlat from './components/AddFlat';
import Messages from './components/Messages';
import MyProfiles from './components/MyProfiles';
import UsersProfiles from './components/UsersProfiles.jsx'
import AllUsers from './components/AllUsers.jsx';


const router = createBrowserRouter([

  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/logout', element: <Logout /> },
  { path: '/messages', element: <Messages /> },
  { path: 'all-users', element: <AllUsers /> },


  {
    path: '/my-profiles', element: <MyProfiles />, children: [
      { path: 'users-profiles', element: <UsersProfiles /> },
    ]
  },

  {
    path: '/', element: <Home />, children: [
      { path: 'all-flats', element: <AllFlats /> },
      { path: 'my-flats', element: <MyFlats /> },
      { path: 'favorite-flats', element: <FavoriteFlats /> },
      { path: 'add-flat', element: <AddFlat /> },

    ]
  },

]);



ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
)