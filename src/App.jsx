import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import toast, { Toaster } from 'react-hot-toast'
import JoinCreateChat from './components/Joinpage'
import { ThemeProvider } from '@material-tailwind/react'
import ChatPage from './components/ChatPage'



function App() {
 

  return (
    <>
    <div>

     
        <JoinCreateChat/>
        
      

    </div>
      
    </>
  )
}

export default App
