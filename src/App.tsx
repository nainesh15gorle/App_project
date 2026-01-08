import React, { useEffect, useState, createContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase";

import Hero from "./components/Hero";
import Dashboard from "./components/Dashboard";
import Inventory from "./components/Inventory";
import Transactions from "./components/Transactions";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import LoginPage from "./components/GoogleAuth";

// Context for global user access
export const UserContext = createContext<User | null>(null);

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser && location.pathname === "/") {
        // ✅ Redirect to home only after login
        navigate("/home");
      } else if (!firebaseUser && location.pathname !== "/") {
        // ✅ Redirect to login only after logout
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate, location]);

  return (
    <UserContext.Provider value={user}>
      {/* ✅ Navbar (only visible after login) */}
      {user && (
        <nav className="bg-white shadow-md py-3 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
            {/* Left: Logo */}
            <div className="flex items-center mr-10">
              <img
                src="/dist/assets/srm-logo-CN5t8uGG.png"
                alt="SRM Logo"
                className="w-[100px] h-auto"
              />

            </div>

            {/* Center: Navigation Links */}
            <div className="flex justify-center gap-8 text-[#003366] font-medium">
              <Link to="/home" className="hover:text-blue-700">
                Home
              </Link>
              <Link to="/inventory" className="hover:text-blue-700">
                Inventory
              </Link>
              <Link to="/dashboard" className="hover:text-blue-700">
                Dashboard
              </Link>
              <Link to="/transactions" className="hover:text-blue-700">
                Transactions
              </Link>
              <Link to="/contact" className="hover:text-blue-700">
                Contact
              </Link>
            </div>

           
          </div>
        </nav>
      )}

      {/* ✅ Routes */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Hero />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      {/* ✅ Footer only visible after login */}
      {user && <Footer />}
    </UserContext.Provider>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
