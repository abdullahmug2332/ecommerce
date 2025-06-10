import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const token = Cookies.get("token");
const userCookie = Cookies.get("user");
const user = userCookie ? JSON.parse(userCookie) : null; // ✅ parse cookie

const initialState = {
  user: user,           // ✅ store full object
  token: token || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      // ✅ Sync cookies
      Cookies.set("user", JSON.stringify(action.payload.user));
      Cookies.set("token", action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;

      // ✅ Clear cookies
      Cookies.remove("user");
      Cookies.remove("token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
