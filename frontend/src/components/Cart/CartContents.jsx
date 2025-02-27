import React from 'react'
import { RiDeleteBinLine } from 'react-icons/ri'

const CartContents = () => {

  const cartProducts = [
    {
      productId: 1,
      name: "T-shirt",
      size: "M",
      color: "Red",
      quantity: 1,
      price: 15,
      image: "https://picsum.photos/200?random=1"

    },
    {
      productId: 2,
      name: "Jeans",
      size: "L",
      color: "Blue",
      quantity: 1,
      price: 25,
      image: "https://picsum.photos/200?random=2"
    }
  ]

  return (
    <div>
      {
        cartProducts.map((product, index) => (
          <div key={index}>
            <div className='flex items-start justify-between py-4 border-b'>
              <img src={product.image} alt={product.name} className='w-20 h-20 object-cover mr-4 rounded' />
              <div>
                <h3>{product.name}</h3>
                <p
                  className='text-sm text-gray-500'
                >size: {product.size} | color: {product.color}</p>
                <div className='flex items-center mt-2'>
                  <button className='border px-2 py-1 text-xl font-medium'> - </button>
                  <span className='mx-4'>{product.quantity}</span>
                  <button className='flex border items-center py-1 px-2 text-xl font-medium'> + </button>
                </div>
              </div>

              <div>
                <p> $ {product.price.toLocaleString()}</p>
                <button>
                  <RiDeleteBinLine className='h-6 w-6 mt-2 text-red-600' />
                </button>
              </div>


            </div>
          </div>
        ))
      }
    </div>
  )
}

export default CartContents