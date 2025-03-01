import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import Myroutes from './config/Myroutes.jsx'
import { Toaster } from 'react-hot-toast'
import { ChatProvider } from './context/ChatContext.jsx'

createRoot(document.getElementById('root')).render(
 
    <BrowserRouter>
      <Toaster/>
    <ChatProvider>
  
    <Myroutes/>

    </ChatProvider>
    
    </BrowserRouter>
 
)
