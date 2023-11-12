import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "./extensions/bubbleMenu";
import React, { useCallback, useEffect, useRef, useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import CommandsPlugin from "./extensions/slashCommand";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { HocuspocusProvider } from '@hocuspocus/provider'
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import { createLowlight, common } from "lowlight";
import { mentionSuggestionOptions } from "./extensions/mentionSuggestionOptions";

const lowlight = createLowlight(common)
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)

import { CameraIcon, CopySlash, X } from 'lucide-react'
import { documentApi, fileCreation, useGetDocQuery, useGetPermissionsQuery } from "../../services/file";

import * as Y from 'yjs';
import tippy from 'tippy.js';

import useDebounce from "../../hooks/debounce";
import useThrottle from "../../hooks/throttle";
import { Button, Spinner } from "@nextui-org/react";
import { useAppSelector } from "../../hooks/redux";
import { toast } from "react-toastify";
import Mention from "@tiptap/extension-mention";

function getRandomColor() {
    const colors = [
        "#FFFFE0",
        "#FFB6C1",
        "#FFD700",
        "#E0FFFF",
        "#98FB98",
        "#FFA07A",
        "#DDA0DD",
        "#B0E0E6",
        "#FFE4B5",
        "#7FFFD4",
        "#F0E68C",
        "#AFEEEE",
        "#FFE4E1",
        "#00FA9A",
        "#FFDEAD",
        "#87CEFA"
    ]
    return colors[Math.floor(Math.random() * colors.length)]
}



