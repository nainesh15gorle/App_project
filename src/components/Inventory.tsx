import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Package } from 'lucide-react';

export default function ItemDisplay() {
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch items from backend
  useEffect(() => {
    axios
      .get('http://localhost:3000/items') // Change to your backend URL if different
      .then((res) => {
        console.log('✅ Items fetched:', res.data);
        setItems(res.data);
      })
      .catch((err) => console.error('❌ Fetch error:', err.message));
  }, []);

  // Smooth, responsive scroll handlers
  const scrollByAmount = () => {
    const container = scrollRef.current;
    if (!container) return 0;
    // Scroll by ~80% of the visible width for a smoother experience
    return container.clientWidth * 0.8;
  };

  const scrollLeft = () => {
    const amount = scrollByAmount();
    if (amount) {
      scrollRef.current?.scrollBy({ left: -amount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const amount = scrollByAmount();
    if (amount) {
      scrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Filter items based on search term
  const filteredItems = items.filter((item) =>
    item.COMPONENTS?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative bg-gray-50 py-10 overflow-x-hidden">
      <h2 className="text-2xl font-bold text-center text-[#003366] mb-4">
        Inventory Components
      </h2>

      {/* Search Bar */}
      <div className="flex justify-center mb-6 px-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search components..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent"
        />
      </div>

      {/* Scroll Buttons - visible on tablet/desktop, mobile uses swipe */}
      <button
        onClick={scrollLeft}
        className="hidden md:flex items-center justify-center absolute left-4 top-1/2 -translate-y-1/2 bg-[#003366] text-white p-3 rounded-full shadow hover:bg-[#004080]"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 px-4 sm:px-8 md:px-12 pb-4 scroll-smooth scrollbar-hide"
      >
        {filteredItems.map((item, i) => (
          <div
            key={i}
            className="min-w-[220px] sm:min-w-[260px] md:min-w-[280px] max-w-xs bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 flex flex-col items-center justify-center border border-gray-100"
          >
            <div className="bg-[#003366]/10 p-4 rounded-full mb-4">
              <Package size={40} className="text-[#003366]" />
            </div>
            <h3 className="text-lg font-semibold text-[#003366] text-center">
              {item.COMPONENTS}
            </h3>
            <p className="text-sm text-gray-700 mt-3">
              Quantity: <span className="font-medium text-[#003366]">{item.QUANTITY}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Right Scroll Button */}
      <button
        onClick={scrollRight}
        className="hidden md:flex items-center justify-center absolute right-4 top-1/2 -translate-y-1/2 bg-[#003366] text-white p-3 rounded-full shadow hover:bg-[#004080]"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
