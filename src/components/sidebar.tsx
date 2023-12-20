import { useAppSelector } from "../hooks/redux";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SpaceResponse, useGetFilesForSpacesQuery } from "../services/space";
import { Spinner } from "@nextui-org/react";
import Search from "./searchBar";
import { useGetNotificationsDataQuery } from "../services/user";
import { Notification } from "../services/user";

const SideBar = () => {
  const Notifications = useGetNotificationsDataQuery()
  const { data, error, isLoading } = useGetFilesForSpacesQuery();
  const user = useAppSelector((state) => state.user.user)
  const spaces = useAppSelector((state) => state.space)
  console.log(spaces)
  const colors = [

    'yellow',
    'green',
    'blue',
    'indigo',
    'purple',
    'pink'
  ]

  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (Notifications.data) setNotifications(Notifications.data.slice(0, 5))
  }, [Notifications.data])

  const buttonColor = () => {
    return colors[Math.floor(Math.random() * (colors.length - 1))];
  }
  return (
    <>

      <aside className="flex flex-col  min-w-[300px] max-w-[400px] h-screen px-5 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
        <div className="flex flex-col  flex-1 mt-6">
          <div className="text-base w-full"><p className="font-bold">{user?.username}'s </p>Documents</div>
          <div className="mt-6">
            <Search />

            <nav className="mt-4 -mx-3 space-y-3 ">
              {Notifications.error ? (
                <>Some Error Occured</>
              ) : Notifications.isLoading ? (
                <Spinner />
              ) : Notifications.data ? (

                notifications.map((notif) => (
                  <button className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700">
                    <div className="flex items-center gap-x-2 ">
                      <span className={"w-2 h-2 bg-" + buttonColor() + "-500 rounded-full"}></span>
                      <span>{notif.message}</span>
                    </div>
                  </button>
                ))
              ) : null}
            </nav>

            <div className="flex items-center justify-between mt-6">
              <h2 className="text-base font-semibold text-gray-800 dark:text-white"><Link to='/'>Spaces</Link></h2>
              <button className="p-0.5 hover:bg-gray-100 duration-200 transition-colors text-gray-500 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 border rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            </div>

            <nav className="mt-4 -mx-3 space-y-3 ">
              {error ? (
                <>Some Error Occured</>
              ) : isLoading ? (
                <Spinner />
              ) : data ? (

                data.map((space: SpaceResponse) => (
                  <button className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700">
                    <div className="flex items-center gap-x-2 ">
                      <span className={"w-2 h-2 bg-" + buttonColor() + "-500 rounded-full"}></span>
                      <span>{space.name}</span>
                    </div>
                  </button>
                ))
              ) : null}
            </nav>
          </div>
        </div>
      </aside >

    </>
  )

}


export default SideBar;
