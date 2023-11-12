import { FC} from "react";
import IMAGES from "../images/Images";
import { useAppSelector } from "../hooks/redux";

const Login : FC = ()=>{
    const LoggedIn = useAppSelector((state)=>state.user.LoggedIn)

    const handleLogin = ()=>{
        window.location.replace("http://localhost:8000/auth/token")
    }

    return (
        
        <div className="flex justify-center items-center mt-20 ">
            {!LoggedIn &&  
            <div className="rounded-md flex shadow-3xl py-10">
                <div className="flex flex-col justify-center items-center">
                    <img src={IMAGES.img} width={64} height={64} />
                    <div className="flex flex-col items-start p-2 m-5">
                    <div className="text-2xl font-bold  text-black">Welcome Back Maintainer</div>
                    <div className="text-sm font-thin text-[--nav-font-color]">Verify it's You</div>
                    </div>
                    <button type="button" className="text-white bg-[#417cfa] hover:bg-[#402cff]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2 space-x-1" onClick={handleLogin}>
                        <img src={IMAGES.channeli} width={24} height={24} />
                        Sign in with Channeli
                    </button>
                </div>
            </div>}
        </div>
    )
}

export default Login