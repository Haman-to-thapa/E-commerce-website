import React from 'react'

import menCollectionImage from '../../assets/mens-collection.webp';
import womenCollectionImage from '../../assets/womens-collection.webp'
import { Link } from 'react-router-dom';

const GenderCollectionSecion = () => {
  return (
    <section className='py-16 px-4 lg:px-0'>

      <div className='container mx-auto flex flex-col md:flex-row gap-8'>
        {/* Women Collection */}
        <div className='relative flex-1'>
          <img src={womenCollectionImage} alt=""
            className='w-full h-[700px] object-cover' />
          <div className='absolute bottom-8 left-8 bg-white bg-opacity-90 p-4'>
            <h2 className='text-2xl font-bold text-gray-900 mb-3'>
              Women's Collection
            </h2>
            <Link to='/collections/all?gender=Women'
              className='text-gray-900 underline'
            >
              Shop Now
            </Link>
          </div>
        </div>


        {/* Men's Collection */}

        <div className='relative flex-1'>
          <img src={menCollectionImage} alt=""
            className='w-full h-[700px] object-cover' />
          <div className='absolute bottom-8 left-8 bg-white bg-opacity-90 p-4'>
            <h2 className='text-2xl font-bold text-gray-900 mb-3'>
              Men's Collection
            </h2>
            <Link to='/collections/all?gender=Men'
              className='text-gray-900 underline'
            >
              Shop Now
            </Link>
          </div>
        </div>


      </div>
    </section>
  )
}

export default GenderCollectionSecion