import {FetchBaseQueryError, createApi  , fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { userState } from '../features/user/userSlice'


export interface SpaceFiles {
    heading:string | null,
    docId:string
}

export interface SpaceResponse{
    name:string,
    description:string,
    users:userState[],
    isPrivate:boolean,
    creater:userState,
    invite_code:string,
    files:SpaceFiles[] | null 
}

export interface SpaceInput{
    name:string,
    description:string
}

interface requestSpaceArgs{
    invite_code:string
}

export interface SpaceUsersFromApi {
    name:string,
    users:userState[],
    creater:userState
}

export type spaceStateResponse = "accepted" | "rejected"

interface spaceRequestResponseArgs{
    state:spaceStateResponse,
    permission:boolean
}
interface spaceJoinResponsePayload{
    body:spaceRequestResponseArgs,
    requestId:number
}


export const spaceApi = createApi({
    reducerPath:"spaceApi",
    baseQuery:fetchBaseQuery({baseUrl:"http://localhost:8000/" , credentials:'include'}),
    endpoints:(builder)=>({
        getSpace:builder.query<SpaceResponse[],void>({
            query:()=>"auth/user/spaces/"
        }),
        createPublicSpace:builder.query<void,SpaceInput>({
            query:(payload)=>({
                url:"spaces/public/",
                method:'POST',
                body:payload,
                headers:{
                    "Content-Type":"application/json; charset=UTF-8"
                }
            })
        }),
        getFilesForSpaces:builder.query<SpaceResponse[],void>({
           query:(payload)=>({
            url:'auth/user/spaces'
           })
          }),
        requestSpaceJoin:builder.query<void , requestSpaceArgs>({
            query:(payload)=>({
                url:'spaces/request/',
                method:'POST',
                body:payload,
                headers:{
                    "Content-Type":"application/json; charset=UTF-8"
                }
            })
        }),
        acceptOrRejectRequest:builder.query<void,spaceJoinResponsePayload>({
            query:(payload)=>({
                url:`/spaces/requested/${payload.requestId}/`,
                method:'PUT',
                body:payload.body
            })
        }),
        getUserForSpaces:builder.query<SpaceUsersFromApi , string>({
            query:(payload)=>({
                url:`/spaces/users/${payload}`,
                method:'GET'
            })
        }) 
    })
})


export const {useGetSpaceQuery  , useCreatePublicSpaceQuery , useGetFilesForSpacesQuery , useGetUserForSpacesQuery} = spaceApi