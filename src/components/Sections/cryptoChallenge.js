import { useState, useEffect } from "react";
import { UseFlag } from "@/hooks/flagContext";
import { Lock, Unlock, RefreshCw, Send } from "lucide-react";
import confetti from "canvas-confetti";

export default function CryptoChallenge() {
  return (
    <section className="min-h-[100vh] w-full bg-gradient-to-b from-[#1a1a2e] to-[#16213e] text-white py-16 px-6">
      <div className="flex flex-col max-w-5xl mx-auto text-center space-y-10">
        <div className="flex justify-center items-center gap-3">
          <Lock size={48} className="text-[#e94560] drop-shadow-md" />
          <h2 className="text-5xl font-bold font-bebas tracking-wider">
            Cryptography Challenge
          </h2>
        </div>

        <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
          Crack the code to find the hidden message. This advanced challenge tests your cryptography skills,
          pattern recognition, and problem-solving abilities. Can you decipher the secret and capture the flag?
        </p>

        <CryptoPuzzle />
      </div>
    </section>
  );
}

const CryptoPuzzle = () => {
  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [hint, setHint] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const { addFlag } = UseFlag();
  const flagAlpha = 'd';

  // The encrypted text using a custom substitution cipher with a shift pattern
  const encryptedText = "MXPVSWPH WKLV PHVVDJH WR FODLP BRXU IODJ: VHFXULWB ILUVW";
  
  // The expected solution (decrypted)
  const solution = "DECIPHER THIS MESSAGE TO CLAIM YOUR FLAG: SECURITY FIRST";

  const checkSolution = (e) => {
    e.preventDefault();
    setAttempts(attempts + 1);
    
    // Normalize input for comparison (uppercase, remove extra spaces)
    const normalizedInput = input.trim().toUpperCase();
    const normalizedSolution = solution.trim().toUpperCase();
    
    if (normalizedInput === normalizedSolution) {
      setIsCorrect(true);
      const success = addFlag(flagAlpha);
      if (success) {
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.65 }
        });
      }
    } else {
      // Generate dynamic hints based on number of attempts
      if (attempts === 2) {
        setHint("Hint: This is a substitution cipher with a shift pattern.");
        setShowHint(true);
      } else if (attempts === 4) {
        setHint("Hint: Each letter is shifted by a different number in a repeating pattern (3, 1, 4).");
        setShowHint(true);
      } else if (attempts >= 6) {
        setHint("Hint: The first word is 'DECIPHER' - use this to work out the pattern.");
        setShowHint(true);
      }
    }
  };

  const resetChallenge = () => {
    setInput("");
    setAttempts(0);
    setHint("");
    setShowHint(false);
    setIsCorrect(false);
  };

  return (
    <div className="bg-[#0f3460] p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
      {!isCorrect ? (
        <div className="space-y-8">
          <div className="bg-[#1a1a2e] p-6 rounded-xl border border-[#e94560]/30">
            <h3 className="text-xl font-semibold text-[#e94560] mb-4">Encrypted Message:</h3>
            <p className="font-mono text-lg tracking-wider break-words">
              {encryptedText}
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-neutral-400">
              Your task: Decrypt the message to reveal the hidden flag. The cipher used is more complex than a simple shift.
            </p>
            {showHint && (
              <div className="bg-[#e94560]/10 p-3 rounded-lg">
                <p className="text-sm text-[#e94560]">{hint}</p>
              </div>
            )}
          </div>
          
          <form onSubmit={checkSolution} className="space-y-4">
            <div>
              <label htmlFor="solution" className="sr-only">Your Solution</label>
              <textarea
                id="solution"
                rows="3"
                placeholder="Enter your decrypted message here..."
                className="w-full px-4 py-3 rounded-lg bg-[#16213e] border border-[#e94560]/30 focus:border-[#e94560] focus:outline-none focus:ring-1 focus:ring-[#e94560] font-mono"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                required
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 flex justify-center items-center gap-2 bg-[#e94560] hover:bg-[#e94560]/80 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                <Send size={18} />
                Submit Solution
              </button>
              
              <button
                type="button"
                onClick={resetChallenge}
                className="flex items-center gap-2 bg-transparent hover:bg-white/10 border border-white/20 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200"
              >
                <RefreshCw size={18} />
                Reset
              </button>
            </div>
          </form>
          
          <div className="text-sm text-neutral-400">
            <p>Attempts: {attempts}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8 py-4">
          <div className="flex justify-center">
            <Unlock size={64} className="text-green-400 animate-pulse" />
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-green-400 mb-2">Challenge Completed!</h3>
            <p className="text-lg">You&apos;ve successfully decrypted the message and captured the flag!</p>
          </div>
          
          <div className="bg-green-400/10 p-6 rounded-xl border border-green-400/30">
            <p className="font-mono text-lg tracking-wider break-words">
              {solution}
            </p>
          </div>
          
          <button
            onClick={resetChallenge}
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
          
          <div className="text-sm text-neutral-400">
            <p>Completed in {attempts} {attempts === 1 ? 'attempt' : 'attempts'}</p>
          </div>
        </div>
      )}
    </div>
  );
};