import { Phone, Mail } from 'lucide-react';

export default function Header() {
  return (
    <div className="bg-gradient-to-r from-[#003366] to-[#004080] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
          <div className="flex items-center gap-4">
            <a href="mailto:eyantra@srmist.edu.in" className="flex items-center gap-1 hover:text-[#FFD700] transition-colors">
              <Mail size={14} />
              <span>eyantra@srmist.edu.in</span>
            </a>
          </div>
          <div className="flex items-center gap-1 hover:text-[#FFD700] transition-colors">
            <Phone size={14} />
            <span>+91 44 2745 xxxx</span>
          </div>
        </div>
      </div>
    </div>
  );
}
