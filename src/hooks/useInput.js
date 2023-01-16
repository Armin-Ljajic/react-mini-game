import { useEffect, useState } from "react";

export const useInput = () => {
    const [input, setInput] = useState({
        forward: false,
        backward: false,
        left: false,
        right: false,
        shift: false,
        jump: false,
        shoot: false,
        click: false
    });

    const keys = {
        KeyW: "forward",
        KeyS: "backward",
        KeyA: "left",
        KeyD: "right",
        ShiftLeft: "shift",
        Space: "jump",
        Digit1: "shoot",
        0: "click"

    }

    const findKey = ((key) => keys[key])

    useEffect(() => {
        const handleKeyDown = (e) => {
            setInput((m) => ({...m, [findKey(e.code)]: true}));
        }

        const handleKeyUp = (e) => {
            setInput((m) => ({...m, [findKey(e.code)]: false}));
        }
        
        // const handleClick = (e) => {
        //     setInput((m) => ({...m, [findKey(e.code)]: true}));
        //     console.log(findKey(e.code))
        // }
        
        // const handleMouseClickDown = (e) => {
        //     setInput((m) => ({...m, [findKey(e.code)]: true}));
        // }

        // const handleMouseRelease = (e) => {
        //     setInput((m) => ({...m, [findKey(e.code)]: false}));
        // }

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);
        // document.addEventListener("click", handleClick);

        // document.addEventListener("mousedown", handleMouseClickDown);
        // document.addEventListener("mouseup", handleMouseRelease);


        return () => {
            document.addEventListener("keydown", handleKeyDown);
            document.addEventListener("keyup", handleKeyUp);
            // document.addEventListener("click", handleClick);

            // document.addEventListener("mousedown", handleMouseClickDown);
            // document.addEventListener("mouseup", handleMouseRelease);
        };
    
    }, [])

    return input;
}