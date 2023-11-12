import { userState } from "../features/user/userSlice"
import Review from './ReviewRequestModal'
export interface Request{
    from_user:userState,
    reciepent:userState,
    id:number,
    notif_type:number,
    unread:boolean
}

export interface notificationData{
    message:string,
    serialized_object:Request
}


interface notificationProps {
    setVisibilty:(arg :boolean)=>void,
    notification:notificationData
}



const NotificationToast = ({setVisibilty , notification}:notificationProps) => {
    return (
        <div className="fixed inset-x-0 top-10 pb-2 sm:pb-5 z-50">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="rounded-lg bg-purple-600 p-2 shadow-lg sm:p-3">
                    <div className="flex flex-wrap items-center justify-between">
                        <div className="flex w-0 flex-1 items-center">
                            <span className="flex rounded-lg bg-purple-800 p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" className="h-6 w-6 text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
                            </span>
                            <p className="ml-3 truncate font-medium text-white">
                                <span className="md:inline">{notification.message}</span>
                            </p>
                        </div>
                        <div className="order-3 mt-2 flex w-full space-x-3 flex-shrink-0 sm:order-2 sm:mt-0 sm:w-auto">
                           <Review request={notification.serialized_object} />
                        </div>
                        <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
                            <button type="button" className="-mr-1 flex rounded-md p-2 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-white" onClick={()=>setVisibilty(false)}><span className="sr-only">Dismiss</span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-6 w-6 text-white"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default NotificationToast