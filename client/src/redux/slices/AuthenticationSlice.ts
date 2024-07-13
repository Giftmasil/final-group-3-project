import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {  LoginUserPayload, RegisterUserPayload, User } from "../../models/User";

export interface AuthenticationSliceState {
    loggedInUser: User | undefined,
    loading: boolean,
    error: boolean,
    success: boolean
}

const initialState: AuthenticationSliceState = {
    loggedInUser: undefined,
    loading: false,
    error: false,
    success: false
}

export const loginUser = createAsyncThunk(
    "auth/login",
    async (user: LoginUserPayload, thunkAPI) => {
        try {
            const response = await axios.post("https://final-group-3-project-backend.onrender.com/auth/login", user);
            console.log(response.data);
            return response.data.user;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/register",
    async (user: RegisterUserPayload, thunkAPI) => {
        try {
            const response = await axios.post("https://final-group-3-project-backend.onrender.com/auth/register", user);
            return response.data.user;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
        try {
            const response = await axios.post("https://final-group-3-project-backend.onrender.com/auth/logout");
            return response.data.user;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
)

const AuthenticationSlice = createSlice({
    name: "authentication",
    initialState,
    reducers: {
        resetRegisterSuccess: (state) => {
            state.success = false
            return state
        },
        resetUser: (state) => {
            state.loggedInUser = undefined
            return state
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state) => {
            state = {
                ...state,
                loading: true,
                error: false
            }
            return state
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state = {
                ...state,
                loading: false,
                success: true,
                error: false,
                loggedInUser: action.payload
            }
            localStorage.setItem("userId", action.payload._id);
            return state
        });
        builder.addCase(loginUser.rejected, (state) => {
            state = {
                ...state,
                loading: false,
                error: true
            }
            return state
        });
        builder.addCase(registerUser.pending, (state) => {
            state = {
                ...state,
                loading: true,
                error: false
            }

            return state
        });
        builder.addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
            state = {
                ...state,
                loading: false,
                error: false,
                success: true,
                loggedInUser: action.payload
            }
            /* localStorage.setItem("userId", action.payload.id); */
            return state
        });
        builder.addCase(registerUser.rejected, (state) => {
            state = {
                ...state,
                loading: false,
                error: true
            }
            return state
        });
        builder.addCase(logoutUser.pending, (state) => {
            state = {
                ...state,
                loading: true,
                error: false
            }
            return state
        })
        builder.addCase(logoutUser.fulfilled, (state) => {
            state = {
                ...state,
                loading: false,
                loggedInUser: undefined
            }
            localStorage.removeItem("userId");
            return state
        })
        builder.addCase(logoutUser.rejected, (state) => {
            state = {
                ...state,
                loading: false,
                error: true
            }

            return state
        })
    }
})

export const { resetRegisterSuccess, resetUser } = AuthenticationSlice.actions;

export default AuthenticationSlice.reducer;
