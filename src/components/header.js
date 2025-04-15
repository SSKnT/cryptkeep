import Link from "next/link"
import { useRouter } from "next/router"
import Button from "@/components/button"

const Header = () => {
    return(
    <header className="relative flex flex-row items-center h-24 w-full p-4 px-10 bg-background dark:bg-background">
        <Nav />
        <Logo />
        <RightBar />
    </header>
    )
}

const Nav = () => {
    return(
        <div className="flex flex-row items-center h-[70%] lg:h-[75%] font-medium rounded-3xl bg-gray-300/50">
            <NavButton href="/" name="Home" />
            <NavButton href="/leaderboard" name="LeaderBoard" />
            <NavButton href="#" name="Profile" />
        </div>
    )
}

const NavButton = ({href="", name}) =>{
    const router = useRouter()
    const isActive = (path) => router.pathname ===  path;


    return(
        <Link href={href} className={`flex items-center px-6 md:px-9 lg:px-16 justify-center h-full w-8 md:w-12 lg:w-16 rounded-3xl ${isActive(href) ? "bg-primary" : "bg-transparent"} transition-colors hover:bg-gray-600/10`}>
            <span className={` ${isActive(href) ? "text-white" : "text-black"} `}>{name}</span>
        </Link>    
    )   
}

const Logo = () => {
    return(
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-[1%] flex items-center justify-center h-[80%] w-8 md:w-12 lg:w-30 rounded bg-primary">
            <span className="text-white">Logo</span>
        </div>
    )
}

const RightBar = () => {
    return(
        <div className="flex flex-row h-full items-center ml-auto">
            <LanguageSelector />
        </div>
    )
}

const LanguageSelector = () => {
    return (
      <div className="flex flex-row items-center gap-2 h-[70%] lg:h-[75%] px-2 rounded-3xl bg-gray-300/50">
        <FlagButton src="https://hatscripts.github.io/circle-flags/flags/uk.svg" alt="English" />
        <FlagButton src="https://hatscripts.github.io/circle-flags/flags/fr.svg" alt="French" />
        <FlagButton src="https://hatscripts.github.io/circle-flags/flags/de.svg" alt="Germany" />
        <FlagButton src="https://hatscripts.github.io/circle-flags/flags/pk.svg" alt="Pakistan" />
      </div>
    );
  };
  
  const FlagButton = ({ src="", alt="" }) => {
    return (
      <button className="w-10 h-10 rounded-full overflow-hidden bg-transparent hover:bg-amber-400/30 transition-colors">
        <img src={src} alt={alt} className="w-[60%] h-[60%] m-auto object-cover rounded-full" />
      </button>
    );
  };
  
export default Header;