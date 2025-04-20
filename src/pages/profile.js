import { useProtectedRoute } from "@/hooks/protectedRoutes";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User, Lock, Camera, Save, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { toast } from "sonner";

export default function Profile() {
  const { loading: routeLoading } = useProtectedRoute();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    bio: "",
    website: "",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Fetch user data on component mount
  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        
        // Get the user's profile from the profiles table
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileData) {
          setProfile({
            name: profileData.name || session.user.user_metadata?.name || "",
            username: profileData.username || "",
            bio: profileData.bio || "",
            website: profileData.website || "",
          });
          
          if (profileData.avatar_url) {
            const { data: avatarData } = await supabase.storage
              .from('avatars')
              .getPublicUrl(profileData.avatar_url);
              
            if (avatarData?.publicUrl) {
              setAvatarUrl(avatarData.publicUrl);
            }
          }
        } else {
          // Set name from auth metadata if available
          setProfile({
            ...profile,
            name: session.user.user_metadata?.name || "",
          });
        }
      }
    }
    
    getUser();
  }, []);

  // Handle profile form input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle password form input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle avatar file selection
  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  // Update profile information
  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // First update user metadata if name changed
      if (user.user_metadata?.name !== profile.name) {
        const { error: updateAuthError } = await supabase.auth.updateUser({
          data: { name: profile.name }
        });
        
        if (updateAuthError) throw updateAuthError;
      }
      
      // Upload avatar if a new file is selected
      let avatar_url = null;
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, {
            upsert: true,
          });
          
        if (uploadError) throw uploadError;
        avatar_url = filePath;
      }
      
      // Update or insert profile data in profiles table
      const updates = {
        id: user.id,
        username: profile.username,
        name: profile.name,
        bio: profile.bio,
        website: profile.website,
        updated_at: new Date().toISOString(),
      };
      
      if (avatar_url) {
        updates.avatar_url = avatar_url;
      }
      
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(updates, { 
          onConflict: 'id',
          returning: 'minimal'
        });
      
      if (profileError) throw profileError;
      
      showNotification("Profile updated successfully", "success");
    } catch (error) {
      toast.error("Error updating profile");
      showNotification("Error updating profile", "error");
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwords.new !== passwords.confirm) {
      return showNotification("New passwords don't match", "error");
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      });
      
      if (error) throw error;
      
      // Reset password fields
      setPasswords({
        current: "",
        new: "",
        confirm: "",
      });
      
      showNotification("Password updated successfully", "success");
    } catch (error) {
      toast.error("Error updating password");
      showNotification("Error updating password", "error");
    } finally {
      setLoading(false);
    }
  };

  // Show notification helper
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };
  
  if (routeLoading) return <Skeleton height={150} width={300} />;

  return (
    <div className="flex flex-col min-h-screen w-full bg-background dark:bg-background">
      <main className="flex flex-col flex-grow w-full max-w-4xl mx-auto p-5">
        <div className="bg-white shadow rounded-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-primary p-6 flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-light">
                    <User size={40} className="text-white" />
                  </div>
                )}
              </div>
              <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-1 bg-secondary rounded-full cursor-pointer hover:bg-secondary-dark">
                <Camera size={16} className="text-white" />
                <input 
                  id="avatar-upload" 
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">{profile.name || user?.email}</h1>
              <p className="text-white/70">{user?.email}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button 
              className={`flex-1 py-4 font-medium ${activeTab === 'profile' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile Information
            </button>
            <button 
              className={`flex-1 py-4 font-medium ${activeTab === 'security' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('security')}
            >
              Security
            </button>
          </div>

          {/* Notification */}
          {notification && (
            <div className={`m-4 p-3 rounded-lg flex items-center ${notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {notification.type === 'error' ? (
                <AlertCircle size={18} className="mr-2" />
              ) : (
                <CheckCircle size={18} className="mr-2" />
              )}
              <p>{notification.message}</p>
            </div>
          )}

          {/* Profile Information Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={updateProfile} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={profile.username}
                    onChange={handleProfileChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleProfileChange}
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={profile.website}
                    onChange={handleProfileChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-lg transition-colors w-full"
                >
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin mr-2" /> Saving...</>
                  ) : (
                    <><Save size={18} className="mr-2" /> Save Profile</>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <form onSubmit={updatePassword} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    name="current"
                    value={passwords.current}
                    onChange={handlePasswordChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    name="new"
                    value={passwords.new}
                    onChange={handlePasswordChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirm"
                    value={passwords.confirm}
                    onChange={handlePasswordChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={loading || !passwords.new || !passwords.confirm || passwords.new !== passwords.confirm}
                  className="flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-lg transition-colors w-full disabled:opacity-50"
                >
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin mr-2" /> Updating...</>
                  ) : (
                    <><Lock size={18} className="mr-2" /> Update Password</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}