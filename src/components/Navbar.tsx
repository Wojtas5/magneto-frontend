import { NavLink } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
    return (
        <div className='navbar_'>
            <NavLink className='link_' to='/'>
                <h2>Magneto</h2>
            </NavLink>
        </div>
    )
}

export default Navbar