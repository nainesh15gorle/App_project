import { Bot, Mail, Phone } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-[#003366] to-[#004080] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Bot className="text-[#FFD700]" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">SRM E-Yantra Lab</h3>
                <p className="text-sm text-gray-300">Inventory System</p>
              </div>
            </div>
            <p className="text-sm text-gray-300">
              Empowering innovation through robotics and embedded systems education.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#FFD700] transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('inventory')}
                  className="hover:text-[#FFD700] transition-colors"
                >
                  Inventory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('transactions')}
                  className="hover:text-[#FFD700] transition-colors"
                >
                  Transactions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#FFD700] transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Contact Info</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <a
                  href="mailto:eyantra@srmist.edu.in"
                  className="hover:text-[#FFD700] transition-colors"
                >
                  eyantra@srmist.edu.in
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>+91 44 2745 xxxx</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white border-opacity-20 text-center text-sm text-gray-300">
          <p>© {currentYear} SRM E-Yantra Lab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
