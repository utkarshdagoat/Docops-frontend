import {createApi  , fetchBaseQuery} from '@reduxjs/toolkit/query/react'



export interface SpaceInput{
    name:string,
    description:string
}

export const privateSpaceApi = createApi({
    reducerPath:"spaceApi",
    baseQuery:fetchBaseQuery({baseUrl:"http://localhost:8000/" , credentials:'include'}),
    endpoints:(builder)=>({ 
        createPrivateSpace:builder.query<void,SpaceInput>({
            query:(payload)=>({
                url:"spaces/private/",
                method:'POST',
                body:payload,
                headers:{
                    "Content-Type":"application/json; charset=UTF-8"
                }
            })
        })
    })
})


export const { useCreatePrivateSpaceQuery } = privateSpaceApi