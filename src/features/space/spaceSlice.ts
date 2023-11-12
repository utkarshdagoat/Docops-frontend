import { createSlice  } from "@reduxjs/toolkit";
import { SpaceResponse, spaceApi } from "../../services/space";


const intialState: SpaceResponse[] = []

const spaceSlice = createSlice({
    name:'spaces',
    initialState:intialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addMatcher(spaceApi.endpoints.getFilesForSpaces.matchFulfilled , (state , {payload})=>{
            state=payload
        })
    }

})

export default spaceSlice.reducer