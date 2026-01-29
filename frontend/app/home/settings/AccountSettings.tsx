
"use client";
import { useEffect, useState } from "react";
import {
  Shield,
  Info,
  Eye,
  EyeOff,
  Check,
  X,
  Bell,
  Camera,
  Wallet,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { api } from "@/lib/api";


type NotificationType = "transaction" | "warning" | "insights" | "success";
type NotificationStatus = "success" | "warning" | "info";

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  type: NotificationType;
  status: NotificationStatus;
  unread: boolean;
}

interface UserProfile {
  name: string;
  profileImage?: string;
}

/* ---------------- ICON + COLOR MAP ---------------- */
const iconMap: Record<NotificationType, any> = {
  transaction: Wallet,
  warning: AlertTriangle,
  insights: TrendingUp,
  success: CheckCircle,
};

const colorMap: Record<NotificationStatus, string> = {
  success: "text-emerald-600 bg-emerald-50",
  warning: "text-amber-600 bg-amber-50",
  info: "text-blue-600 bg-blue-50",
};

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false
  });

 /* ---------------- GENERAL STATE ---------------- */
 const [profileName, setProfileName] = useState("");
 const [profileEmail, setProfileEmail] = useState("");
 useEffect(() => {
  const email = localStorage.getItem("email");
  if (email) {
    setProfileEmail(email);
  }
}, []);
 const [profileImage, setProfileImage] = useState<File | null>(null);
 const [successMessage, setSuccessMessage] = useState<string | null>(null);

 useEffect(() => {
  const fetchProfile = async () => {
    const res = await api<{ user: UserProfile }>("/auth/me");

    if (res.success && res.data?.user) {
      setProfileName(res.data.user.name || "");
     
      if (res.data.user.profileImage) {
        setProfileImage(res.data.user.profileImage as any);
      }
    }
  };

  fetchProfile();
}, []);


 const [notifications, setNotifications] = useState<Notification[]>([
  {
    id: 1,
    title: "Transaction Added",
    description: "You added a $45.00 expense to Food.",
    time: "2 min ago",
    type: "transaction",
    status: "success",
    unread: true,
  },
  {
    id: 2,
    title: "Transaction Updated",
    description: "Your Uber transaction was updated.",
    time: "1 hour ago",
    type: "transaction",
    status: "info",
    unread: false,
  },
  {
    id: 3,
    title: "Budget Alert",
    description: "You’ve used 80% of your Food budget.",
    time: "Today",
    type: "warning",
    status: "warning",
    unread: true,
  },
  {
    id: 4,
    title: "Monthly Summary Ready",
    description: "Your spending summary for April is available.",
    time: "Yesterday",
    type: "insights",
    status: "info",
    unread: false,
  },
  {
    id: 5,
    title: "Savings Goal Achieved",
    description: "You reached your $1,000 savings goal 🎉",
    time: "2 days ago",
    type: "success",
    status: "success",
    unread: true,
  },
]);

const markAsRead = (id: number) => {
  setNotifications((prev) =>
    prev.map((n) =>
      n.id === id ? { ...n, unread: false } : n
    )
  );
};

const dismissNotification = (id: number) => {
  setNotifications((prev) => prev.filter((n) => n.id !== id));
};

const clearAll = () => setNotifications([]);



 const tabs = [
   { id: "general", label: "General" },
   { id: "security", label: "Security" },
 ];

 const [passwordLoading, setPasswordLoading] = useState(false);
const [passwordError, setPasswordError] = useState<string | null>(null);
const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);


const handleChangePassword = async () => {
  setPasswordError(null);
  setPasswordSuccess(null);

  if (formData.newPassword !== formData.confirmPassword) {
    setPasswordError("New passwords do not match");
    return;
  }

  if (!isPasswordValid) {
    setPasswordError("Password does not meet requirements");
    return;
  }

  try {
    setPasswordLoading(true);

    const res = await api("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }),
    });

    if (!res.success) {
      setPasswordError(res.message || "Failed to update password");
      return;
    }

    // ✅ Success
    setPasswordSuccess("Password updated successfully");

    // Reset form
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setPasswordValidation({
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      symbol: false,
    });

  } catch (error) {
    setPasswordError("Something went wrong. Please try again.");
  } finally {
    setPasswordLoading(false);
  }
};


const handlePasswordChange = (
  field: "currentPassword" | "newPassword" | "confirmPassword",
  value: string
) => {
  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }));

  // Only validate when new password changes
  if (field === "newPassword") {
    setPasswordValidation({
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    });
  }
};



const isPasswordValid = Object.values(passwordValidation).every(Boolean);

const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0] ?? null;
  if (file) {
    setProfileImage(file);
    setSuccessMessage("Profile image updated successfully");
    // Remove message after 3 seconds
    setTimeout(() => setSuccessMessage(null), 3000);
  }
};


