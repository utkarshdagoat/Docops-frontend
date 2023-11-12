import { BubbleMenu as BubbleMenuReact, Editor }  from "@tiptap/react" ;
import {  RefObject, useEffect, useState } from "react";
import {IconLink , IconStrikethrough } from '@tabler/icons-react';
import tippy from 'tippy.js';
import '../tippy/tippy.css'
import 'tippy.js/animations/perspective.css';
export interface BubbleMenuProps {
    editor:Editor;
    containerRef : RefObject<any> ;
}

export type SelectionMenuType = "link" | null


interface SelectionMenuProps {
    editor:Editor;
    selectionType:SelectionMenuType;
    setSelectionType:(type:SelectionMenuType)=>void
}

const SelectionMenu= ({editor , selectionType , setSelectionType}:SelectionMenuProps)=>{
    const [link , setLink] = useState<string>("")
    const IconSize = 16
    const TextColor :string = false ? "text-[--active-menu-color]" : "text-[--nav-font-color]"
    const TextStyle :string = `bg-white px-3 py-2 t hover:bg-[--hover-bg-color] ${TextColor}  hover:cursor-pointer `
    const shadowBox = "shadow-[rgba(0,_0,_0,0.3)_0px_5px_15px] " 
    tippy('.tiptap a', {
        content:link,
        placement:'bottom',
        animation:'perspective',
        theme:'custom',
    })
    switch(selectionType){
        case null:
            return (
                <div className={"flex space-x-0.5 justify-evenly items-center  rounded-md text-l px-2 bg-white " + shadowBox}>
                    <div 
                        onClick={()=>{editor.chain().toggleBold().run()}}
                        className={TextStyle}
                        >B</div>    
                    <button
                        type="button"
                        onClick={() => editor.chain().toggleItalic().run()}
                        className={TextStyle}
                    >I
                    </button>
                    <div
                        onClick={() =>  editor.chain().toggleStrike().run()}
                        className={TextStyle}
                    >
                        <IconStrikethrough size={IconSize} />
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            setSelectionType("link");
                        }}
                        className={TextStyle}
                    >
                        <div className="flex space-x-1 items-center">
                        <div>Link</div>  <IconLink size={IconSize} />
                        </div>
                    </button>
                </div>
            )
        case "link":
            return (
            <div className={"bg-white p-1" + shadowBox }>
                <input
                autoFocus
                type="text"
                className={"bg-[--insert-bg-color] px-1.5 py-1 rounded-md"}
                placeholder="Insert link address"
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                    editor
                        .chain()
                        .focus()
                        .setLink({
                        href: (event.target as HTMLInputElement).value,
                        target: "_blank",
                        })
                        .run();
                    setSelectionType(null);
                    setLink((event.target as HTMLInputElement).value)
                    }
                }}
                onMouseLeave={()=>setSelectionType(null)}
                />
            </div>
            )
    }
}

export const BubbleMenu = ({editor , containerRef}:BubbleMenuProps) =>{
    const [selectionType , setSelectionType] = useState<SelectionMenuType>(null)
    useEffect(()=>{
        if( selectionType !== "link") setSelectionType(null)
    } , [])
    if(!editor || !containerRef) return null

    return (
        <BubbleMenuReact
            editor={editor}
            tippyOptions={{
                appendTo:containerRef.current
            }}
            className="">
                <SelectionMenu
                    editor={editor}
                    selectionType={selectionType}
                    setSelectionType={setSelectionType}
                />
            </BubbleMenuReact>
    )
}