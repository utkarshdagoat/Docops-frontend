import type { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import type { MentionSuggestion } from "./mentionSuggestionOptions";

export type SuggestionListRef = {
  // For convenience using this SuggestionList from within the
  // mentionSuggestionOptions, we'll match the signature of SuggestionOptions's
  // `onKeyDown` returned in its `render` function
  onKeyDown: NonNullable<
    ReturnType<
      NonNullable<SuggestionOptions<MentionSuggestion>["render"]>
    >["onKeyDown"]
  >;
};

// This type is based on
// https://github.com/ueberdosis/tiptap/blob/a27c35ac8f1afc9d51f235271814702bc72f1e01/packages/extension-mention/src/mention.ts#L73-L103.
// TODO(Steven DeMartini): Use the Tiptap exported MentionNodeAttrs interface
// once https://github.com/ueberdosis/tiptap/pull/4136 is merged.

interface MentionNodeAttrs {
    id: string | null;
    label?: string | null;
  }
  

export type SuggestionListProps = SuggestionProps<MentionSuggestion>;

const SuggestionList = forwardRef<SuggestionListRef, SuggestionListProps>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
      if (index >= props.items.length) {
        return;
      }

      const suggestion = props.items[index];
      const mentionItem: MentionNodeAttrs = {
       label: suggestion.username,
        id:suggestion.year.toString()
      };
      // @ts-expect-error there is currently a bug in the Tiptap SuggestionProps
      // type where if you specify the suggestion type (like
      // `SuggestionProps<MentionSuggestion>`), it will incorrectly require that
      // type variable for `command`'s argument as well (whereas instead the
      // type of that argument should be the Mention Node attributes). This
      // should be fixed once https://github.com/ueberdosis/tiptap/pull/4136 is
      // merged and we can add a separate type arg to `SuggestionProps` to
      // specify the type of the commanded selected item.
      props.command(mentionItem);
    };

    const upHandler = () => {
      setSelectedIndex(
        (selectedIndex + props.items.length - 1) % props.items.length
      );
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === "ArrowUp") {
          upHandler();
          return true;
        }

        if (event.key === "ArrowDown") {
          downHandler();
          return true;
        }

        if (event.key === "Enter") {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

     const bgColor = (index:number)=>(index === selectedIndex) ? "bg-slash-hover" : "";

    return props.items.length > 0 ? (
        <div 
        className="flex flex-col rounded-md bg-white max-w-md min-w-[200px] shadow-3xl items-center max-h-[225px] overflow-scroll focus:outline-none " 
        id="popup"
      >
        <p className="text-xs font-light text-[--light-text] px-1.5 py-2 border-b rounded-tl-md rounded-tr-md w-full">Availaible Mentions</p>
        {props.items.map((item , index: number)=>{
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
              <div className="flex flex-col justify-start py-2">
                <p className="text-sm text-black text-start">{item.username}</p>
                <p className="text-xs text-black font-light text-start">Year-{item.year}</p>
              </div>
            </button>
          )
        })}
      </div>
    ) : null;
  }
);

SuggestionList.displayName = "SuggestionList";

export default SuggestionList;