"use client";
import { useState } from "react";
import { Upload, X, Check } from 'lucide-react';

const PersonalSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [avatarUrl, setAvatarUrl] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun');
  
  const [formData, setFormData] = useState({
    fullName: 'Arjun Mehta',
    email: 'arjun.mehta@example.com',
    phone: '+91 98765 43210'
  });

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'billing', label: 'Billing & Plans' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAvatarChange = () => {
    const seeds = ['Arjun', 'Felix', 'Aneka', 'Bailey', 'Charlie'];
    const randomSeed = seeds[Math.floor(Math.random() * seeds.length)];
    setAvatarUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`);
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl('https://api.dicebear.com/7.x/avataaars/svg?seed=default');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Account & Settings</h1>
          <p className="text-slate-500">Manage your account settings and preferences</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200 px-6 pt-6">
            <div className="flex gap-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 px-2 text-sm font-medium whitespace-nowrap transition-all relative ${
                    activeTab === tab.id
                      ? 'text-blue-600'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="p-6 lg:p-8">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Personal Information</h2>
              <p className="text-sm text-slate-500 mb-6">Manage your public profile and account details.</p>
              <div className="mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <img 
                      src={avatarUrl} 
                      alt="Profile Avatar" 
                      className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={handleAvatarChange}
                      className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-all"
                    >
                      Change Avatar
                    </button>
                    <button 
                      onClick={handleRemoveAvatar}
                      className="px-4 py-2 text-rose-600 text-sm font-medium hover:bg-rose-50 rounded-lg transition-all"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3 ml-24">JPG, GIF or PNG. Max size 2MB.</p>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Subscription Plan</h2>
              <p className="text-sm text-slate-500 mb-6">
                You are currently on the <span className="font-semibold text-slate-700">Free Plan</span>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border-2 border-blue-500 rounded-xl p-6 bg-blue-50/50 relative">
                  <div className="absolute -top-3 left-6 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Current Plan
                  </div>
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-800">Free</h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-bold text-slate-800">₹0</span>
                      <span className="text-slate-500 text-sm">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-blue-600" />
                      <span>Basic expense tracking</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-blue-600" />
                      <span>Up to 50 transactions/month</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-blue-600" />
                      <span>Basic insights</span>
                    </li>
                  </ul>
                  <button className="w-full py-2.5 bg-slate-200 text-slate-500 font-medium rounded-lg cursor-not-allowed">
                    Current Plan
                  </button>
                </div>

                <div className="border-2 border-slate-200 rounded-xl p-6 hover:border-violet-400 hover:shadow-lg transition-all">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-800">Pro</h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-bold text-slate-800">₹299</span>
                      <span className="text-slate-500 text-sm">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-violet-600" />
                      <span>Unlimited transactions</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-violet-600" />
                      <span>Advanced insights</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-violet-600" />
                      <span>Custom budget goals</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-violet-600" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                  <button className="w-full py-2.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium rounded-lg hover:shadow-lg transition-all">
                    Upgrade to Pro
                  </button>
                </div>

                <div className="border-2 border-slate-200 rounded-xl p-6 hover:border-amber-400 hover:shadow-lg transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                    Popular
                  </div>
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-800">Premium</h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-bold text-slate-800">₹499</span>
                      <span className="text-slate-500 text-sm">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-amber-600" />
                      <span>Everything in Pro</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-amber-600" />
                      <span>Investment tracking</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-amber-600" />
                      <span>Tax optimization tips</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-amber-600" />
                      <span>Personal finance advisor</span>
                    </li>
                  </ul>
                  <button className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:shadow-lg transition-all">
                    Upgrade to Premium
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalSettings;