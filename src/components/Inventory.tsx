import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Package } from 'lucide-react';

export default function ItemDisplay() {
  const [items, setItems] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch items from backend
  useEffect(() => {
    axios
      .get('http://localhost:3000/items')
      .then((res) => {
        console.log('✅ Items fetched:', res.data);
        setItems(res.data);
      })
      .catch((err) => console.error('❌ Fetch error:', err.message));
  }, []);

  // Smooth scroll handlers
  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -600, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 600, behavior: 'smooth' });

  return (
    <div className="relative bg-gray-50 py-10">
      <h2 className="text-2xl font-bold text-center text-[#003366] mb-6">
        Inventory Components
      </h2>

      {/* Scroll Buttons */}
      <button
        onClick={scrollLeft}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#003366] text-white p-3 rounded-full shadow hover:bg-[#004080]"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 px-12 scroll-smooth scrollbar-hide"
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="min-w-[280px] max-w-[280px] bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center justify-center border border-gray-100"
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
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#003366] text-white p-3 rounded-full shadow hover:bg-[#004080]"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
