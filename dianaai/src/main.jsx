import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router-dom'
import DashboardPage from './routes/dashboardPage/dashboardPage'
import ChatPage from "./routes/chatPage/ChatPage";
import Homepage from './routes/homepage/Homepage';
import RootLayout from './layouts/rootLayout/RootLayout'

const router = createBrowserRouter([
  {
  ELEMENT: <RootLayout/>,
  children: [
    {
      path: "/", element: <Homepage/>,

 },
],
},
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
);
