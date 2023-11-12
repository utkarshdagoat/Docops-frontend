import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query'
import { userApi } from "../services/user";
import userAuth from "../features/user/userSlice"
import {spaceApi} from '../services/space'
import { privateSpaceApi } from "../services/private-space";
import { documentApi } from "../services/file";
import spaceSlice from "../features/space/spaceSlice";
import spaceNameSlice from '../features/user/spaceSlice'

export const store = configureStore({
    reducer:{
        [userApi.reducerPath] : userApi.reducer,
        user:userAuth,
        [spaceApi.reducerPath]: spaceApi.reducer,
        [privateSpaceApi.reducerPath] : spaceApi.reducer,
        [documentApi.reducerPath]:documentApi.reducer,
        space:spaceSlice,
        spaceName:spaceNameSlice
    },
    ///@ts-ignore
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware({
            serializableCheck:false
        }).concat([userApi.middleware , spaceApi.middleware , privateSpaceApi.middleware , documentApi.middleware])
})

setupListeners(store.dispatch)


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>


