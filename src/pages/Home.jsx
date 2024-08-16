import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div>
            <li>
                <Link to='/dashboard'>
                    <button className="btn btn-outline btn-success mb-4 mt-4">Dash board</button>
                </Link>
            </li>

            <li>
                <Link to='/announcement'>
                    <button className="btn btn-outline btn-success mb-4">Announcement</button>
                </Link>
            </li>

            <li>
                <Link to='/taskdeliverables'>
                    <button className="btn btn-outline btn-success mb-4">Task Deliverables</button>
                </Link>
            </li>

            <li>
                <Link to='/taskdeliverables'>
                    <button className="btn btn-outline btn-success mb-4">Files</button>
                </Link>
            </li>

            <li><Link to='/teamtask'>
                <button className="btn btn-outline btn-success mb-4">Team Task</button>
            </Link>
            </li>
            <li><Link to='/timesheet'>
                <button className="btn btn-outline btn-success mb-4">Timesheet</button>
            </Link>
            </li>

        </div>
    )
}

export default Home
