import React from 'react'
import Hero from '../components/Layout/Hero'
import GenderCollectionSecion from '../components/Products/GenderCollectionSecion'
import NewArrivals from '../components/Products/NewArrivals'

const Home = () => {
  return (
    <div>
      <Hero />
      <GenderCollectionSecion />
      <NewArrivals />
    </div>
  )
}

export default Home