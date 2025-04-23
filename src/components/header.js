import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import { signOutUser } from "@/lib/auth"
import { supabase } from "@/lib/supabaseClient"
const Header = () => {
    const router = useRouter()
    const [user, setUser] = useState(null)

    useEffect(() => {
        const getUser = async () => {
          const { data: { session } } = await supabase.auth.getSession();
          setUser(session?.user || null);
        };
    
        getUser();
    
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user || null);
        });
    
        return () => {
          listener?.subscription?.unsubscribe();
        };
      }, []);    
      


    return(
    <header className="relative flex flex-row items-center h-24 w-full p-4 px-10 bg-background dark:bg-background">
        <Nav />
        <Logo />
        <RightBar user={user}/>
    </header>
    )
}

const Nav = () => {
    return(
        <div className="flex flex-row items-center h-[70%] lg:h-[75%] font-medium rounded-3xl bg-gray-300/50">
            <NavButton href="/" name="Home" />
            <NavButton href="/leaderboard" name="LeaderBoard" />
            <NavButton href="/profile" name="Profile" />
        </div>
    )
}

const NavButton = ({href="", name}) =>{
    const router = useRouter()
    const isActive = (path) => router.pathname ===  path;


    return(
        <Link href={href} className={`flex items-center px-6 md:px-9 lg:px-16 justify-center h-full w-8 md:w-12 lg:w-16 rounded-3xl ${isActive(href) ? "bg-primary" : "bg-transparent hover:bg-gray-600/10"} transition-colors `}>
            <span className={` ${isActive(href) ? "text-white" : "text-black"} `}>{name}</span>
        </Link>    
    )   
}

const Logo = () => {
    return(
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-[1%] flex items-center justify-center h-[80%] w-8 md:w-12 lg:w-30 rounded ">
            <svg width="110" height="110" viewBox="0 0 120 110" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFBB64" d="M60 10L10 30V70C10 95 60 110 60 110S110 95 110 70V30L60 10Z"/>    
              <path className="a" fill="#1A1A1A" d="M60 40C50 40 42 48 42 58C42 68 50 76 60 76S78 68 78 58C78 48 70 40 60 40ZM60 50C65 50 68 53 68 58S65 66 60 66S52 63 52 58S55 50 60 50Z"/>
              <text x="60" y="90" font-family="Bebas Neue, sans-serif" fontSize="14" fontWeight="bold" letterSpacing="2" textAnchor="middle" fill="#1A1A1A">CRYPTKEEP</text>
            </svg>
        </div>
    )
}

const RightBar = ({user}) => {
    return(
        <div className="flex flex-row h-full items-center gap-x-4 ml-auto">
            <LanguageSelector />
            <SignOut user={user}/>
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
      <Image src={src} alt={alt} width={15} height={15} className="w-[70%] h-[70%] m-auto object-cover rounded-full" />
    </button>
  );
};
 
const SignOut = ({user}) => {
    const router = useRouter()
    
    const signOut = ()=> {
        signOutUser()
        router.push("/auth")
    }
    return(
        <div>
            {user ? (
                <button 
                    className="bg-transparent font-medium text-secondary border border-secondary rounded-full px-4 py-2 hover:bg-[#FF6868] hover:text-white transition-colors ease-in-out delay-20"
                    onClick={()=>signOut()}
                >
                    Sign Out
                </button>) : <SignIn />
            }
        </div>
    )
}

const SignIn = () => {
  const router = useRouter()
    
  const signIn = ()=> {
      router.push("/auth")
  }
  return(
      <div>
          <button 
              className="bg-transparent font-medium text-accent border border-accent rounded-full px-4 py-2 hover:bg-[#00aa00] hover:text-white transition-colors ease-in-out delay-20"
              onClick={()=>signIn()}
          >
              Sign In
          </button>
      </div>
  )
}

export default Header;