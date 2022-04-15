import { createSlice } from '@reduxjs/toolkit';

const toolbarHeaderSlice = createSlice({
    name: 'toolbarHeader',
    initialState: {
        heading: '',
    },
    reducers: {
        setToolbarHeader: (state, action) => {
            state.heading = action.payload;
        }
    },
});

export const { setToolbarHeader } = toolbarHeaderSlice.actions;

export default toolbarHeaderSlice.reducer;
