import React, { useState } from 'react'
import { BiLineChart, BiMenu, BiMap } from 'react-icons/bi'
import { IoClose } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import './Sidebar.css'

const Sidebar = () => {

    const [active, setActive] = useState(false);

    const activateNav = () => {
        setActive(!active)
    }

    return (
        <div className={active ? 'sidebar_' : 'sidebar-minimal'}>

            <div className='menu-icon' onClick={activateNav}>
                {!active ? <BiMenu className='menu' /> : <IoClose className='menu' />}
            </div>

            <nav>
                <ul className={active ? 'ul-item_' : 'ul-item_ oicon'}>
                    <li>
                        <Link className='link_' to='/position'>
                            <BiMap className='icon_' />
                            <div className='text_'>Position</div>
                        </Link>
                    </li>

                    <li>
                        <Link className='link_' to='/charts'>
                            <BiLineChart className='icon_' />
                            <div className='text_'>Charts</div>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Sidebar