const handleProfileUpdate = async () => {
  if (!profileName) return;

  const formDataToSend = new FormData();
  formDataToSend.append("name", profileName);

  if (profileImage instanceof File) {
    formDataToSend.append("profileImage", profileImage);
  }

  try {
    const res = await api("/auth/update-profile", {
      method: "PUT",
      body: formDataToSend,
    });

    if (!res.success) {
      setSuccessMessage(null);
      return;
    }

    setSuccessMessage("Profile updated successfully!");
    setTimeout(() => setSuccessMessage(null), 3000);
  } catch (err) {
    setSuccessMessage(null);
    
  }
};







  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 lg:p-8">
      <div className=" mx-auto">
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
                      ? 'text-teal-600'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 lg:p-8">
           
          {activeTab === "general" && (
  <div className="space-y-8">
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Profile Information</h2>
      <p className="text-sm text-slate-500">
        Update your personal details and profile photo.
      </p>
    </div>

    {/* Profile Image */}
    <div className="flex items-center gap-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
          {profileImage ? (
           <img
           src={
             profileImage instanceof File
               ? URL.createObjectURL(profileImage)
               : `http://localhost:5000${profileImage}`
           }
           alt="Profile"
           className="w-full h-full object-cover"
         />
          ) : (
            <Camera className="w-8 h-8 text-slate-400" />
          )}
        </div>

        <label className="absolute -bottom-2 -right-2 bg-black p-2 rounded-full cursor-pointer hover:bg-teal-600 transition">
          <Camera className="w-4 h-4 text-white" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
      </div>

      <div className="text-sm text-slate-600">
        <p className="font-medium text-slate-800">Profile Photo</p>
        <p>PNG, JPG up to 5MB</p>
      </div>
    </div>

    {/* Name & Email */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Full Name
        </label>
        <input
          type="text"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
          placeholder="Enter your name"
        />
      </div>

      <div>
  <label className="block text-sm font-medium text-slate-700 mb-2">
    Email Address
  </label>
  <input
    type="email"
    value={profileEmail}
    readOnly
    className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed focus:outline-none"
  />
</div>

    </div>


    {successMessage && (
  <div className="mb-4 p-3 rounded-lg bg-emerald-100 text-emerald-800 font-medium">
    {successMessage}
  </div>
)}

    {/* Save Button */}
    <button
  onClick={handleProfileUpdate}
  className="px-6 py-3 bg-black text-white font-medium rounded-lg transition shadow-lg"
>
  Save Changes
</button>

  </div>
)}


  {/* ======================================================
                NOTIFICATIONS TAB
            ====================================================== */}
        

{activeTab === "security" && (
  <>
   <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Password</h2>
              <p className="text-sm text-slate-500 mb-6">Update your password to keep your account secure.</p>

              <div className="space-y-5">
               
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      placeholder="Enter your current password"
                      value={formData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Min. 8 characters"
                        value={formData.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your new password"
                        value={formData.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                        className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {formData.newPassword && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start gap-2 mb-3">
                      <Info className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">Password Requirements</p>
                        <p className="text-xs text-slate-500 mb-3">
                          Minimum 8 characters long, uppercase & lowercase letters, and at least one number or symbol.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className={`flex items-center gap-2 text-sm ${passwordValidation.length ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {passwordValidation.length ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        <span>At least 8 characters</span>
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${passwordValidation.uppercase ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {passwordValidation.uppercase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        <span>Uppercase letter</span>
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${passwordValidation.lowercase ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {passwordValidation.lowercase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        <span>Lowercase letter</span>
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${passwordValidation.number ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {passwordValidation.number ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        <span>Number (0-9)</span>
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${passwordValidation.symbol ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {passwordValidation.symbol ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        <span>Special character</span>
                      </div>
                    </div>
                  </div>
                )}

{passwordError && (
  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
    <AlertTriangle className="w-4 h-4" />
    {passwordError}
  </div>
)}

{passwordSuccess && (
  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm">
    <CheckCircle className="w-4 h-4" />
    {passwordSuccess}
  </div>
)}

                <div className="flex justify-end pt-2">
                <button
  onClick={handleChangePassword}
  disabled={
    passwordLoading ||
    !formData.currentPassword ||
    !isPasswordValid ||
    formData.newPassword !== formData.confirmPassword
  }
  className="px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-500/30 disabled:shadow-none"
>
  {passwordLoading ? "Updating..." : "Update Password"}
</button>


                </div>
              </div>
            </div>

            {/* <div className="pt-8 border-t border-slate-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-violet-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-800 mb-2">Two-Factor Authentication</h2>
                  <p className="text-sm text-slate-500 mb-6">Add an extra layer of security to your account.</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Authenticator App (Recommended)</h3>
                    <p className="text-sm text-slate-600">Use an authenticator app to generate secure codes</p>
                  </div>
                  <button className="px-6 py-2.5 bg-white border border-violet-300 text-violet-700 font-medium rounded-lg hover:bg-violet-50 transition-all whitespace-nowrap">
                    Enable 2FA
                  </button>
                </div>
              </div>

              <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">SMS Verification</h3>
                    <p className="text-sm text-slate-600">Receive verification codes via text message</p>
                  </div>
                  <button className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-all whitespace-nowrap">
                    Setup SMS
                  </button>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Security Tip</p>
                  <p>We strongly recommend enabling two-factor authentication to protect your account from unauthorized access.</p>
                </div>
              </div>
            </div> */}
            
            </>
)}

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings