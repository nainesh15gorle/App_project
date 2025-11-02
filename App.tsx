import { useState, useRef } from 'react';

import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import CheckoutModal from './components/CheckoutModal';
import Transactions from './components/Transactions';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Define types locally
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

interface Transaction {
  id: number;
  component_id: number;
  transaction_type: 'checkout' | 'return';
  quantity: number;
  user_name: string;
  user_email: string;
  purpose: string | null;
  transaction_date: string;
  expected_return_date: string | null;
  actual_return_date: string | null;
  status: 'pending' | 'completed' | 'overdue';
  created_at: string;
}

// Mock data for components
const mockComponents: Component[] = [
  {
    id: 1,
    name: 'Resistor 10kΩ',
    description: '10k ohm resistor',
    category_id: '1',
    stock_quantity: 100,
    min_stock_level: 10,
    unit_price: 0.1,
    location: 'Shelf A1',
    image_url: null,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Capacitor 10μF',
    description: '10 microfarad capacitor',
    category_id: '1',
    stock_quantity: 50,
    min_stock_level: 5,
    unit_price: 0.2,
    location: 'Shelf A2',
    image_url: null,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 3,
    name: 'Arduino Uno',
    description: 'Microcontroller board',
    category_id: '2',
    stock_quantity: 20,
    min_stock_level: 2,
    unit_price: 20.0,
    location: 'Shelf B1',
    image_url: null,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
];

// Mock data for transactions
const mockTransactions: Transaction[] = [
  {
    id: 1,
    component_id: 1,
    transaction_type: 'checkout',
    quantity: 5,
    user_name: 'John Doe',
    user_email: 'john@example.com',
    purpose: 'Project X',
    transaction_date: '2023-11-15T10:00:00Z',
    expected_return_date: '2023-12-01',
    actual_return_date: null,
    status: 'pending',
    created_at: '2023-11-15T10:00:00Z',
  },
  {
    id: 2,
    component_id: 2,
    transaction_type: 'checkout',
    quantity: 2,
    user_name: 'Jane Smith',
    user_email: 'jane@example.com',
    purpose: 'Lab Experiment',
    transaction_date: '2023-11-10T14:30:00Z',
    expected_return_date: '2023-11-30',
    actual_return_date: '2023-11-25T10:00:00Z',
    status: 'completed',
    created_at: '2023-11-10T14:30:00Z',
  },
];

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [components, setComponents] = useState(mockComponents);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const sectionsRef = {
    home: useRef<HTMLDivElement>(null),
    inventory: useRef<HTMLDivElement>(null),
    checkout: useRef<HTMLDivElement>(null),
    transactions: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  };

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    const ref = sectionsRef[section as keyof typeof sectionsRef];
    if (ref?.current) {
      const navHeight = 80;
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleCheckout = (component: Component) => {
    setSelectedComponent(component);
    setIsCheckoutModalOpen(true);
  };

  const handleCheckoutSubmit = (data: {
    quantity: number;
    userName: string;
    userEmail: string;
    purpose: string;
    expectedReturnDate: string;
  }) => {
    if (!selectedComponent) return;

    const newTransaction: Transaction = {
      id: Math.max(...transactions.map(t => t.id)) + 1,
      component_id: selectedComponent.id,
      transaction_type: 'checkout',
      quantity: data.quantity,
      user_name: data.userName,
      user_email: data.userEmail,
      purpose: data.purpose,
      transaction_date: new Date().toISOString(),
      expected_return_date: data.expectedReturnDate,
      actual_return_date: null,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    const updatedComponents = components.map(component =>
      component.id === selectedComponent.id
        ? { ...component, stock_quantity: component.stock_quantity - data.quantity }
        : component
    );

    setTransactions([...transactions, newTransaction]);
    setComponents(updatedComponents);

    alert('Component checked out successfully!');
    setIsCheckoutModalOpen(false);
    setSelectedComponent(null);
  };

  const calculateStats = () => {
    const total = components.length;
    const available = components.filter((c) => c.stock_quantity > 0).length;
    const checkedOut = transactions.filter((t) => t.status === 'pending').length;
    const lowStock = components.filter(
      (c) => c.stock_quantity <= c.min_stock_level && c.stock_quantity > 0
    ).length;

    return { total, available, checkedOut, lowStock };
  };

  return (
    <div className="min-h-screen bg-gray-50">
       {/* No user/onLogout props */}
      <Navigation activeSection={activeSection} onNavigate={handleNavigate} />

      <div ref={sectionsRef.home}>
        <Hero onNavigate={handleNavigate} />
      </div>

      <Dashboard stats={calculateStats()} />

      <div ref={sectionsRef.inventory}>
        <Inventory components ={components} onCheckout={handleCheckout} />
      </div>

      <div ref={sectionsRef.transactions}>
        <Transactions transactions={transactions} components={components} />
      </div>

      <div ref={sectionsRef.contact}>
        <Contact />
      </div>

      <Footer onNavigate={handleNavigate} />

      {isCheckoutModalOpen && (
        <CheckoutModal
          component={selectedComponent}
          onClose={() => {
            setIsCheckoutModalOpen(false);
            setSelectedComponent(null);
          }}
          onSubmit={handleCheckoutSubmit}
        />
      )}
    </div>
  );
}

export default App;
