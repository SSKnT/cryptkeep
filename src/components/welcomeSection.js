'use client';
import { useEffect, useState } from "react";
import FlagButton from "./flag";
import confetti from "canvas-confetti";

const CaptureTheFlag = () => {
    const [flagClicked, setFlagClicked] = useState(false)

    return(
        <section className="relative flex flex-col h-[100vh-20%] w-full bg-background dark:bg-background py-5">
            <div className="absolute inset-0 mx-4 bg-[url('/flags-1.png')] bg-contain bg-bottom bg-no-repeat opacity-10 "
                aria-hidden="true" />
            
            <div className="flex flex-col w-full rounded-lg p-5 z-10">
                <h1 className="text-[10rem] font-bold font-bebas text-center">Capture {" "}
                    <span className="text-8xl">the</span> Flag</h1>
                <p className="text-center text-lg mt-[-3%]">Capture the Flag {" "}
                    <span 
                        onClick={()=> setFlagClicked(prev => !prev)}
                        className="cursor-default"
                     >🚩</span>
                    {" "} by solving challenges to the find hidden flags.</p>
                {flagClicked && <p className="text-center text-xl font-semibold tracking-widest opacity-10">10010110</p>}
            </div>
            {flagClicked && <FlagDiv />}
        </section>
    )
}

const FlagDiv = () => {
    const [flags, setFlags] = useState([0,0,0,0,0,0,0,0])
    const winningCombination = [1, 0, 0, 1, 0, 1, 1, 0];

    const ToggleFlag = (index) => {   
        const newFlags = [...flags]
        newFlags[index] = newFlags[index] === 1 ? 0 : 1;
        setFlags(newFlags)

    }

    useEffect(()=>{
        //Winning Condition
        if (JSON.stringify(flags) === JSON.stringify(winningCombination)) {
            confetti({ 
                particleCount: 180,  // Number of confetti particles
                spread: 90,          // How wide the spray is
                origin: { y: 0.65}   // Start from bottom of screen
            });
        }    
    },[flags])

    return(
        <div className="flex flex-row flex-wrap w-full justify-center items-center p-10 z-11">
            {flags.map((flag, index)=>(
                <div key={index}
                    onClick={() => ToggleFlag(index)} 
                    className="hover:scale-110 hover:bg-gray-500/10 transition-transform duration-300 ease-in-out rounded-xl">
                    <FlagButton isActive={flag === 1} />                
                </div>
            ))}
        </div>
    )
}

export default CaptureTheFlag;
