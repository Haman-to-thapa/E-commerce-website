import React from 'react'
import Hero from '../components/Layout/Hero'
import GenderCollectionSecion from '../components/Products/GenderCollectionSecion'
import NewArrivals from '../components/Products/NewArrivals'
import ProductDetails from '../components/Products/ProductDetails'

const Home = () => {
  return (
    <div>
      <Hero />
      <GenderCollectionSecion />
      <NewArrivals />

      {/* Best Seller */}
      <h2 className='text-3xl text-center font-bold mb-4'>
        Best Seller      </h2>
      <ProductDetails />
    </div>
  )
}

export default Home