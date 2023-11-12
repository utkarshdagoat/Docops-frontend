import {createApi  , fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { JSONContent } from '@tiptap/react'

export interface fileCreation {
    space:string,
    cover:null,
    heading:string,
    isPrivate:boolean
}

interface headingUpdation  {
    heading:string,
    docId:string
}

interface coverUpdatePayload {
    cover:FormData | undefined,
    docId:string
}

interface metaFileData {
    cover:string | null,
    heading:string | null
}

interface docRetrivalResponse {
    meta : metaFileData,
    doc:Uint8Array
}


interface docUpdateArgs {
    docId:string,
    doc : {
        doc:any
    }
}

interface textUpdate{
    docId:string,
    text:{
        text:string
    }
}


interface serachResponse {
    heading:string,
    docId:string,
    text:string,
    space:string
}

interface permissionReponse {
    edit_permission:boolean,
    comment_permission:boolean
}

interface payloadRequest{
    docId:string
}



export const documentApi  = createApi({
    reducerPath:"docApi",
    baseQuery:fetchBaseQuery({baseUrl:"http://localhost:8000/" , credentials:'include'}),
    endpoints:(builder)=>({
        createDoc:builder.query<any,fileCreation>({
            query:(payload)=>({
                url:"/files/",
                method:'POST',
                body:payload,
                headers:{
                    'Content-Type':'application/json',
                    'Accept':'application/json'
                }
            })
        }),
        updateHeading:builder.query<any , headingUpdation>({
            query:(payload)=>({
                url:`files/heading/${payload.docId}`,
                method:'PUT',
                body:{heading : payload.heading},
                headers:{
                    'Content-Type':'application/json',
                    'Accept':'application/json'
                }
            })
        }),
        updateCover:builder.query<any , coverUpdatePayload>({
            query:(payload)=>({
                url:`files/cover/${payload.docId}`,
                method:'PUT',
                body:payload.cover,
                headers:undefined
            })
        }),
        getDoc:builder.query<docRetrivalResponse , string>({
            query:(payload)=>`/files/get/${payload}`,
            transformResponse:(response:docRetrivalResponse)=>{
               const vals= Object.values(response.doc)
               const doc = Uint8Array.from(vals)
               return {
                ...response,
                doc:doc
               }
            }
        }),
        updateDocCotent:builder.query<void , docUpdateArgs>({
            query:(payload)=>({
                url:`files/doc/${payload.docId}`,
                method:'PUT',
                body:payload.doc,
                headers:{
                    'Content-Type':'application/json'
                }
            }),
        }),
        updateDocTextContent:builder.query<void ,textUpdate >({
            query:(payload)=>({
                url:`files/text/${payload.docId}`,
                method:'PUT',
                body:payload.text,
                headers:{
                    'Content-Type':'application/json'
                }
            })
        }),
        searchQuery:builder.query<serachResponse[] ,string>({
            query:(payload)=>({
                url:`files/search?query=${payload}`,
                method:'GET'
            })
        }),
        getPermissions:builder.query<permissionReponse , string>({
            query:(payload)=>({
                url:`files/perms/${payload}`,
                method:'GET'
            })
        }),
        requestEditPermission:builder.query<void,payloadRequest>({
            query:(payload)=>({
                url:'files/request/',
                body:payload,
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                }
            })
        }),
        removeCover:builder.query<void,string>({
            query:(payload)=>({
                url:`files/cover/${payload}`,
                method:'DELETE'
            })
        })
    })
})

export const { useCreateDocQuery  , useGetDocQuery , useGetPermissionsQuery} = documentApi


