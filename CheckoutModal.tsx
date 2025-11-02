import { useState } from 'react';
import { X } from 'lucide-react';

// Define Component interface locally
interface Component {
  id: number;
  name: string;
  description: string | null;
  category_id: string | null;
  stock_quantity: number;
  min_stock_level: number;
  unit_price: number;
  location: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface CheckoutModalProps {
  component: Component | null;
  onClose: () => void;
  onSubmit: (data: {
    quantity: number;
    userName: string;
    userEmail: string;
    purpose: string;
    expectedReturnDate: string;
  }) => void;
}

export default function CheckoutModal({ component, onClose, onSubmit }: CheckoutModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [purpose, setPurpose] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');

  if (!component) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ quantity, userName, userEmail, purpose, expectedReturnDate });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold text-[#003366]">Checkout Component</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Component
            </label>
            <input
              type="text"
              value={component.name}
              disabled
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max={component.stock_quantity}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#003366] focus:ring-2 focus:ring-[#003366] focus:ring-opacity-20 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Available: {component.stock_quantity}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#003366] focus:ring-2 focus:ring-[#003366] focus:ring-opacity-20 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#003366] focus:ring-2 focus:ring-[#003366] focus:ring-opacity-20 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purpose <span className="text-red-500">*</span>
            </label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#003366] focus:ring-2 focus:ring-[#003366] focus:ring-opacity-20 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Return Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={expectedReturnDate}
              onChange={(e) => setExpectedReturnDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#003366] focus:ring-2 focus:ring-[#003366] focus:ring-opacity-20 outline-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#004080] transition-colors font-medium"
            >
              Confirm Checkout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
