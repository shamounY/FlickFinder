import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.scss'

const Navbar: React.FC = () => (
    <div className='nav-bar'>
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/movies">Movies</Link></li>
            </ul>
        </nav>
    </div>
)

export default Navbar
