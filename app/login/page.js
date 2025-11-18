"use client";
import { useState } from "react";
import {
  UserOutlined,
  LockOutlined,
  GlobalOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import coreAxios from "@/utils/axiosInstance";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lang, setLang] = useState("en");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ loginID: "", password: "" });
  const [touched, setTouched] = useState({ loginID: false, password: false });
  const router = useRouter();

  const translations = {
    bn: {
      title: "রিয়েল এস্টেট প্রোতে স্বাগতম",
      subtitle: "আপনার সম্পূর্ণ সম্পত্তি ব্যবস্থাপনা সমাধান",
      userID: "ইউজার আইডি",
      password: "পাসওয়ার্ড",
      login: "লগইন করুন",
      loginIDPlaceholder: "REP-1234",
      passwordPlaceholder: "আপনার পাসওয়ার্ড লিখুন",
      helpText: "আপনার ইউজার আইডি এবং পাসওয়ার্ড ব্যবহার করুন",
      required: "এই ফিল্ডটি প্রয়োজনীয়",
      loggingIn: "লগইন হচ্ছে...",
      invalidCredentials: "ভুল ইউজার আইডি বা পাসওয়ার্ড",
      networkError: "নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন",
      serverError: "সার্ভার সমস্যা। পরে চেষ্টা করুন",
    },
    en: {
      title: "Welcome to RealEstate Pro",
      subtitle: "Your Complete Property Management Solution",
      userID: "User ID",
      password: "Password",
      login: "Sign In",
      loginIDPlaceholder: "Enter your user ID",
      passwordPlaceholder: "Enter your password",
      helpText: "Use your user ID and password to login",
      required: "This field is required",
      loggingIn: "Signing in...",
      invalidCredentials: "Invalid user ID or password",
      networkError: "Network error. Please try again",
      serverError: "Server error. Please try again later",
    },
  };

  const t = translations[lang];

  const validateForm = () => {
    return formData.loginID.trim() !== "" && formData.password.trim() !== "";
  };

  const getLocationData = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => reject(new Error("Timeout")), 5000);
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            clearTimeout(timeoutId);
            resolve(pos);
          },
          (err) => {
            clearTimeout(timeoutId);
            reject(err);
          },
          { timeout: 5000, maximumAge: 0 }
        );
      });

      return {
        latitude: position.coords.latitude.toString(),
        longitude: position.coords.longitude.toString(),
      };
    } catch (error) {
      console.log("Geolocation not available:", error.message);
      return {
        latitude: "0.0",
        longitude: "0.0",
      };
    }
  };

  const getPublicIP = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json", {
        timeout: 3000,
      });
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.log("Could not fetch IP:", error.message);
      return "Unknown";
    }
  };

  const performLogin = async (loginPayload) => {
    try {
      console.log("Attempting login with payload:", {
        ...loginPayload,
        password: "***hidden***",
      });

      const response = await coreAxios.post("auth/login", loginPayload);

      console.log("Login response status:", response.status);

      if (response.status === 200 && response.data) {
        // Validate response data
        if (!response.data.token) {
          throw new Error("No token received from server");
        }

        // Store authentication data
        localStorage.setItem("token", response.data.token);
        
        if (response.data.user) {
          localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        }

        // Navigate to dashboard
        router.push("/dashboard");
        return true;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // Handle specific error cases
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;

        if (status === 401 || status === 403) {
          throw new Error(t.invalidCredentials);
        } else if (status === 500 || status === 502 || status === 503) {
          throw new Error(t.serverError);
        } else if (errorData?.error) {
          throw new Error(errorData.error);
        } else if (errorData?.message) {
          throw new Error(errorData.message);
        } else {
          throw new Error(`Server error (${status})`);
        }
      } else if (error.request) {
        throw new Error(t.networkError);
      } else {
        throw new Error(error.message || "Login failed");
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({ loginID: true, password: true });

    // Validate form
    if (!validateForm()) {
      setError(t.required);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Get location and IP data in parallel (with fallbacks)
      const [locationData, publicIP] = await Promise.all([
        getLocationData(),
        getPublicIP(),
      ]);

      const loginPayload = {
        loginID: formData.loginID.trim(),
        password: formData.password,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        publicIP: publicIP,
        loginTime: new Date().toISOString(),
      };

      await performLogin(loginPayload);
    } catch (error) {
      console.error("Login failed:", error);
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .slide-in-left {
          animation: slideInLeft 0.6s ease-out;
        }
        .slide-in-right {
          animation: slideInRight 0.6s ease-out;
        }
      `}</style>

      <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Section - Branding */}
        <div className="hidden md:flex flex-col items-center justify-center p-8 space-y-6 slide-in-left">
          <div className="animate-float">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-3xl shadow-2xl flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform duration-300">
              <HomeOutlined className="text-white text-5xl" />
            </div>
          </div>

          <div className="text-center space-y-3">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
              RealEstate Pro
            </h1>
            <p className="text-xl text-gray-600 font-medium">{t.subtitle}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              {
                icon: "🏠",
                label: lang === "bn" ? "সম্পত্তি তালিকা" : "Property Listings",
              },
              {
                icon: "📊",
                label: lang === "bn" ? "বাজার বিশ্লেষণ" : "Market Analytics",
              },
              {
                icon: "🤝",
                label:
                  lang === "bn"
                    ? "ক্লায়েন্ট ব্যবস্থাপনা"
                    : "Client Management",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg text-center hover:scale-105 transition-transform"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-sm text-gray-700 font-medium">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 w-full max-w-md">
            {[
              {
                icon: "💰",
                feature: lang === "bn" ? "মূল্য নির্ধারণ" : "Valuation",
              },
              {
                icon: "📅",
                feature: lang === "bn" ? "ভিজিট সিডিউল" : "Visit Scheduling",
              },
              {
                icon: "📷",
                feature: lang === "bn" ? "ভার্চুয়াল ট্যুর" : "Virtual Tours",
              },
              {
                icon: "📈",
                feature:
                  lang === "bn" ? "বিনিয়োগ বিশ্লেষণ" : "Investment Analysis",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl p-3 shadow-sm"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs text-gray-600 font-medium">
                  {item.feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="slide-in-right">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-blue-100">
            {/* Language Toggle */}
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setLang(lang === "bn" ? "en" : "bn")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors text-blue-700 font-medium"
              >
                <GlobalOutlined />
                <span>{lang === "bn" ? "EN" : "BN"}</span>
              </button>
            </div>

            {/* Logo for Mobile */}
            <div className="md:hidden flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-2xl shadow-xl flex items-center justify-center">
                <HomeOutlined className="text-white text-3xl" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {t.login}
              </h2>
              <p className="text-gray-500">{t.helpText}</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <span className="text-red-500 text-xl">⚠️</span>
                <div className="flex-1">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
                <button
                  onClick={() => setError("")}
                  className="text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-6">
              {/* User ID Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t.userID}
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600">
                    <UserOutlined className="text-lg" />
                  </div>
                  <input
                    type="text"
                    value={formData.loginID}
                    onChange={(e) =>
                      handleInputChange("loginID", e.target.value)
                    }
                    onBlur={() => handleBlur("loginID")}
                    placeholder={t.loginIDPlaceholder}
                    disabled={loading}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                {touched.loginID && !formData.loginID && (
                  <p className="text-red-500 text-sm mt-1">{t.required}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t.password}
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600">
                    <LockOutlined className="text-lg" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    onBlur={() => handleBlur("password")}
                    placeholder={t.passwordPlaceholder}
                    disabled={loading}
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeInvisibleOutlined className="text-lg" />
                    ) : (
                      <EyeOutlined className="text-lg" />
                    )}
                  </button>
                </div>
                {touched.password && !formData.password && (
                  <p className="text-red-500 text-sm mt-1">{t.required}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{t.loggingIn}</span>
                  </div>
                ) : (
                  <span className="text-lg">{t.login}</span>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-500 text-sm">
                {lang === "bn"
                  ? "আপনার ইউজার আইডি এবং পাসওয়ার্ড ব্যবহার করুন"
                  : "Use your user ID and password to access the portal"}
              </p>
              <p className="text-gray-400 text-xs mt-2">
                © 2025 RealEstate Pro. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}