import { useGetUserDataQuery, userApi } from "./services/user"
import { Route, Routes } from "react-router-dom"
import Home from "./pages/home"
import Login from "./pages/Login"
import Navbar from "./components/Navbar"
import './App.css'
import { useAppSelector } from "./hooks/redux"
import { useEffect } from "react"
import Space from "./pages/spaces"
import DocumentDetail from "./pages/document-detail"
import { useState } from "react"
import useWebSocket, { ReadyState } from "react-use-websocket"
import NotificationToast , {notificationData} from "./components/notificationToast"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {


  const user = useAppSelector((state) => state.user)
  const [trigger, { data, error, isLoading }] = userApi.endpoints.getUserData.useLazyQuery()

  const [newNotificaiton , setNewNotification] = useState<boolean>(false)

  useEffect(() => {
    if (!user.LoggedIn) {
      trigger()
    }
  }, [])

  //notification
  const [showNotification , setShowNotification] = useState<boolean>(false)
  const [notification , setNotification] = useState<notificationData | null>(null)
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    'ws://localhost:8000/notifs/',
    {
      share: false,
      shouldReconnect: () => true,
    },
  )
  useEffect(() => {
    console.log("Connection state changed")
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        event: "subscribe",
        data: {
          user: user.user?.email,
        },
      })
    }
  }, [readyState])
  
  useEffect(() => {
    setShowNotification(true)
    setTimeout(()=>{
      setShowNotification(false)
    } , 10000)
    const notificationFromjsonMessage = JSON.parse(String(lastJsonMessage)) as notificationData
    setNotification(notificationFromjsonMessage)
    if(notificationFromjsonMessage) setNewNotification(true)
    console.log(notificationFromjsonMessage)
  }, [lastJsonMessage])


  return (
    <div className="App">
      {error ? (
        <>Oh no, there was an error</>
      ) : isLoading ? (
        <>Loading...</>
      ) : data?.LoggedIn ? (
        <>
          <ToastContainer />
          <Navbar newNotificaiton={newNotificaiton}/>
          { showNotification && notification &&
            <NotificationToast setVisibilty={setShowNotification} notification={notification}/>
          }
          <Routes>
            <Route path="/" index element={<Home />} />
            <Route path="space/:name/document/:id/:isNew?" element={<DocumentDetail />} />
            <Route path="spaces" element={<Space />} />
          </Routes>
        </>
      ) : <Login />}
    </div>
  )
}

export default App
