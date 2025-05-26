import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchAdminProducts } from '../../redux/slice/adminProductSlice'
import { fetchAllOrders } from '../../redux/slice/adminOrderSlice'

const AdminHomePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { products, loading: productsLoading, error: productsError } = useSelector((state) => state.adminProducts)
  const { orders, totalOrders, totalSales, loading: ordersLoading, error: ordersError } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    // Check if user is logged in and is admin
    if (!user || user.role !== "admin") {
      navigate('/login');
      return;
    }

    // Check if token exists
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
      return;
    }

    dispatch(fetchAdminProducts()).unwrap().catch((error) => {
      if (error.message?.includes("Authentication failed") || error.message?.includes("No authentication token")) {
        navigate('/login');
      }
    });
    dispatch(fetchAllOrders()).unwrap().catch((error) => {
      if (error.message?.includes("Authentication failed") || error.message?.includes("No authentication token")) {
        navigate('/login');
      }
    });
  }, [dispatch, user, navigate]);

  // Helper function to format error message
  const formatError = (error) => {
    if (typeof error === 'object' && error !== null) {
      return error.message || JSON.stringify(error);
    }
    return error;
  };

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {productsLoading || ordersLoading ? (
        <p>Loading ...</p>
      ) : productsError ? (
        <p className="text-red-500">Error fetching products: {formatError(productsError)}</p>
      ) : ordersError ? (
        <p className="text-red-500">Error fetching orders: {formatError(ordersError)}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold">Revenue</h2>
            <p className="text-2xl">${totalSales}</p>
          </div>
          <div className="p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold">Total Orders</h2>
            <p className="text-2xl">{totalOrders}</p>
          </div>
          <div className="p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold">Total Products</h2>
            <p className="text-2xl">{products.length}</p>
          </div>
        </div>
      )}

      <div className="mt-6 ">
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto ">
          <table className="min-w-full text-left text-gray-500">
            <thead className='bg-gray-300 text-sm uppercase text-gray-700'>
              <tr>
                <th className="py-3 px-4 ">Order ID</th>
                <th className="py-3 px-4 ">User </th>
                <th className="py-3 px-4 ">Total Price</th>
                <th className="py-3 px-4 ">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id}
                    className='border-b hover:bg-gray-50 cursor-pointer'
                  >
                    <td className='p-4'>{order._id}</td>
                    <td className="p-4">{order.user.name}</td>
                    <td className="p-4">{order.totalPrice.toFixed(2)}</td>
                    <td className="p-4">{order.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className='p-4 text-center text-gray-500'>
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminHomePage
