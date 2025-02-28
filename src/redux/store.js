import { configureStore } from "@reduxjs/toolkit";
import isUserLoggedInSlice from './features/isUserLoggedInSlice';
import reportIdSlice from "./features/reportIdSlice";


export const store = configureStore({
    reducer: {
        isUserLoggedIn: isUserLoggedInSlice,
        reportId: reportIdSlice
    },
});

export default store;