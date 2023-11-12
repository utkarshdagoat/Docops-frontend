import { throttle } from "lodash";
import { useEffect, useMemo, useRef } from "react";


const useThrottle = (callback : Function , time:number) =>{
    const ref = useRef<Function | null>(null)
    useEffect(()=>{
        ref.current = callback
    }, [callback])

    const throttledCallback = useMemo(()=>{
        const func = ()=>{
            ref.current?.()    
        }

        return throttle(func , time)
    } , [])

    return throttledCallback
}


export default useThrottle