const TextEditor = ({  id  }: {  id: string }) => {

    const userPermission = useGetPermissionsQuery(id)
    console.log(userPermission.data)
    const username = useAppSelector((state) => state.user.user?.username)

    const editorRef = useRef<Editor | null>(null)
    const providerRef = useRef<HocuspocusProvider | null>(null)
    const [cover, setCover] = useState<File | undefined>()
    const [coverURL, setCoverURL] = useState<string>()
    const [heading, setHeading] = useState<string>("Untitled")
    const [removed, setRemoved] = useState<boolean>(false)

    const { data, error, isLoading } = useGetDocQuery(id)

    const [canEdit , setCanEdit] = useState<boolean>(false)
    const [canComment , setCanComment] = useState<boolean>(false)

    const [showBanner , setShowBanner] = useState<boolean>(true)

    const [triggerHeadingUpdate, resFromHeadingUpdate] = documentApi.endpoints.updateHeading.useLazyQuery()
    const [triggerCoverUpdate, resFromCoverUpdate] = documentApi.endpoints.updateCover.useLazyQuery()
    const [triggerDocumentUpdate, res] = documentApi.endpoints.updateDocCotent.useLazyQuery()
    const [triggerTextUpdate , resFromTextUpdate] = documentApi.endpoints.updateDocTextContent.useLazyQuery()

    useEffect(() => {
        if (cover) {
            setCoverURL(URL.createObjectURL(cover))
        }
    }, [cover])

    useEffect(()=>{
        if(userPermission.data?.edit_permission) setCanEdit(userPermission.data?.edit_permission)
    } , [userPermission.data])

    useEffect(() => {
        const heading = data?.meta?.heading ? data?.meta?.heading : ""
        setHeading(heading)
        const coverURL = data?.meta?.cover ? data.meta.cover : ""
        setCoverURL(coverURL)
    }, [data])

    useEffect(() => {

        const provider = new HocuspocusProvider({
            url: 'ws://localhost:1234/',
            name: 'example-document',
        })

        providerRef.current = provider


        if(!error){
        const editor = new Editor({
            extensions: [
                StarterKit.configure({
                    history: false
                }),
                Link,
                CommandsPlugin,
                CodeBlockLowlight.configure({
                    lowlight: lowlight
                }),
                Collaboration.configure({
                    document: provider.document,
                }),
                CollaborationCursor.configure({
                    provider: provider,
                    user: { name: username, color: getRandomColor() },
                }),
                Mention.configure({
                    suggestion:mentionSuggestionOptions,
                    HTMLAttributes: {
                        class: 'bg-orange-200 rounded-lg px-1',
                    },
                    
                })
            ],
            onUpdate: ({ editor }) => {
                throttledDocContent();
                throttleTextContent()
            }, 
            onCreate: ({ editor }) => {
                if (data) {
                    Y.applyUpdateV2(provider.document, data?.doc)
                }
            },
            editable: userPermission.data?.edit_permission ? true : false 
        })

        editorRef.current = editor
        }
        return () => {
            provider.destroy()
        }
    }, [data , userPermission.data])

    useEffect(()=>{
        console.log(error)
        ///@ts-ignore
        if(error) toast.error(error.data)
    } , [error])


    useEffect(() => {
        if (data?.doc)
            editorRef.current?.commands.setContent(data.doc)
    }, [data])


    const headingCLass = "px-1 min-w-4/5 max-w-4/5 mx-auto focus-visible:outline-none text-5xl font-bold font-sans " + ((cover || data?.meta.cover) ? "mt-10" : "mt-[120px]")
    const handleClick = (e: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
        if (cover) {
            e.preventDefault()
            setCover(undefined)
        }
    }

    //tippy
    const containerRef = useRef<HTMLDivElement>(null)
    const throttledDocContent = useThrottle(() => {
        if (providerRef.current) {
            triggerDocumentUpdate({
                docId: id,
                doc: {
                    doc: Y.encodeStateAsUpdateV2(providerRef.current.document)
                }
            })
        }
    }, 1500)

    const debouncedHeadingUpdate = useDebounce(() => {
        triggerHeadingUpdate({
            heading: heading,
            docId: id
        })
    }, 500)

    const throttleTextContent = useThrottle(()=>{
        if(editorRef.current){
            triggerTextUpdate({
                docId:id,
                text:{
                    text:editorRef.current.getText()
                }
            })
        }
    } , 1500)

    useEffect(() => {
        const formdata = new FormData()
        if (cover) {
            formdata.append("cover", cover)
            triggerCoverUpdate({
                docId: id,
                cover: formdata
            })
            console.log(formdata)
        }
    }, [cover, coverURL])


    const onHeadingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const heading = e.target.value
        setHeading(heading)
        debouncedHeadingUpdate()
    }

    const [removeCoverTrigger , __res] = documentApi.endpoints.removeCover.useLazyQuery()

    const removeCover = () => {
        removeCoverTrigger(id)
        setCover(undefined)
        setCoverURL('')
        setRemoved(true)
    }

    useEffect(()=>{} , [removed])

    const [triggerRequest , resFromRequestCreation] = documentApi.endpoints.requestEditPermission.useLazyQuery()

    const handleRequestAdd = ()=>{
        triggerRequest({
            docId:id
        })
        setShowBanner(false)
    }


    return (
        <div className="w-full">
            {error ? (
                <>Some error Occurred</>
            ) : isLoading ? (
                <Spinner />
            ) : (
                <>
                    {data?.meta.cover ? (
                        <img src={'http://localhost:8000' + data?.meta.cover} className="h-[250px] w-full object-cover" />
                    ) : (coverURL !== "" ? (
                        <img src={coverURL} className="h-[250px] w-full object-cover" />
                    ) : (
                        null
                    ))}
                    {!canEdit && showBanner &&
                      <div id="marketing-banner" tabIndex={-1} className="fixed z-50 flex flex-col md:flex-row justify-between w-[calc(100%-2rem)] p-4 -translate-x-1/2 bg-white border border-gray-100 rounded-lg shadow-sm lg:max-w-7xl left-1/2 top-6 dark:bg-gray-700 dark:border-gray-600">
                      <div className="flex flex-col items-start mb-3 mr-4 md:items-center md:flex-row md:mb-0">
                          
                          <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">You cannot Edit the document ask for permission</p>
                      </div>
                      <div className="flex items-center flex-shrink-0">
                          <a href="#" className="px-5 py-2 mr-2 text-xs font-medium text-white bg-purple-700 rounded-lg hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none dark:focus:ring-purple-800" onClick={handleRequestAdd}>Request</a>
                          
                          
                          
                          <button data-dismiss-target="#marketing-banner" type="button" className="flex-shrink-0 inline-flex justify-center w-7 h-7 items-center text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 dark:hover:bg-gray-600 dark:hover:text-white"
                          onClick={()=>setShowBanner(false)}
                          
                          >
                              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                              </svg>
                              <span className="sr-only">Close banner</span>
                          </button>
                      </div>
                  </div>
                    }
                    {
                        
                    }
                    <div className={headingCLass}>
                        <input className="focus-visible:outline-none" onChange={onHeadingChange} value={heading} disabled={!canEdit}/>
                    </div>
                    <div className={cover || data?.meta?.cover ? "mx-auto max-w-4/5 mt-2" : "mx-auto max-w-4/5 mt-2"}>
                        <input type="file" className="hidden" onChange={(e) => setCover(e.target.files?.[0])} id="cover" disabled={!canEdit}/>
                        {cover || data?.meta?.cover ? (
                            <div className="p-2 rounded-md flex text-[--border-color] hover:text-zinc-700 hover:bg-zinc-300 hover:cursor-pointer w-min space-x-1" onClick={removeCover}>
                                <X className="mr-2 h-4.5 w-4.5" />
                                <div className="w-max">Remove Cover</div>
                            </div>
                        ) : (
                            <>
                                <label htmlFor="cover" className="p-2 rounded-md flex text-[--border-color] hover:text-zinc-700 hover:bg-zinc-300 hover:cursor-pointer w-min space-x-1" onClick={handleClick}>
                                    <CameraIcon className="mr-2 h-4.5 w-4.5" />
                                    <div className="w-max">Add Cover</div>
                                </label>
                            </>
                        )}
                    </div>
                    <div ref={containerRef} className="max-w-4/5 mx-auto mt-2">
                        {editorRef.current && <BubbleMenu containerRef={containerRef} editor={editorRef.current} />}
                        <EditorContent editor={editorRef.current} />
                    </div>
                </>
            )}
        </div>
    );
}

export default TextEditor