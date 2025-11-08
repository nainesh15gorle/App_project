import { useEffect, useState } from 'react';
import { Package, CheckCircle, AlertTriangle, Archive } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  delay: number;
}

function StatCard({ title, value, icon, color, delay }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    let interval: NodeJS.Timeout;

    const timer = setTimeout(() => {
      interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);
    }, delay);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [value, delay]);

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4 transform hover:-translate-y-1"
      style={{ borderLeftColor: color, animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-[#003366] mt-2">{displayValue}</p>
        </div>
        <div
          className="p-4 rounded-full"
          style={{ backgroundColor: `rgba(${hexToRgb(color)}, 0.1)` }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

// Utility: Convert hex color to RGB
function hexToRgb(hex: string) {
  const match = hex.replace('#', '').match(/.{1,2}/g);
  if (!match) return '0,0,0';
  const [r, g, b] = match.map((x) => parseInt(x, 16));
  return `${r},${g},${b}`;
}

interface DashboardProps {
  stats?: {
    total: number;
    available: number;
    checkedOut: number;
    lowStock: number;
  };
}

export default function Dashboard({
  stats = { total: 0, available: 0, checkedOut: 0, lowStock: 0 },
}: DashboardProps) {
  return (
    <div className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#003366] mb-3">
            Inventory Overview
          </h2>
          <p className="text-gray-600">Real-time statistics of lab components</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Components"
            value={stats.total}
            icon={<Package size={28} className="text-[#003366]" />}
            color="#003366"
            delay={0}
          />
          <StatCard
            title="Available Stock"
            value={stats.available}
            icon={<CheckCircle size={28} className="text-green-600" />}
            color="#10b981"
            delay={100}
          />
          <StatCard
            title="Checked Out"
            value={stats.checkedOut}
            icon={<Archive size={28} className="text-blue-600" />}
            color="#3b82f6"
            delay={200}
          />
          <StatCard
            title="Low Stock Items"
            value={stats.lowStock}
            icon={<AlertTriangle size={28} className="text-[#FFD700]" />}
            color="#FFD700"
            delay={300}
          />
        </div>
      </div>
    </div>
  );
}
