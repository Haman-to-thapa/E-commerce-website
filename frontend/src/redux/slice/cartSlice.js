import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Helper funcions to load cart from localStorage
const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem('cart');
  return storedCart ? JSON.parse(storedCart) : {products: []};
};

// Helper functions to save cart to localStorage
const saveCartToStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart))
};

// Fetch cart for a user or guest 
export const fetchCart = createAsyncThunk("cart/fetchCart", async ({userId, guestId}, {rejectWithValue}) => {
  try {
    
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {params: {userId, guestId},});

    return response.data;

  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

// Add n item to the cart a userro guest 
export const addToCart = createAsyncThunk('cart/addToCart', async({productId, quantity, size, color, guestId, userId}, {rejectWithValue}) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
      productId, 
      quantity,
       size, 
       color,
       guestId,
        userId,
      })
    return response.data;

  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

// Update the quantity of an item in the cart
export const updateCartItemQuantity = createAsyncThunk("cart/updateCartItemQuantity", async({productId, quantity, guestId, userId, size, color}, {rejectWithValue}) => {
  try {   
    const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
      productId,
      quantity,
      guestId,
      userId,
      size,
      color,
    })
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data)
  }

})

// Remove an item frm the cart 

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async({productId, guestId, userId, size, color}, {rejectWithValue}) => {
  try {
    
    const response = await axios({
      method: "DELETE",
      url: `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
      data: {productId, guestId, userId, size, color}
    });
    return response.data

  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

// Merge guest cart into user cart
export const mergeCart = createAsyncThunk('cart/mergeCart', async({guestId, user}, {rejectWithValue}) => {
  try {
    const token = localStorage.getItem("userToken");
    if (!token) {
      return rejectWithValue({ message: "Authentication required. Please login first." });
    }

    // First verify the token is valid
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      // If token verification fails, clear the invalid token
      localStorage.removeItem("userToken");
      return rejectWithValue({ message: "Session expired. Please login again." });
    }

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`, 
      {guestId, user},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem("userToken");
      return rejectWithValue({ message: "Authentication failed. Please login again." });
    }
    return rejectWithValue(error.response?.data || { message: "Failed to merge cart" });
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: loadCartFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = {products: []};
      localStorage.removeItem('cart');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers : (builder) => {
    builder 
    .addCase(fetchCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchCart.fulfilled, (state,action) => {
      state.loading = false;
      state.cart = action.payload;
      saveCartToStorage(action.payload);
    })
    .addCase(fetchCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetchCart"
    })
    .addCase(addToCart.pending, (state)  => {
      state.loading = true;
      state.error = null;
    })
    .addCase(addToCart.fulfilled, (state,action) => {
      state.loading = false;
      state.cart = action.payload;
      saveCartToStorage(action.payload);
    })
    .addCase(addToCart.rejected, (state,action) => {
      state.loading = false;
      state.error = action.payload?.message || action.error?.message || "Failed to fetch cart";
    })
    .addCase(removeFromCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(removeFromCart.fulfilled, (state,action) => {
      state.loading = false;
      state.cart = action.payload;
      saveCartToStorage(action.payload);
    })
    .addCase(removeFromCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || action.error?.message || "Failed to remove item from cart";
    })
    .addCase(mergeCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(mergeCart.fulfilled, (state, action) => {
      state.loading = false;
      state.cart = action.payload;
      state.error = null;
      saveCartToStorage(action.payload);
    })
    .addCase(mergeCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to merge cart";
      // If there's an auth error, clear the cart
      if (action.payload?.message?.includes("Authentication failed") || 
          action.payload?.message?.includes("Session expired")) {
        state.cart = {products: []};
        localStorage.removeItem('cart');
      }
    });
  }
})

export const {clearCart, clearError} = cartSlice.actions;
export default cartSlice.reducer;