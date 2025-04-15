import { Flag } from "lucide-react"
import { useState } from "react"
import { UseFlag } from "@/hooks/flagContext";
import confetti from "canvas-confetti";

export default function HowToPlay() {
    const [show, setShow] = useState(false)
    const {addFlag} = UseFlag()
    const flagAlpha = 'b'
    
    const Clicked = () =>{
        const success = addFlag(flagAlpha)
        if(success){
         confetti({ 
            particleCount: 180,  
            spread: 90,          
            origin: { y: 0.65} });
        }
    }

    return(
        <section className="w-full bg-neutral-900 text-white py-12 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex justify-center items-center gap-3">
              <Flag size={48} className="text-red-400 drop-shadow-md" />
              <h2 className="text-5xl font-bold font-bebas tracking-wider">How It Works</h2>
            </div>
            <p className="text-lg text-neutral-300">
              Your mission is to <span className="font-semibold text-white">find hidden flags</span> by solving puzzles, exploring the interface, and interacting with challenges.
            </p>
            <div className="flex flex-row space-x-6">
                <ul className={`text-left text-neutral-400 list-disc list-inside max-w-xl ${show ? "ml-auto" : "mx-auto"} space-y-3`}>
                  <li>Click the{" "} 
                    <span 
                        className="cursor-default"
                        onClick={()=> setShow(prev => !prev)}
                    >🚩</span> 
                    {" "}flag icon to start your challenge.</li>
                  <li>Toggle flag tiles by clicking them — find the right combination.</li>
                  <li>Once you discover the correct pattern, you&apos;ll trigger a <span className="text-green-400 font-medium">celebratory confetti!</span></li>
                  <li>Pay attention to subtle clues — some flags might be hidden elsewhere on the site 👀</li>
                </ul>
                { show && <div className="flex justify-center items-center h-[100] w-[25%] bg-background rounded-lg cursor-none">
                <span
                    onClick={()=> Clicked()}
                    className="" 
                    >🚩</span>
                </div> }
            </div>
            <p className="italic text-neutral-500">Keep experimenting, stay curious, and good luck capturing the flags!</p>
          </div>
        </section>
    )
}