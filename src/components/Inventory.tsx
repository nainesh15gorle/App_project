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
      .get('https://sheetdb.io/api/v1/64y33c32syqox')
      .then((res) => {
        console.log('✅ Items fetched:', res.data);
        setItems(res.data);
      })
      .catch((err) => console.error('❌ Fetch error:', err.message));
  }, []);

  // Smooth scroll logic
  const scrollByAmount = () => {
    const container = scrollRef.current;
    if (!container) return 0;
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

  // ✅ Filter + Alphabetical Sort
  const filteredItems = items
    .filter((item) =>
      item.COMPONENTS?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      a.COMPONENTS.toLowerCase().localeCompare(b.COMPONENTS.toLowerCase())
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

      {/* Grid Container */}
      <div
        ref={scrollRef}
        className="grid grid-cols-3 gap-4 overflow-x-auto px-4 sm:px-8 md:px-12 pb-4 scroll-smooth scrollbar-hide"
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
              Quantity:{' '}
              <span className="font-medium text-[#003366]">
                {item.QUANTITY}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}