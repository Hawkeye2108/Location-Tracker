import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { UserProvider } from './context.js/userContext.jsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import MapPage from './pages/MapPage.jsx'

const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>
  },
  {
    path:"/map",
    element:<MapPage/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router}/>
    </UserProvider>
  // </React.StrictMode>,
)
