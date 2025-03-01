import React from 'react'
import App from '../App'
import { Route, Routes } from 'react-router'
import ChatPage from '../components/ChatPage'

import JoinCreateChat from '../components/Joinpage'



function Myroutes() {
  return (
    <Routes>
      <Route path='/' element={<JoinCreateChat/>} />
      <Route path='/chat' element={<ChatPage/>}/>
      <Route path='*' element={<h1>404 Page Not found</h1>} />


    </Routes>
  )
}

export default Myroutes