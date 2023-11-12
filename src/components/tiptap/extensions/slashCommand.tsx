import { Extension , Editor , Range, ReactRenderer } from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";
import {
    IconCode,
    IconBlockquote
} from '@tabler/icons-react'
import tippy from "tippy.js";
import { useEffect, useState , useRef } from "react";
import IMAGES from "../../../images/Images";

interface CommandItemProps {
  title:string,
  description : string,
  icon:JSX.Element,
  command:Function
}

interface CommandProps {
  editor: Editor;
  range: Range;
}


const ICON_SIZE = 46

const CommandsPlugin = Extension.create({
    name:"slashCommand",
    addProseMirrorPlugins(){
        return[
            Suggestion({
                editor:this.editor,
                char:"/",
                command:({editor , range , props })=>{
                    props.command({editor , range,props})
                },
                items:({query})=>{
                    return [ 
                        {
                          title: "Text",
                          description: "Just start typing with plain text.",
                          searchTerms: ["p", "paragraph"],
                          icon: <img src= {IMAGES.text} alt='mySvgImage' width={ICON_SIZE} height={ICON_SIZE}/>,
                          command: ({ editor, range }: CommandProps) => {
                            editor
                              .chain()
                              .focus()
                              .deleteRange(range)
                              .toggleNode("paragraph", "paragraph")
                              .run();
                          },
                        },
                        {
                          title: "Heading 1",
                          description: "Big section heading.",
                          searchTerms: ["title", "big", "large"],
                          icon: <img src={IMAGES.h1} alt='mySvgImage' width={ICON_SIZE} height={ICON_SIZE}/>,
                          command: ({ editor, range }: CommandProps) => {
                            editor
                              .chain()
                              .focus()
                              .deleteRange(range)
                              .setNode("heading", { level: 1 })
                              .run();
                          },
                        },
                        {
                          title: "Heading 2",
                          description: "Medium section heading.",
                          searchTerms: ["subtitle", "medium"],
                          icon:<img src={IMAGES.h2} alt='mysvgimage' width={ICON_SIZE} height={ICON_SIZE}/>,
            
                          command: ({ editor, range }: CommandProps) => {
                            editor
                              .chain()
                              .focus()
                              .deleteRange(range)
                              .setNode("heading", { level: 2 })
                              .run();
                          },
                        },
                        {
                          title: "Heading 3",
                          description: "Small section heading.",
                          searchTerms: ["subtitle", "small"],
                          icon: <img src={IMAGES.h3} alt='mysvgimage' width={ICON_SIZE} height={ICON_SIZE}/>,
            

                          command: ({ editor, range }: CommandProps) => {
                            editor
                              .chain()
                              .focus()
                              .deleteRange(range)
                              .setNode("heading", { level: 3 })
                              .run();
                          },
                        },
                        {
                          title: "Bullet List",
                          description: "Create a simple bullet list.",
                          searchTerms: ["unordered", "point"],
                          icon: <img src={IMAGES.ordered} alt='mysvgimage' width={ICON_SIZE} height={ICON_SIZE}/>,
                          command: ({ editor, range }: CommandProps) => {
                            editor.chain().focus().deleteRange(range).toggleBulletList().run();
                          },
                        },
                        {
                          title: "Numbered List",
                          description: "Create a list with numbering.",
                          searchTerms: ["ordered"],
                          icon: <img src={IMAGES.numbered} alt='mysvgimage' width={ICON_SIZE} height={ICON_SIZE}/>,                          command: ({ editor, range }: CommandProps) => {
                            editor.chain().focus().deleteRange(range).toggleOrderedList().run();
                          },
                        },
                        {
                          title: "Quote",
                          description: "Capture a quote.",
                          searchTerms: ["blockquote"],
                          icon: <div className="rounded-md border"><IconBlockquote size={ICON_SIZE} /></div>,
                          command: ({ editor, range }: CommandProps) =>
                            editor
                              .chain()
                              .focus()
                              .deleteRange(range)
                              .toggleNode("paragraph", "paragraph")
                              .toggleBlockquote()
                              .run(),
                        },
                        {
                          title: "Code",
                          description: "Capture a code snippet.",
                          searchTerms: ["codeblock"],
                          icon:<div className="rounded-md border"><IconCode size={ICON_SIZE} /></div>,
                          command: ({ editor, range }: CommandProps) =>
                            editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
                        },
                      ].filter((item) => {
                        if (typeof query === "string" && query.length > 0) {
                          const search = query.toLowerCase();
                          return (
                            item.title.toLowerCase().includes(search) ||
                            item.description.toLowerCase().includes(search) ||
                            (item.searchTerms &&
                              item.searchTerms.some((term: string) => term.includes(search)))
                          );
                        }
                        return true;
                      }); 
                },
                startOfLine:true,
                render:()=>{
                  let component:any
                  let popup : any
                  return{
                    onStart:(props)=>{
                       component = new ReactRenderer(OptionList,{
                        props,
                        editor:props.editor
                       })
                       ///@ts-ignore
                        popup=tippy("body",{
                        getReferenceClientRect:props.clientRect,
                        content: component.element,
                        showOnCreate: true,
                        interactive: true,
                        trigger: "manual",
                        placement: "bottom-start",
                       })
                    },
                    onUpdate: (props) => {
                      component?.updateProps(props);

                      popup &&
                        popup[0].setProps({
                          getReferenceClientRect: props.clientRect,
                        });
                    },

                    onKeyDown:(props)=>{
                      return component.ref?.onKeyDown(props)
                    },
                    onExit: () => {
                      component.destroy();
                      popup[0].destroy()
                    },
                  }
                }
            }),
        ]
        },
        addKeyboardShortcuts(){
          return {
            Enter : ()=>{
              if(document.querySelector("#popup")){
                return true
              } 
              return false
            }
          }
        }
      })

