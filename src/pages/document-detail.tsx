import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import TextEditor from "../components/tiptap/Tiptap";


const DocumentDetail: FC = () => {
  const { name, id, isNew } = useParams()

  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false)

  return (
    <div className="flex w-full">
      {name && id &&
        <div className="w-4/5 mx-auto">
          <TextEditor id={id} />
        </div>}
    </div>
  )
};
export default DocumentDetail
