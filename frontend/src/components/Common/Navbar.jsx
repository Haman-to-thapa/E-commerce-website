import React from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineUser, HiBars3BottomRight, HiOutlineShoppingBag } from 'react-icons/hi2'
import SearchBar from './SearchBar'
import CartDrawer from '../Layout/CartDrawer'
import { useState } from 'react'

const Navbar = () => {


  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  return (<>

    <nav className='container mx-auto flex items-center justify-between py-4 px-6'>

      {/* Left - Logo */}

      <div>
        <Link to='/' className='text-2xl font-medium'>
          Rabbit
        </Link>
      </div>

      {/* Center - Navigation LInks */}
      <div className='hidden md:flex space-x-6'>
        <Link to='#' className='text-gray-700 hover:text-black text-sm font-medium uppercase'>
          Men
        </Link>

        <Link to='#' className='text-gray-700 hover:text-black text-sm font-medium uppercase'>
          Women
        </Link>

        <Link to='#' className='text-gray-700 hover:text-black text-sm font-medium uppercase'>
          Top Wear
        </Link>

        <Link to='#' className='text-gray-700 hover:text-black text-sm font-medium uppercase'>
          Bottom Wear
        </Link>

      </div>


      {/* {Right section} */}

      <div className='flex items-center space-x-4'>
        <Link to='/profile' className='hover:text-black'>
          <HiOutlineUser className='h-6 w-7 text-gray-700' />
        </Link>
        <button
          onClick={toggleCartDrawer}
          className='relative hover:text-black'>
          <HiOutlineShoppingBag className='h-6 w-6 text-gray-700' />
          <span className='absolute bg-rabbit-red text-white -top-3 text-sm rounded-full px-2 py-0.5'>
            4
          </span>
        </button>
        {/* Search  */}
        <div className='overflow-hidden'>
          <SearchBar />
        </div>
        <button className='md:hidden'>
          <HiBars3BottomRight className='h-6 w-6 text-gray-700' />
        </button>
      </div>

    </nav>

    <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

  </>
  )
}

export default Navbar
