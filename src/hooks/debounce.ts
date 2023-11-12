import { debounce } from "lodash";
import { useEffect, useMemo, useRef } from "react";


const useDebounce = (callback:Function , timeDelay:number) =>{

    const ref = useRef<Function | null>(null)
    useEffect(()=>{
        ref.current = callback
    } , [callback])
    const debouncedCallBack = useMemo(()=>{
        const func = ()=>{
            ref.current?.()
        }
        return debounce(func , timeDelay)
    } , [])
    return debouncedCallBack;
}


export default useDebounce;