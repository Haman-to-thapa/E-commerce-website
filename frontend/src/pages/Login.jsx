import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import login from '../assets/login.webp'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../redux/slice/authSlice'
import { mergeCart } from '../redux/slice/cartSlice'
import { toast } from 'sonner'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation();
  const { user, guestId, loading, error } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  //Get redurect parameter and check if it's checkout or something
  const redirect = new URLSearchParams(location.search).get("redirect") || '/';

  const isCheckoutRedirect = redirect && redirect.includes("checkout");


  useEffect(() => {
    const mergeAndRedirect = async () => {
      if (user) {
        if (cart?.products.length > 0 && guestId) {
          await dispatch(mergeCart({ guestId, user }));
        }
        navigate(isCheckoutRedirect ? "/checkout" : '/');
      }
    };
    mergeAndRedirect();
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  // Show error toast when login fails
  useEffect(() => {
    if (error) {
      toast.error(typeof error === 'string' ? error : error.message || 'Login failed. Please try again.');
    }
  }, [error]);




  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      toast.success('Login successful!');
    } catch (err) {
      // Error is already handled in the useEffect
      console.error('Login failed:', err);
    }
  }

  return (
    <div className='flex'>
      <div className="w-full  md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12` ">

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm">
          <div className="flex justify-center mb-6">
            <h2 className='text-xl font-medium'>Rabbit</h2>
          </div>
          <h2 className='text-2xl font-bold text-center mb-6'>Hey threr! </h2>
          <p className='text-center mb-6'>Enter your username and password to login.

            <span className='bg-red-400'>admin@example.com <br />123456</span>
          </p>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input type="email"
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='border w-full p-2 rounded-lg'
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold">
              Password
            </label>
            <input type="password"
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='border w-full p-2 rounded-lg'
            />
          </div>

          <button
            type='submit'
            className='w-full p-2 bg-black text-white rounded-full mt-2 hover:bg-gray-800 transition-all'
          >
            {loading ? "Loading..." : " Sign In "}

          </button>

          <p className='mt-6 text-center text-sm'>Don't have an account? {""}
            <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className='text-blue-500 underline'>Register</Link>
          </p>
        </form>
      </div >

      {/* left side */}
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center mt-2">

          <img src={login} alt="login to " className='w-full h-[750px] object-cover  ' />
        </div>

      </div>

    </div >
  )
}

export default Login