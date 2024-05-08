// eslint-disable-next-line no-unused-vars
import React from 'react'
import Logo from '../atoms/Logo'
import NavbarMenu from '../molecules/NavbarMenu'
import './Navbar.css'

function Navbar () {
  return (
    <nav className='shadow-lg navbar-wrapper lg:bg-transparent !border-gray-200  fixed w-full md:h-[10vh] lg:h-[20vh] md:bg-neutral-800 md:!bg-opacity-50'>
      <div className='flex lg:flex-row h-full justify-between px-2 pt-2 md:pt-0 md:flex-col'>
        <div className='my-auto lg:ml-12'>
          <Logo />
        </div>
        <NavbarMenu />
      </div>
    </nav>
  )
}

export default Navbar