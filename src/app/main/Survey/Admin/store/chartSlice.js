import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {message} from "antd";

const sliceName = 'surveySlice';

export const fetchChartData73 = createAsyncThunk(`${sliceName}/fetchChartData73`, async () => {
    try {
        const { data } = await axios.get(`/questionresponse/statics/byquestions?questionIds=73`);
        return {
            chartData73: data.data
        };
    } catch (e) {
        return {
            error: e.message,
            chartData73: []
        };
    }
});

export const fetchChartData42 = createAsyncThunk(`${sliceName}/fetchChartData42`, async (questionId) => {
    try {
        const { data } = await axios.get(`/questionresponse/statics/byquestions?questionIds=42`);
        return {
            chartData42: data.data
        };
    } catch (e) {
        return {
            error: e.message,
            chartData42: []
        };
    }
});

export const fetchChartData47 = createAsyncThunk(`${sliceName}/fetchChartData47`, async (questionId) => {
    try {
        const { data } = await axios.get(`/questionresponse/statics/byquestions?questionIds=47`);
        return {
            chartData47: data.data
        };
    } catch (e) {
        return {
            error: e.message,
            chartData47: []
        };
    }
});
   

const surveySlice = createSlice({
    name: sliceName,
    initialState: {
        
        chartData42: [],
        chartData47: [],
        chartData73: [],
        
    },
    extraReducers: {
        
        [fetchChartData42.fulfilled]: (state, action) => {
            state.chartData42 = action.payload.chartData42;
        },
        [fetchChartData47.fulfilled]: (state, action) => {
            state.chartData47 = action.payload.chartData47;
        },
        [fetchChartData73.fulfilled]: (state, action) => {
            state.chartData73 = action.payload.chartData73;
        },
    }
});

export default surveySlice.reducer;
