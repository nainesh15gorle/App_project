import { useState, useEffect } from 'react';
import { Search, Package, MapPin, AlertCircle } from 'lucide-react';
import { Component } from '../lib/supabase';

interface InventoryProps {
  components: Component[];
  onCheckout: (component: Component) => void;
}

export default function Inventory({ components, onCheckout }: InventoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredComponents, setFilteredComponents] = useState<Component[]>([]);

  useEffect(() => {
    const filtered = components.filter(
      (comp) =>
        comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (comp.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    );
    setFilteredComponents(filtered);
  }, [searchTerm, components]);

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-[#003366] mb-6">Component Inventory</h2>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#003366] focus:ring-2 focus:ring-[#003366] focus:ring-opacity-20 transition-all outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComponents.map((component) => (
            <div
              key={component.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
            >
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Package size={64} className="text-gray-400" />
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-[#003366] mb-2">{component.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{component.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Stock:</span>
                    <span className={`font-semibold ${
                      component.stock_quantity <= component.min_stock_level
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}>
                      {component.stock_quantity} units
                    </span>
                  </div>

                  {component.location && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin size={14} />
                      <span>{component.location}</span>
                    </div>
                  )}

                  {component.stock_quantity <= component.min_stock_level && (
                    <div className="flex items-center gap-1 text-sm text-[#FFD700] bg-yellow-50 px-2 py-1 rounded">
                      <AlertCircle size={14} />
                      <span>Low Stock Alert</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onCheckout(component)}
                  disabled={component.stock_quantity === 0}
                  className="w-full py-2 bg-[#003366] text-white rounded-lg hover:bg-[#004080] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {component.stock_quantity === 0 ? 'Out of Stock' : 'Checkout'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredComponents.length === 0 && (
          <div className="text-center py-12">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No components found</p>
          </div>
        )}
      </div>
    </div>
  );
}
