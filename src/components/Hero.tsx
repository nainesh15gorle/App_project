import { ArrowRight, Bot, Package } from 'lucide-react';

interface HeroProps {
  onNavigate: (section: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <div className="relative bg-gradient-to-br from-[#003366] via-[#004080] to-[#003366] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#FFD700] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 rounded-full text-sm mb-6 backdrop-blur-sm">
              <Bot size={20} className="text-[#FFD700]" />
              <span>Empowering Innovation through Robotics</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              SRM E-Yantra Lab
              <br />
              <span className="text-[#FFD700]">Inventory Management</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
              Streamlined component tracking and checkout system for robotics research
              and development. Access thousands of components for your next innovation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={() => onNavigate('inventory')}
                className="px-8 py-3 bg-[#FFD700] text-[#003366] rounded-lg hover:bg-yellow-400 transition-all duration-300 font-semibold flex items-center justify-center gap-2 group"
              >
                Browse Inventory
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-8 py-3 bg-white bg-opacity-10 backdrop-blur-sm border-2 border-white border-opacity-30 rounded-lg hover:bg-opacity-20 transition-all duration-300 font-semibold"
              >
                Contact Us
              </button>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-[#FFD700] rounded-3xl opacity-20 blur-2xl"></div>
              <div className="relative bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
                    <Package size={32} className="text-[#FFD700] mb-2" />
                    <p className="text-2xl font-bold">500+</p>
                    <p className="text-sm text-gray-300">Components</p>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
                    <Bot size={32} className="text-[#FFD700] mb-2" />
                    <p className="text-2xl font-bold">50+</p>
                    <p className="text-sm text-gray-300">Active Projects</p>
                  </div>
                  <div className="col-span-2 bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-lg font-semibold mb-2">Latest Activity</p>
                    <p className="text-sm text-gray-300">
                      Arduino Uno R3 checked out by Team Alpha
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
}
