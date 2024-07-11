import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "./slices/AuthenticationSlice";
import emergencyReducer from "./slices/EmergencySlice"
import userReducer from "./slices/UserSlice"

export const store = configureStore({
    reducer: {
        authentication: authenticationReducer,
        emergency: emergencyReducer,
        user: userReducer
    },
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;