import { useProtectedRoute } from "@/hooks/protectedRoutes";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { UseFlag } from "@/hooks/flagContext";
import { Flag, Crown, Trophy, Medal, Clock, Search, ChevronDown, ChevronUp, User } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { toast } from "sonner";


export default function LeaderBoard() {
  const { loading: routeLoading } = useProtectedRoute();
  const flagContext = UseFlag();
  const foundFlags = flagContext?.foundFlags || [];
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("flags"); // flags, fastest, username
  const [sortDir, setSortDir] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const totalFlags = 4; 
  
  const flagDetails = {
    'a': { 
      name: "Binary Pattern", 
      description: "Found by solving the binary pattern on the welcome page", 
      difficulty: "Easy",
      location: "Welcome Section"
    },
    'b': { 
      name: "Hidden Flag", 
      description: "Found by clicking the flag icon in the How to Play section", 
      difficulty: "Medium",
      location: "How to Play Section" 
    },
    'c': { 
      name: "Privacy Guru", 
      description: "Earned by successfully completing the privacy policy challenge", 
      difficulty: "Medium",
      location: "Privacy Policy Challenge" 
    },
    'd': { 
      name: "Cryptography Master", 
      description: "Captured by solving the cryptography challenge", 
      difficulty: "Hard",
      location: "Cryptography Challenge" 
    }
  };

  useEffect(() => {
    async function fetchLeaderboardData() {
      setLoading(true);
      try {
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        const currentUserId = session?.user?.id;
        setCurrentUser(session?.user);
        
        const { data, error } = await supabase
          .from('user_flags')
          .select(`
            user_id,
            flag_id,
            captured_at,
            profiles:user_id (
              name,
              username,
              avatar_url
            )
          `)
          .order('captured_at', { ascending: true });
          
        if (error) {
          throw error;
        }
        
        // Process data to create leaderboard entries
        const usersMap = new Map();
        
        data.forEach(entry => {
          const userId = entry.user_id;
          
          if (!usersMap.has(userId)) {
            usersMap.set(userId, {
              id: userId,
              name: entry.profiles?.name || "Anonymous",
              username: entry.profiles?.username || "user",
              avatar_url: entry.profiles?.avatar_url,
              flags: [entry.flag_id],
              flagCount: 1,
              fastestCapture: entry.captured_at,
              isCurrentUser: userId === currentUserId
            });
          } else {
            const user = usersMap.get(userId);
            user.flags.push(entry.flag_id);
            user.flagCount += 1;
            // Track fastest capture (earliest timestamp)
            if (new Date(entry.captured_at) < new Date(user.fastestCapture)) {
              user.fastestCapture = entry.captured_at;
            }
          }
        });
        
        const leaderboardArray = Array.from(usersMap.values());
        
        leaderboardArray.sort((a, b) => b.flagCount - a.flagCount);
        
        if (currentUserId) {
          const userIndex = leaderboardArray.findIndex(user => user.id === currentUserId);
          setUserRank(userIndex !== -1 ? userIndex + 1 : null);
          
          // If user has flags from context but not in database, show their profile anyway
          if (userIndex === -1 && foundFlags.length > 0) {
            // Add current user to leaderboard with local flag data
            const userProfile = {
              id: currentUserId,
              name: session.user.user_metadata?.name || session.user.email || "You",
              username: session.user.user_metadata?.username || "user",
              avatar_url: session.user.user_metadata?.avatar_url,
              flags: foundFlags,
              flagCount: foundFlags.length,
              fastestCapture: new Date().toISOString(),
              isCurrentUser: true
            };
            
            leaderboardArray.push(userProfile);
            leaderboardArray.sort((a, b) => b.flagCount - a.flagCount);
            
            // Update user rank
            const newUserIndex = leaderboardArray.findIndex(user => user.id === currentUserId);
            setUserRank(newUserIndex + 1);
          }
        }
        
        setLeaderboardData(leaderboardArray);
      } catch (error) {
        toast.error("Error fetching leaderboard data: ");
      } finally {
        setLoading(false);
      }
    }
    
    // Call the function to fetch data
    fetchLeaderboardData();
  }, [foundFlags]); // Added foundFlags as a dependency to refresh when flags change
  
  const handleSort = (column) => {
    if (sortBy === column) {
      // Toggle direction if clicking the same column
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      // Set new column and default to descending
      setSortBy(column);
      setSortDir("desc");
    }
  };
  
  const sortedData = [...leaderboardData]
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const direction = sortDir === "asc" ? 1 : -1;
      
      if (sortBy === "flags") {
        return direction * (a.flagCount - b.flagCount);
      } else if (sortBy === "fastest") {
        return direction * (new Date(a.fastestCapture) - new Date(b.fastestCapture));
      } else if (sortBy === "username") {
        return direction * a.username.localeCompare(b.username);
      }
      return 0;
    });
  
  const renderRankIcon = (rank) => {
    if (rank === 1) return <Crown size={24} className="text-amber-400" />;
    if (rank === 2) return <Trophy size={24} className="text-slate-400" />;
    if (rank === 3) return <Medal size={24} className="text-amber-700" />;
    return <span className="text-gray-500 text-lg font-bold">{rank}</span>;
  };
  
  const getProgressColor = (count) => {
    const percentage = (count / totalFlags) * 100;
    if (percentage === 100) return "bg-success";
    if (percentage >= 75) return "bg-primary";
    if (percentage >= 50) return "bg-info";
    if (percentage >= 25) return "bg-warning";
    return "bg-secondary";
  };

  if (routeLoading) return <Skeleton height={150} width={300} />;

  return (
    <div className="flex flex-col min-h-screen w-full bg-background dark:bg-background">
      <main className="flex flex-col flex-grow w-full max-w-6xl mx-auto p-5">
        <div className="flex flex-col space-y-6">
          {/* Leaderboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold font-bebas tracking-wider mb-2 flex items-center">
                <Flag className="mr-2 text-primary" /> Leaderboard
              </h1>
              <p className="text-gray-600">
                Compete for the top spot by finding all hidden flags across the site
              </p>
            </div>
            
            <div className="relative w-full md:w-64 mt-4 md:mt-0">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 border border-gray-300 rounded-lg"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>
          
          {/* Current User Stats */}
          {currentUser && userRank !== null && (
            <div className="bg-primary/10 border border-primary rounded-xl p-5">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                    {currentUser.user_metadata?.name?.charAt(0) || 
                     currentUser.email?.charAt(0) || <User />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {currentUser.user_metadata?.name || "Your Profile"}
                    </h3>
                    <p className="text-gray-600">
                      Rank: #{userRank} on the leaderboard
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col w-full md:w-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Your Progress</span>
                    <span className="text-sm font-bold">
                      {foundFlags.length}/{totalFlags} flags
                    </span>
                  </div>
                  <div className="h-3 w-full md:w-64 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getProgressColor(foundFlags.length)}`} 
                      style={{ width: `${(foundFlags.length / totalFlags) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Leaderboard Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Rank
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("username")}
                  >
                    <div className="flex items-center">
                      Username
                      {sortBy === "username" && (
                        sortDir === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("flags")}
                  >
                    <div className="flex items-center">
                      Flags Captured
                      {sortBy === "flags" && (
                        sortDir === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("fastest")}
                  >
                    <div className="flex items-center">
                      Fastest Capture
                      {sortBy === "fastest" && (
                        sortDir === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">
                      Loading leaderboard data...
                    </td>
                  </tr>
                ) : sortedData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">
                      No users found. Be the first to capture a flag!
                    </td>
                  </tr>
                ) : (
                  sortedData.map((user, index) => (
                    <tr key={user.id} className={user.isCurrentUser ? "bg-primary/10" : index % 2 ? "bg-gray-50" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          {renderRankIcon(index + 1)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            {user.avatar_url ? (
                              <img className="h-10 w-10 rounded-full" src={user.avatar_url} alt={user.name} />
                            ) : (
                              <span className="text-lg font-medium">{user.name.charAt(0)}</span>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                              {user.isCurrentUser && (
                                <span className="ml-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                                  You
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        @{user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {user.flagCount}/{totalFlags}
                          </div>
                          <div className="ml-2 w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className={getProgressColor(user.flagCount)} 
                              style={{ width: `${(user.flagCount/totalFlags) * 100}%` }} 
                              title={`${Math.round((user.flagCount/totalFlags) * 100)}%`}
                            ></div>
                          </div>
                          <div className="ml-2">
                            {user.flags.map(flag => (
                              <span 
                                key={flag} 
                                className="inline-block w-2 h-2 rounded-full bg-primary ml-1"
                                title={flagDetails[flag]?.name || `Flag ${flag}`}
                              ></span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {new Date(user.fastestCapture).toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Flag Details Section */}
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold font-bebas tracking-wider mb-4">Flag Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(flagDetails).map(([id, details]) => (
                <div 
                  key={id} 
                  className={`p-4 border rounded-lg ${foundFlags.includes(id) ? 'border-primary' : 'border-gray-200 opacity-70'}`}
                >
                  <div className="flex items-start">
                    <div className={`p-2 rounded-full ${foundFlags.includes(id) ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                      <Flag size={20} />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-bold text-lg">
                        {details.name}
                        {foundFlags.includes(id) ? (
                          <span className="ml-2 text-xs text-primary">Captured</span>
                        ) : (
                          <span className="ml-2 text-xs text-gray-500">Undiscovered</span>
                        )}
                      </h3>
                      <p className="text-gray-600 text-sm">{foundFlags.includes(id) ? details.description : "???"}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span className="mr-2">Difficulty: {details.difficulty}</span>
                        <span>Location: {foundFlags.includes(id) ? details.location : "???"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}