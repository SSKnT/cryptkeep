import { useEffect, useState } from "react"
import { UseFlag } from "@/hooks/flagContext"

export default function FlagCounter({ isActive = true }) {
  const [visible, setVisible] = useState(false)
  const { foundFlags } = UseFlag()
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 100
      setVisible(shouldShow)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  
  useEffect(() => {
    if (foundFlags.length === 0) return
    setAnimate(true)
    const timeout = setTimeout(() => setAnimate(false), 1000) // animation lasts 1s
    return () => clearTimeout(timeout)
  }, [foundFlags])

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
      }`}
    >
      <div className="flex items-center gap-4 px-3 py-1 lg:px-6 lg:py-3 bg-[#333] glow text-white rounded-full shadow-xl backdrop-blur-sm">
        <svg
          viewBox="0 0 24 24"
          className={`shrink-0 h-[20px] w-[20px] lg:h-[40px] lg:w-[40px] ${
            animate ? "animate-wave" : ""
          }`}
        >
          <rect
            x="8"
            y="2"
            width="1"
            height="20"
            fill="#8B8B8B"
            opacity={isActive ? 1 : 0.5}
          />
          <path
            d="M9 3 L22 8 L9 13 Z"
            fill="#FF4B4B"
            opacity={isActive ? 1 : 0.5}
          />
        </svg>

        <div className="text-lg font-semibold">
          <span className="text-red-400">{foundFlags.length} / 4</span>
        </div>
      </div>
    </div>
  )
}
