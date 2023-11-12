import {createApi  , fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { userAuthState } from '../features/user/userSlice'

import { Request } from '../components/notificationToast'

export interface Notification{
    message:string,
    serialized_object:Request,
    unread:boolean,
    notif_type:number,
    id:number
}


export const userApi  = createApi({
    reducerPath:"userApi",
    baseQuery:fetchBaseQuery({baseUrl:"http://localhost:8000" , credentials:'include'}),
    endpoints:(builder)=>({
        getUserData:builder.query<userAuthState , void>({
            query:()=>`/auth/user/check_login`
        }),
        redirectLogin:builder.query<void , void>({
            query:()=>'/auth/token'
        }),
        getNotificationsData:builder.query<Notification[], void>({
            query:()=>'/notifications/list/'
        }),
        deletNotification:builder.query<void , number>({
            query:(payload)=>({
                url:`/notifications/delete/${payload}`,
                method:'DELETE'
            })
        })
    })
})

export const { useGetUserDataQuery  , useRedirectLoginQuery , useGetNotificationsDataQuery } = userApi

