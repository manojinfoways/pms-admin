import { createSlice } from '@reduxjs/toolkit';

const ptrDetailsSlice = createSlice({
    name: 'ptrDetails',
    initialState: {
        details: [],
        alpha: []
    },
    reducers: {
        setPtrDetails: (state, action) => {
            state.details = action.payload;
        },
        setPtrAlphaRecords: (state, action) => {
            state.alpha = action.payload;
        }
    },
});

export const { setPtrDetails, setPtrAlphaRecords } = ptrDetailsSlice.actions;

export default ptrDetailsSlice.reducer;
