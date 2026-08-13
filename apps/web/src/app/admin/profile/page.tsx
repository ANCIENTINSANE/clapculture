'use client';
import { useState } from 'react';

export default function ProfilePage() {
  const [toast, setToast] = useState<string | null>(null);

  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@clapculture.com',
    phone: '+91 9876543210',
    avatar: ''
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profile updated successfully');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      showToast('New passwords do not match');
      return;
    }
    showToast('Password changed successfully');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const getInitial = () => profileData.name.charAt(0).toUpperCase();

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Admin Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-[#1a1a1a] border border-[#262626] rounded-full flex items-center justify-center mb-4 text-3xl font-bold text-[#d2f000] relative group cursor-pointer overflow-hidden">
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  getInitial()
                )}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-white">photo_camera</span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-white">{profileData.name}</h2>
              <p className="text-[#a3a3a3] text-sm mb-2">{profileData.email}</p>
              <span className="bg-[#d2f000]/10 text-[#d2f000] border border-[#d2f000]/20 px-3 py-1 rounded-full text-xs font-medium mt-2">
                Super Admin
              </span>
            </div>
          </div>

          {/* Forms */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Edit Profile */}
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-6">Edit Profile</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#a3a3a3] mb-2">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#a3a3a3] mb-2">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-[#a3a3a3] mb-2">Phone Number</label>
                    <input 
                      type="text" 
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full max-w-md bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none"
                    />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" className="bg-[#d2f000] text-black font-medium px-6 py-2 rounded-lg hover:bg-[#b8d400]">
                    Update Profile
                  </button>
                </div>
              </form>
            </div>

            {/* Change Password */}
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-6">Change Password</h2>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm text-[#a3a3a3] mb-2">Current Password</label>
                  <input 
                    type="password" 
                    required
                    value={passwords.current}
                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a3a3a3] mb-2">New Password</label>
                  <input 
                    type="password" 
                    required
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a3a3a3] mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    required
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white focus:border-[#d2f000] outline-none"
                  />
                </div>
                <div className="pt-4">
                  <button type="submit" className="border border-[#262626] text-white px-6 py-2 rounded-lg hover:bg-[#1a1a1a]">
                    Change Password
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-[#1a1a1a] border border-[#262626] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in z-50">
          <span className="material-symbols-outlined text-[#d2f000] text-[20px]">info</span>
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}
    </div>
  );
}