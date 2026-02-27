import { ArrowRight, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative bg-gradient-to-br from-[#001a33] via-[#00264d] to-[#001a33] text-white overflow-hidden">

      {/* Background Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Startup Logo Glow */}
      <div className="absolute right-20 top-28 w-[420px] h-[420px] hidden lg:block">

        {/* Animated Halo */}
        <div className="absolute inset-0 rounded-full 
          bg-gradient-to-r from-blue-500/30 to-indigo-500/30 
          blur-3xl animate-pulse">
        </div>

        {/* Logo Card */}
        <div className="relative rounded-3xl 
          bg-white/5 backdrop-blur-xl 
          border border-white/10
          p-8 
          shadow-[0_0_60px_rgba(59,130,246,0.5)]
          transition-all duration-500 
          hover:shadow-[0_0_100px_rgba(59,130,246,0.8)]
          hover:scale-105"
        >
          <img
            src="https://res.cloudinary.com/drcewb1ot/image/upload/v1768458362/logo_kcf8rw.png"
            alt="Spatial Computing Lab logo"
            className="w-full h-full rounded-2xl object-contain"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          <div className="flex-1 text-center lg:text-left">

            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm mb-8 backdrop-blur-md">
              <Bot size={18} className="text-blue-400" />
              <span className="text-gray-300">
                Next-Gen Robotics Infrastructure
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Spatial Computing Lab
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Inventory Platform
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-gray-300 mb-10 max-w-xl">
              A scalable, intelligent component tracking system built for robotics
              innovation teams. Real-time stock visibility. Seamless checkout.
              Enterprise-ready architecture.
            </p>

            {/* Primary Button Only */}
            <div className="flex justify-center lg:justify-start">

              <button
                onClick={() => navigate("/inventory")}
                className="px-10 py-4 bg-[#FFD700] text-[#001a33] rounded-xl font-semibold 
                transition-all duration-300
                hover:bg-yellow-500 hover:scale-105
                shadow-[0_0_20px_rgba(255,215,0,0.6)]
                flex items-center justify-center gap-2 group"
              >
                Browse Inventory
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}