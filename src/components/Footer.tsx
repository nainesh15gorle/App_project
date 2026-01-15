import { Bot, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-[#003366] to-[#004080] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* SRM Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="https://res.cloudinary.com/drcewb1ot/image/upload/v1768457377/srm-logo-CN5t8uGG_jiilzz.png"
                alt="SRM Institute of Science and Technology"
                className="w-15 h-10 object-contain rounded-lg bg-white bg-opacity-20 p-1"
              />
              <div>
                <h3 className="font-bold text-lg">SRM E-Yantra Lab</h3>
                <p className="text-sm text-gray-300">Inventory Management System</p>
              </div>
            </div>
            <p className="text-sm text-gray-200">
              Empowering innovation through robotics and embedded systems education.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-[#FFD700] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/inventory" className="hover:text-[#FFD700] transition-colors">
                  Inventory
                </a>
              </li>
              <li>
                <a href="/transactions" className="hover:text-[#FFD700] transition-colors">
                  Transactions
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-[#FFD700] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Lab Hours */}
<div className="flex items-center justify-end">
  <img
    src="https://res.cloudinary.com/drcewb1ot/image/upload/v1768457283/strip_kcwzi6.png"
    alt="SRM Logo"
    className="w-full max-w-[4400px] h-auto object-contain rounded-lg bg-white bg-opacity-20 p-1"
    style={{width:"608px"}}
  />
</div>

        </div>

        <div className="pt-6 border-t border-white border-opacity-20 text-center text-sm text-gray-400">
          <p>© {currentYear} SRM E-Yantra Lab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
