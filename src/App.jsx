import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import TimeSheet from './pages/TimeSheet'
import Announcement from './pages/Announcement'
import Profile from './pages/Profile'
import TeamTask from './pages/TeamTask'
import TaskDeliverables from './pages/TaskDeliverables'
import Home from './pages/Home'
import Files from './pages/Files'
import 'tailwindcss/tailwind.css'
import { TimesheetProvider } from './context/TimesheetContext'

const App = () => {
  return (
    <TimesheetProvider>
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<Dashboard/>}/>
        <Route path='/announcement' element={<Announcement/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/teamtask' element={<TeamTask/>}/>
        <Route path='/timesheet' element={<TimeSheet/>}/>
        <Route path='/taskdeliverables' element={<TaskDeliverables/>}/>
        <Route path='/files' element={<Files/>}/>
      </Routes>
    </BrowserRouter>
    </TimesheetProvider>
  )
}

export default App
