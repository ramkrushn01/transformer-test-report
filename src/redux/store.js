import { configureStore } from "@reduxjs/toolkit";
import isUserLoggedInSlice from './features/isUserLoggedInSlice';


export const store = configureStore({
    reducer: {
        isUserLoggedIn: isUserLoggedInSlice        
    },
});

export default store;