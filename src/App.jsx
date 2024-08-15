import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/dashboard'
import TimeSheet from './pages/TimeSheet'
import Announcement from './pages/Announcement'
import Profile from './pages/Profile'
import TeamTask from './pages/TeamTask'
import TaskDeliverables from './pages/TaskDeliverables'
import Home from './pages/Home'


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<Home/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/announcement' element={<Announcement/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/teamtask' element={<TeamTask/>}/>
        <Route path='/timesheet' element={<TimeSheet/>}/>
        <Route path='/taskdeliverables' element={<TaskDeliverables/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
