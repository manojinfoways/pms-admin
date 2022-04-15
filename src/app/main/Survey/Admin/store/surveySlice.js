import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {message} from "antd";

const sliceName = 'surveySlice';

export const fetchStatisticData = createAsyncThunk(`${sliceName}/fetchStatisticData`, async (questionId) => {
    try {
        const { data } = await axios.get(`surveylocation/stats/15/days`);
        return {
            statictData: data.data
        };
    } catch (e) {
        return {
            error: e.message,
            statictData: []
        };
    }
});

export const fetchChartData = createAsyncThunk(`${sliceName}/fetchChartData`, async (questionId) => {
    try {
        const { data } = await axios.get(`/questionresponse/statics/byquestions?questionIds=${questionId}`);
        return {
            chartData: data.data
        };
    } catch (e) {
        return {
            error: e.message,
            chartData: []
        };
    }
});

export const fetchSurveyList = createAsyncThunk(`${sliceName}/fetchSurveyList`, async (surveyId) => {
    try {
        const { data } = await axios.get(`/survey/all/active`);
        return {
            surveyListState: data.data
        };
    } catch (e) {
        return {
            error: e.message,
            surveyListState: []
        };
    }
});


export const fetchQuestionList = createAsyncThunk(`${sliceName}/fetchQuestionList`, async (surveyId) => {
    try {
        const { data } = await axios.get(`/survey/find/${surveyId}`);
        return {
            questionsList: data
        };
    } catch (e) {
        return {
            error: e.message,
            questionsList: []
        };
    }
});
 
export const fetchQuestionTypes = createAsyncThunk(`${sliceName}/fetchQuestionTypes`, async () => {
    try {
        const { data } = await axios.get(`/questiontype/all/active`);
        return {
            questionType: data.data
        };
    } catch (e) {
        return {
            error: e.message,
            questionType: []
        };
    }
});

const surveySlice = createSlice({
    name: sliceName,
    initialState: {
        questions: [],
        questionTypes: [],
        surveyList:[],
        chartData: [],
        statictData:[]
    },
    extraReducers: {
        [fetchQuestionList.fulfilled]: (state, action) => {
            state.questions = action.payload.questionsList;
        },
        [fetchSurveyList.fulfilled]: (state, action) => {
            state.surveyList = action.payload.surveyListState;
        },
        [fetchQuestionTypes.fulfilled]: (state, action) => {
            state.questionTypes = action.payload.questionType;
        },
        [fetchChartData.fulfilled]: (state, action) => {
            state.chartData = action.payload.chartData;
        },
        [fetchStatisticData.fulfilled]: (state, action) => {
            state.statictData = action.payload.statictData;
        },
        
    }
});

export default surveySlice.reducer;