const OptionList  = ({items , command}:{items:CommandItemProps[] , command:any} )=>{
  const divRef = useRef<HTMLDivElement>(null)
  const [selectedIndex , setSelectedIndex] = useState<number>(0)
    
  
  
  
  function setChange() : void {
  if(!divRef.current) return
  const selected =divRef.current.querySelector("#active")
  if(selected){
    selected?.scrollIntoView({
      behavior:"smooth",
      block:"start"
    })
  }}
  const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];



  const onKeyDown  = (event : KeyboardEvent)=>{
    if(navigationKeys.includes(event.key)){
      event.preventDefault()
      if(event.key === "ArrowUp"){
        const index = (selectedIndex - 1 + items.length)%items.length 
        setSelectedIndex(index)
        return true
      }
      if(event.key === "ArrowDown"){
        const index = (selectedIndex +1 + items.length)%items.length  
        setSelectedIndex(index)
        return true
      }
      if(event.key ==="Enter"){
        selectItem(selectedIndex)
        return true
      }
      return false     
    }
  }
  
  useEffect(()=>{
    setChange()
    document.addEventListener("keydown" , onKeyDown)
    return ()=>{
      document.removeEventListener("keydown", onKeyDown)
    }
  } , [items, selectedIndex, setSelectedIndex ])
  
  
  const selectItem = (index:number)=>{
    const item = items?.[index]
    if(item){
      command(item)
    }
  }
  
  const bgColor = (index:number)=>(index === selectedIndex) ? "bg-slash-hover" : "";
  
  return items.length > 0 ? (
    <div 
      className="flex flex-col rounded-md bg-white max-w-md min-w-max shadow-3xl items-center max-h-[225px] overflow-scroll focus:outline-none " 
      id="popup"
      ref={divRef}
    >
      <p className="text-xs font-light text-[--light-text] px-1.5 py-2 border-b rounded-tl-md rounded-tr-md w-full">Basic Blocks</p>
      {items.map((item : CommandItemProps, index: number)=>{
        return (
          <button 
            key={index} 
            className={`flex items-center px-2 py-1 min-w-full space-x-3 ${bgColor(index)} hover:bg-slash-hover`}
            onClick={()=>selectItem(index)}
            id={(index === selectedIndex) ? "active" : ""}
            onKeyDown = {(event) => {
              if(event.key == "Enter"){
                selectItem(index)
              }
            }}
          >
            <div>{item.icon}</div>
            <div className="flex flex-col justify-start py-2">
              <p className="text-sm text-black text-start">{item.title}</p>
              <p className="text-xs text-[--light-sub-text]">{item.description}</p>
            </div>
          </button>
        )
      })}
    </div>
  ): <div></div>
}

export default CommandsPlugin