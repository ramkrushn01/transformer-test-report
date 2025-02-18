import { createSlice } from "@reduxjs/toolkit";
import API from "../../api/custom_axios";

const initialState = {
    isAuthenticated: localStorage.getItem("login-token") ? true : false,
    loginToken: localStorage.getItem("login-token"),
};

const LogoutFromServer = async () => {
    const LogoutResponse = await API.post("logout/", {
        refresh: localStorage.getItem("refresh-token"),
    });

    return LogoutResponse;
};

const isUserLoggedInSlice = createSlice({
    name: "isUserLoggedIn",
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.loginToken = action.payload;
        },

        logout: (state) => {
            LogoutFromServer().catch(err=>console.log(err));
            localStorage.removeItem("login-token");
            localStorage.removeItem("refresh-token");
            state.isAuthenticated = false;
            state.loginToken = null;
        },
    },
});

export const { login, logout } = isUserLoggedInSlice.actions;
export default isUserLoggedInSlice.reducer;
