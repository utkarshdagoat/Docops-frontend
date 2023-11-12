import { createSlice , PayloadAction } from "@reduxjs/toolkit";
import { userApi } from "../../services/user";


export interface userState {
    username:string,
    year:number,
    displayPicture:string | null,
    email:string
}

export  interface userAuthState {
    LoggedIn : boolean
    user:userState | null;
}


const intialState : userAuthState = {
    LoggedIn:false,
    user:null
}

const userAuthSlice = createSlice({
    name:'user',
    initialState:intialState,
    reducers:{},
    extraReducers(builder) {
        builder.addMatcher(userApi.endpoints.getUserData.matchFulfilled, (state , {payload})=>{
            state.user = payload.user
            state.LoggedIn = payload.LoggedIn
        })
    },
})

export default userAuthSlice.reducer;