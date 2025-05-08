import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

// Retrieve user info and token from localStorage if available

const userFromStorage = localStorage.getItem('userInfo') ?  JSON.parse(localStorage.getItem("userInfo")) : null;

// Check for an existing guest ID in the localStorage or generate a new One

const  initialGuestId = localStorage.getItem("guestId") ||
`guest_${new Date().getTime()}`;
localStorage.setItem("guestId", initialGuestId)



// Initail state

const initialState = {
  user: userFromStorage,
  guestId: initialGuestId,
  loading: false,
  error: null,
}

// Async Thunk for user Login
export const loginUser = createAsyncThunk('auth/loginUser', async(userData, {rejectWithValue}) => {
  try {
    console.log("Attempting login with:", userData.email);
    console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);

    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, userData);

    console.log("Login response:", response.data);

    // Ensure user and token exist before storing
    if (response.data && response.data.token) {
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);
      return response.data.user; // Return the user object from the response
    } else {
      console.error("Token not found in response:", response.data);
      return rejectWithValue({ message: "Authentication failed: Token not found in response" });
    }
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    return rejectWithValue(
      error.response?.data ||
      { message: error.message || "Login failed. Please try again." }
    );
  }
})

// Async Thunk for User Registration
export const registerUser = createAsyncThunk("auth/registerUser", async(userData, {rejectWithValue}) => {
  try {
    console.log("Attempting registration with:", userData.email);

    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, userData);

    console.log("Registration response:", response.data);

    if (response.data && response.data.token) {
      localStorage.setItem('userInfo', JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);
      return response.data.user; // Return the user object from the response
    } else {
      console.error("Token not found in registration response:", response.data);
      return rejectWithValue({ message: "Registration failed: Token not found in response" });
    }
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    return rejectWithValue(
      error.response?.data ||
      { message: error.message || "Registration failed. Please try again." }
    );
  }
})

// Slice

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.guestId = `guest_${new Date().getTime()}`; // Reset guest ID on logout
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      localStorage.setItem('guestId', state.guestId); // set new guest ID in localStorage
    },

    generateNewGuestId : (state) => {
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.setItem("guestId", state.guestId);
    }
  },
  extraReducers : (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    }).addCase(loginUser.fulfilled, (state,action) => {
      state.loading = false;
      state.user = action.payload;
      console.log("Auth Slice - User from API:", state.user);
    }).addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Login Failed";
    }).addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    }).addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    }).addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Registration failed";
    })
  }
})

export const {logout, generateNewGuestId} = authSlice.actions

export default authSlice.reducer;
