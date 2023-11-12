import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import TextEditor from "../components/tiptap/Tiptap";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import SideBar from "../components/sidebar";
import { updateName } from "../features/user/spaceSlice";

const DocumentDetail: FC = () => {
    const { name, id, isNew } = useParams()

    const [sideBarOpen , setSideBarOpen] = useState<boolean>(false)

    return (
        <div className="flex w-full">
            {id &&
                <div className= {sideBarOpen ? "w-1/5" : "w-max"}>
                    <SideBar docId={id}  sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen}/>
                </div>
            }
            {name && id &&
                <div className="w-4/5 mx-auto">
                    <TextEditor id={id}/>
                </div>}
        </div>
)};
export default DocumentDetail