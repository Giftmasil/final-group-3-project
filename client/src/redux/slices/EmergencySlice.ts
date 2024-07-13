import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Emergency } from "../../models/Emergency";

export interface EmergencySliceState {
    emergencies: Emergency[],
    loading: boolean,
    error: boolean,
    success: boolean,
}

const initialState: EmergencySliceState = {
    emergencies: [],
    loading: false,
    error: false,
    success: false
}

export const fetchAllEmergencies = createAsyncThunk(
    "emergency/fetchAll",
    async () => {
        const response = await axios.get("https://final-group-3-project-backend.onrender.com/emergency");
        return response.data;
    }
);

export const fetchSingleEmergency = createAsyncThunk(
    "emergency/fetchSingle",
    async (id: string, thunkAPI) => {
        try {
            const response = await axios.get(`https://final-group-3-project-backend.onrender.com/emergency/${id}`);
            return response.data.emergency;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const updateEmergencyStatus = createAsyncThunk(
    "emergency/updateStatus",
    async ({ id, newEmergency }:{id:string, newEmergency:Emergency}, thunkAPI) => {
        try {
            const response = await axios.patch(`https://final-group-3-project-backend.onrender.com/emergency/${id}`, { newEmergency });
            return response.data.emergency;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const createEmergency = createAsyncThunk(
    "emergency/create",
    async (emergency: Emergency, thunkAPI) => {
        try {
            const response = await axios.post("https://final-group-3-project-backend.onrender.com/emergency", emergency);
            return response.data.emergency;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

const EmergencySlice = createSlice({
    name: "emergency",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllEmergencies.pending, (state) => {
                state.loading = true;
                state.error = false;
                return state
            })
            .addCase(fetchAllEmergencies.fulfilled, (state, action: PayloadAction<Emergency[]>) => {
                state.loading = false;
                state.success = true;
                state.error = false;
                state.emergencies = action.payload;
                return state
            })
            .addCase(fetchAllEmergencies.rejected, (state) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                return state
            })
            .addCase(fetchSingleEmergency.pending, (state) => {
                state.loading = true;
                state.error = false;
                return state
            })
            .addCase(fetchSingleEmergency.fulfilled, (state, action: PayloadAction<Emergency>) => {
                state.loading = false;
                state.success = true;
                state.error = false;
                state.emergencies = [action.payload];
                return state
            })
            .addCase(fetchSingleEmergency.rejected, (state) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                return state
            })
            .addCase(updateEmergencyStatus.pending, (state) => {
                state.loading = true;
                state.error = false;
                return state
            })
            .addCase(updateEmergencyStatus.fulfilled, (state, action: PayloadAction<Emergency>) => {
                state.loading = false;
                state.success = true;
                state.error = false;
                const index = state.emergencies.findIndex(e => e._id === action.payload._id);
                if (index !== -1) {
                    state.emergencies[index] = action.payload;
                }
                return state
            })
            .addCase(updateEmergencyStatus.rejected, (state) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                return state
            })
            .addCase(createEmergency.pending, (state) => {
                state.loading = true;
                state.error = false;
                return state
            })
            .addCase(createEmergency.fulfilled, (state, action: PayloadAction<Emergency>) => {
                state.loading = false;
                state.success = true;
                state.error = false;
                state.emergencies.push(action.payload);
                return state
            })
            .addCase(createEmergency.rejected, (state) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                return state
            });
    },
});

export default EmergencySlice.reducer;
