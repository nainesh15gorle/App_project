import { ArrowRight, Bot, Package, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";

export default function Hero() {
  const navigate = useNavigate();



  return (
    <div className="relative bg-gradient-to-br from-[#003366] via-[#004080] to-[#003366] text-white overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#FFD700] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
      </div>




      {/* Hero logo with animated glow */}
      <div
        className="absolute right-8 mr-20 rounded-3xl hero-logo-glow"
        style={{ width: "400px", height: "400px", top: "120px" }}
      >
        <img
          src="https://res.cloudinary.com/drcewb1ot/image/upload/v1768458362/logo_kcf8rw.png"
          alt="Spatial Computing Lab logo"
          className="w-full h-full rounded-3xl object-contain"
        />
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">

            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-950 bg-opacity-10 rounded-full text-sm mb-6 backdrop-blur-sm">
              <Bot size={20} className="text-[#FFD700]" />
              <span>Empowering Innovation through Robotics</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Spatial Computing Lab
              <br />
              <span className="text-[#FFD700]">Inventory Management</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
              Streamlined component tracking and checkout system for robotics research
              and development. Access thousands of components for your next innovation.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={() => navigate("/inventory")}
                className="px-8 py-3 bg-[#FFD700] text-[#003366] rounded-lg hover:bg-yellow-500 transition-all duration-300 font-semibold flex items-center justify-center gap-2 group"
              >
                Browse Inventory
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate("/contact")}
                className="px-8 py-3 bg-indigo-950 cursor-pointer bg-opacity-10 backdrop-blur-sm border-2 border-white border-opacity-30 rounded-lg hover:bg-opacity-20 transition-all duration-300 font-semibold"
              >
                Contact Us
              </button>


            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
