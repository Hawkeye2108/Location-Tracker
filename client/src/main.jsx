import React, { useContext } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { UserContext, UserProvider } from './context/userContext.jsx'
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom"
import MapPage from './pages/MapPage.jsx'

// Create a custom route component that handles the conditional rendering
const ProtectedMapRoute = () => {
  const { users } = useContext(UserContext);
  return users.length === 0 ? <Navigate to="/"/> : <MapPage />;
};
const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>
  },
  {
    path:"/map",
    element:<ProtectedMapRoute/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router}/>
    </UserProvider>
  // </React.StrictMode>,
)
