import IMAGES from '../images/Images';
import {useEffect, useState } from 'react';
import { useAppSelector } from '../hooks/redux';
import { Link} from 'react-router-dom';
import axios from 'axios';
import { Button ,useDisclosure,Spinner} from '@nextui-org/react';
import { Bell, BellRing, X } from 'lucide-react';
import { useGetNotificationsDataQuery, userApi } from '../services/user';
import { toast } from 'react-toastify';
import { spaceApi } from '../services/space';

import { Notification } from '../services/user'

import Search from './searchBar';

const Navbar = ({ newNotificaiton }: { newNotificaiton: boolean }) => {
  const Notifications = useGetNotificationsDataQuery()

  const [deleteNotifications, _res] = userApi.endpoints.deletNotification.useLazyQuery();


    const [open, setOpen] = useState<boolean>(false);
    const user = useAppSelector((state) => state.user);
    const src = user.user?.displayPicture ? user.user.displayPicture : IMAGES.Profile;
    const navItemClass: string = 'text-[--nav-font-color] font-sans text-sm px-4 py-2 h-10 hover:cursor-pointer';

    const [NotificationsList, setNotificationsList] = useState<Notification[]>([])


    useEffect(() => {
        if (Notifications.data) setNotificationsList(Notifications.data)
    }, [Notifications])


    const handleLogout = async () => {
        await axios.request({
            method: 'get',
            url: 'http://localhost:8000/auth/logout/',
            withCredentials: true,
        });
      window.location.reload();  
    };
  


  const handleNotificationClick = () => {
        setOpen(!open);
    };

    const handleNotificationDelete = (index: number, id: number) => {
        const notifications = [...NotificationsList]
        notifications.splice(index, 1)
        setNotificationsList(notifications)
        deleteNotifications(id)
    }

    useEffect(() => {
        // @ts-ignore
        if (Notifications.error) toast.error(Notifications.error?.data);
    }, [Notifications.error]);
    const [requestStatus, setRequestStatus] = useState<boolean>(false)
    const [isSelected, setIsSelected] = useState<boolean>(false)


    const [triggerAcceptOrReject, res] = spaceApi.endpoints.acceptOrRejectRequest.useLazyQuery()

           
           

    const handleSubmit = (notif_type: number, index: number) => {
        if (NotificationsList?.[index]) {
            if (notif_type === 0) {
                triggerAcceptOrReject({
                    requestId: NotificationsList?.[index].serialized_object.id,
                    body: {
                        state: requestStatus ? "accepted" : "rejected",
                        permission: isSelected
                    }
                })
            }
        }
    }

    return (
        <div className='flex justify-between py-3 px-2 border-b-2 border-[--border-color]'>
            <div className='flex items-center'>
                <img src={IMAGES.Logo} alt='mySvgImage' width={105} height={28} />
                <div className={navItemClass}>
                    <Link to='/'>Home</Link>
                </div>
                <div className={navItemClass}>
                    <div className='flex align-middle justify-center'>
                        <Link to='/spaces'>Spaces</Link>
                        <img src={IMAGES.carrot} alt='mySvgImage' width={24} height={24} />
                    </div>
                </div>
                <div className={navItemClass}>
                    <div className='flex'>
                        <>Teams</>
                        <img src={IMAGES.carrot} alt='mySvgImage' width={24} height={24} />
                    </div>
                </div>
                <div className={navItemClass}>
                    <>Templates</>
                </div>
            </div>
            <div className='flex justify-evenly space-x-5 items-center'>
            {NotificationsList.length > 0 || newNotificaiton ? (
                    <BellRing size={30} onClick={handleNotificationClick} />
                ) : (
                    <Bell size={30} onClickCapture={handleNotificationClick} />
                )}


                <Search />
                {open &&
                    (Notifications.error ? (
                        <div>Some error Occurred</div>
                    ) : Notifications.isLoading ? (
                        <Spinner color='secondary' />
                    ) : Notifications.data && open ? (
                        <div className='absolute right-20 mt-[6rem] max-w-[350px] bg-white rounded-md shadow-3xl max-h-[300px] overflow-scroll overflow-x-hidden' style={{
                            marginRight: '2.5rem'
                        }}>
                            {NotificationsList.map((notif, index) => (
                                <div className='flex' key={notif.id}>
                                    <div className='flex hover:bg-gray-100 rounded-md px-2 hover:cursor-pointer' key={notif.id} >
                                        <div className='py-2 px-4 text-sm' >
                                            {notif.message}
                                        </div>
                                        <div className='ml-5 flex justify-center items-center' onClick={() => handleNotificationDelete(index, notif.id)} > <X size={18} className=' hover:bg-gray-400 rounded-lg p-0.5' /></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>Nothing to Show</div>
                    ))}
                <img src={src} alt='mySvgImage' width={28} height={28} />
                {user.LoggedIn && <Button color='secondary' onClick={handleLogout}>Logout</Button>}
            </div>
           
        </div>
    );
};

export default Navbar;
