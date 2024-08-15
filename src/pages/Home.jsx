import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div>
            <li>
                <Link to='/dashboard'>
                    <button className="btn btn-primary">Dash board</button>
                </Link>
            </li>

            <li>
                <Link to='/announcement'>
                    <btn>Announcement</btn>
                </Link>
            </li>

            <li>
                <Link to='/taskdeliverables'>
                    <btn>Task deliverables</btn>
                </Link>
            </li>

            <li><Link to='/teamtask'>
                <btn>Team task</btn>
            </Link>
            </li>

        </div>
    )
}

export default Home
