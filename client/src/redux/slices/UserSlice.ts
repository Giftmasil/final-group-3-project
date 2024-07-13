import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../../models/User";

export interface UserSliceState {
    user: User | null,
    loading: boolean,
    error: boolean,
    success: boolean
}

const initialState: UserSliceState = {
    user: null,
    loading: false,
    error: false,
    success: false
}

export const fetchUser = createAsyncThunk(
    "user/fetch",
    async (payload: { userId: string }, thunkAPI) => {
        try {
            const response = await axios.get(`https://final-group-3-project-backend.onrender.com/users/${payload.userId}`);
            
            return response.data.user;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const updateUser = createAsyncThunk(
    "user/update",
    async (user: User, thunkAPI) => {
        try {
            const response = await axios.patch(`https://final-group-3-project-backend.onrender.com/users/`, user);
            return response.data.user;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
)

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUser.pending, (state) => {
            state = {
                ...state,
                loading: true,
                error: false
            }
            return state
        });
        builder.addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
            state = {
                ...state,
                loading: false,
                error: false,
                user: action.payload,
                success: true
            }
            return state
        });
        builder.addCase(fetchUser.rejected, (state) => {
            state = {
                ...state,
                loading: false,
                error: true,
                success: false
            }
            return state
        });
        builder.addCase(updateUser.pending, (state) => {
            state = {
                ...state,
                loading: true,
                error: false,
                success: false
            }
            return state
        });
        builder.addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
            state = {
                ...state,
                loading: false,
                error: false,
                user: action.payload,
                success: true
            }
            return state
        });
        builder.addCase(updateUser.rejected, (state) => {
            state = {
                ...state,
                loading: false,
                error: true,
                success: false
            }
            return state
        });
    }
});

export const { } = userSlice.actions;

export default userSlice.reducer;
