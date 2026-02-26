import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import Hero from "./components/Hero";
import BorrowReturnForm from "./components/BorrowForm";
import Inventory from "./components/Inventory";
import Transactions from "./components/Transactions";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

const AppContent: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/home"
              className="flex items-center gap-3 min-w-0"
              onClick={() => setIsNavOpen(false)}
            >
              <img
                src="https://res.cloudinary.com/drcewb1ot/image/upload/v1768457377/srm-logo-CN5t8uGG_jiilzz.png"
                alt="SRM Logo"
                className="w-24 h-auto flex-shrink-0"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8 text-[#003366] font-medium">
              <Link to="/home" className="hover:text-blue-700">
                Home
              </Link>
              <Link to="/inventory" className="hover:text-blue-700">
                Inventory
              </Link>
              <Link to="/dashboard" className="hover:text-blue-700">
                Borrow/Return
              </Link>
              <Link to="/transactions" className="hover:text-blue-700">
                Transactions History
              </Link>
              <Link to="/contact" className="hover:text-blue-700">
                Contact
              </Link>
            </div>

            {/* Mobile Button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-[#003366] hover:bg-gray-100"
              onClick={() => setIsNavOpen((prev) => !prev)}
            >
              <span className="block w-5 h-0.5 bg-current mb-1 rounded" />
              <span className="block w-5 h-0.5 bg-current mb-1 rounded" />
              <span className="block w-5 h-0.5 bg-current rounded" />
            </button>
          </div>

          {/* Mobile Nav */}
          {isNavOpen && (
            <div className="md:hidden pb-3 border-t border-white/20 bg-white/10 backdrop-blur-xl">
              <div className="flex flex-col gap-1 pt-3 text-[#003366] font-medium">
                <Link
                  to="/home"
                  className="px-2 py-2 rounded hover:bg-gray-100"
                  onClick={() => setIsNavOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/inventory"
                  className="px-2 py-2 rounded hover:bg-gray-100"
                  onClick={() => setIsNavOpen(false)}
                >
                  Inventory
                </Link>
                <Link
                  to="/dashboard"
                  className="px-2 py-2 rounded hover:bg-gray-100"
                  onClick={() => setIsNavOpen(false)}
                >
                  Borrow/Return
                </Link>
                <Link
                  to="/transactions"
                  className="px-2 py-2 rounded hover:bg-gray-100"
                  onClick={() => setIsNavOpen(false)}
                >
                  Transactions History
                </Link>
                <Link
                  to="/contact"
                  className="px-2 py-2 rounded hover:bg-gray-100"
                  onClick={() => setIsNavOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/home" element={<Hero />} />
        <Route path="/dashboard" element={<BorrowReturnForm />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      {/* Footer */}
      <Footer />
    </>
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
