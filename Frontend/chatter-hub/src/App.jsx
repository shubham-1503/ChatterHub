import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Error404 from './pages/Error/Error404';
import Landing from './pages/Landing/Landing';
import Room from './pages/Room/Room';
import Chat from './pages/Chat/Chat';
import Login from './pages/Login/Login';

function App() {
  return (
    <div className='bg-darkNavyBlue text-white'>
      <Router>
        <Routes>
          <Route path='/' element={<Landing/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/room' element={<Room/>} />
          <Route path='/chat' element={<Chat/>} />
          <Route path='*' element={<Error404/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App