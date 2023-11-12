import { useState } from "react";
import { useGetFilesForSpacesQuery } from "../services/space";
import { Spinner } from "@nextui-org/react";
import { ChevronDown, ChevronRight, Cross, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";


interface SideBarProps {
    docId: string;
    sideBarOpen: boolean;
    setSideBarOpen: (val: boolean) => void;
}

const SideBar = ({ docId, sideBarOpen, setSideBarOpen }: SideBarProps) => {
    const navigate = useNavigate();
    const { data, isLoading, error } = useGetFilesForSpacesQuery();
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div className="flex flex-col w-full h-full">
            {error ? (
                <>some Error occurred</>
            ) : isLoading ? (
                <Spinner />
            ) : sideBarOpen ? (

                <div className="w-full h-full py-3 px-2 overflow-y-auto rounded transition-transform bg-gray-50 dark:bg-gray-800">
                    <div className="w-full flex justify-end">
                        <X
                            className="hover:bg-gray-300 p-0.5 rounded-lg transition-all"
                            onClick={() => setSideBarOpen(false)}
                            size={24}
                        />
                    </div>
                    <div className="font-bold text-lg">Public</div>
                    {data?.map((space) => (
                        <div key={space.invite_code}>
                            <ul>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                                        onClick={(e) => setOpen(!open)}
                                    >
                                        <div className="transition-all">
                                            {open ? (
                                                <ChevronDown className="hover:bg-gray-300 rounded-lg transition-all" />
                                            ) : (
                                                <ChevronRight className="hover:bg-gray-300 rounded-lg transition-all" />
                                            )}
                                        </div>
                                        <span className="ml-2">{space.name}</span>
                                    </a>
                                    {open &&
                                        space.files?.map((file) => (
                                            <div
                                                key={file.docId}
                                                className="flex items-center px-3 py-1 font-light text-gray-900 rounded-lg group hover:bg-gray-100 transition-all dark:text-white dark:hover:bg-gray-700 ml-11 mr-3 text-sm hover:cursor-pointer"
                                                onClick={(e) =>
                                                    navigate(`/space/${space.name}/document/${file.docId}`)
                                                }
                                            >
                                                <div className={docId === file.docId ? "font-bold" : "font-light"}>
                                                    {file.heading}
                                                </div>
                                            </div>
                                        ))}
                                </li>
                            </ul>
                        </div>
                    ))}
                </div>
            ) : (<div className="mt-3 ml-3">
                <Menu
                    className="hover:bg-gray-300 p-0.5 rounded-lg transition-all"
                    onClick={() => setSideBarOpen(true)}
                />
            </div>
            )}
        </div>
    );
};

export default SideBar;
