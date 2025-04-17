import { UseFlag } from "@/hooks/flagContext"
import { ShieldCheck, RotateCcw } from "lucide-react"
import { useState, useEffect } from "react"
import { questions } from "@/components/question.js"
import confetti from "canvas-confetti"


export default function PrivacyChallenge() {
  return (
    <section className="min-h-[100vh] w-full bg-background text-text py-16 px-6">
      <div className="flex flex-col max-w-5xl mx-auto text-center space-y-10">
        <div className="flex justify-center items-center gap-3">
          <ShieldCheck size={48} className="text-primary mb-2" />
          <h2 className="text-5xl font-bold font-bebas tracking-wider">
            Privacy Policy Challenge
          </h2>
        </div>

        <p className="text-lg text-text opacity-50 max-w-2xl mx-auto">
          Select the best practices to build a privacy policy. Based on your responses, receive a stamp of approval — and perhaps uncover a hidden flag!
        </p>

        <PrivacyDiv />
      </div>
    </section>
  )
}


const PrivacyDiv = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedChoices, setSelectedChoices] = useState([])
  const [score, setScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const {addFlag} = UseFlag()
  const flagAlpha = 'c' 

  const handleChoice = (choiceIndex) => {
    setSelectedChoices(prev => [...prev, choiceIndex])

    if (choiceIndex === questions[currentIndex].correct) {
      setScore(prev => prev + 1)
    }

    const next = currentIndex + 1
    if (next < questions.length) {
      setCurrentIndex(next)
    } else {
      setIsComplete(true)
    }
  }

  useEffect(() => {
    if (isComplete && score >= questions.length * 0.7) {
        const success = addFlag(flagAlpha)
        if(success) {
        confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.65 }
      })
    }
     
    }
  }, [isComplete, score])

  const onReset = () =>{
    setCurrentIndex(0);
    setSelectedChoices([]);
    setScore(0);
    setIsComplete(false);
  }


  return (
    <div className="w-full bg-gray-400 p-8 rounded-2xl shadow-lg shadow-black/40">
      {!isComplete ? (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-white">
            {questions[currentIndex].question}
          </h3>
          <div className="flex flex-col gap-4">
            {questions[currentIndex].choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoice(index)}
                className="text-left bg-[#eeeeee] text-black hover:bg-[#FFBB64] font-medium p-4 rounded transition-colors"
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white text-black p-10 rounded-2xl shadow-xl space-y-6 text-center">
          

          {score >= questions.length * 0.7 ? (
            <>
              <div className="flex flex-row justify-center gap-6">
                <h3 className=" text-3xl tracking-wider font-bold font-bebas">Privacy Policy</h3>
                <div className=" text-green-600 font-semibold text-xl">✅</div>
              </div>
              <div className="text-left inline-block w-full h-full px-4 py-2 rounded-md text-green-800 font-mono mt-4">
                {questions.map((question,index)=>(
                    <p key={index}
                        className=""
                    >{question.choices[selectedChoices[index]]}</p>
                ))}  
              </div>
              <button
                  onClick={()=> onReset()}
                  className="flex items-center gap-2 mx-auto bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-md font-semibold transition-all duration-200"
                >
                  <RotateCcw size={20} />
                  Reset Quiz
              </button>
            </>
          ) : (
            <>
              <div className="flex flex-row justify-center gap-6">
                <h3 className=" text-3xl tracking-wider font-bold font-bebas">Privacy Policy</h3>
                <div className="text-red-500 font-semibold text-xl">❌</div>
              </div>
              <div className="text-left inline-block w-full h-full px-4 py-2 rounded-md text-red-400 font-mono mt-4">
                {questions.map((question,index)=>(
                    <p key={index}
                        className=""
                    >{question.choices[selectedChoices[index]]}</p>
                ))}  
              </div>
              
              <div className="flex flex-row justify-center items-center gap-6">
                <p className="text-sm text-gray-600">Review your choices and try again.</p>
                <button
                  onClick={()=> onReset()}
                  className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md font-semibold transition-all duration-200"
                >
                  <RotateCcw size={20} />
                  Reset Quiz
                </button>
              </div>
              
            </>
          )}
        </div>
      )}
    </div>
  )
}
