import React, { useState } from "react";
import { signInWithPopup, signOut, User } from "firebase/auth";
import { auth, provider } from "../firebase";
import { LogIn, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (): Promise<void> => {
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email ?? "";

      if (!email.endsWith("@srmist.edu.in")) {
        await signOut(auth);
        alert("Only @srmist.edu.in accounts are allowed.");
        return;
      }

      setUser(result.user);

      // Redirect to dashboard with username
      navigate("/dashboard", { state: { name: result.user.displayName } });
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check console for details.");
    }
  };

  const handleLogout = async (): Promise<void> => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#003366] via-[#004080] to-[#003366] text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#FFD700] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
      </div>

      {/* Card */}
      <div className="relative bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-10 w-full max-w-md shadow-2xl border border-white border-opacity-20 text-center">
        <h1 className="text-3xl font-bold mb-2 text-[#FFD700]">SRM E-Yantra</h1>
        <p className="text-gray-200 mb-8">Inventory Management Login</p>

        {!user ? (
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-[#FFD700] text-[#003366] font-semibold py-3 rounded-lg hover:bg-yellow-500 transition-all duration-300 shadow-md"
          >
            <LogIn size={20} />
            Sign in with Google (@srmist.edu.in)
          </button>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-20 h-20 rounded-full border-4 border-[#FFD700]"
              />
            )}
            <h3 className="text-2xl font-semibold">{user.displayName}</h3>
            <p className="text-gray-300">{user.email}</p>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
