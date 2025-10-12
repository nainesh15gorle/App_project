import { useState, useEffect, useRef } from 'react';
import { supabase, Component, Transaction } from './lib/supabase';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import CheckoutModal from './components/CheckoutModal';
import Transactions from './components/Transactions';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [components, setComponents] = useState<Component[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const sectionsRef = {
    home: useRef<HTMLDivElement>(null),
    inventory: useRef<HTMLDivElement>(null),
    checkout: useRef<HTMLDivElement>(null),
    transactions: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    fetchComponents();
    fetchTransactions();
  }, []);

  const fetchComponents = async () => {
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching components:', error);
    } else {
      setComponents(data || []);
    }
  };

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('transaction_date', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      setTransactions(data || []);
    }
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

  const handleCheckoutSubmit = async (data: {
    quantity: number;
    userName: string;
    userEmail: string;
    purpose: string;
    expectedReturnDate: string;
  }) => {
    if (!selectedComponent) return;

    const { error: transactionError } = await supabase.from('transactions').insert({
      component_id: selectedComponent.id,
      transaction_type: 'checkout',
      quantity: data.quantity,
      user_name: data.userName,
      user_email: data.userEmail,
      purpose: data.purpose,
      expected_return_date: data.expectedReturnDate,
      status: 'pending',
    });

    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
      alert('Failed to checkout component. Please try again.');
      return;
    }

    const newStockQuantity = selectedComponent.stock_quantity - data.quantity;
    const { error: updateError } = await supabase
      .from('components')
      .update({ stock_quantity: newStockQuantity })
      .eq('id', selectedComponent.id);

    if (updateError) {
      console.error('Error updating stock:', updateError);
      alert('Failed to update stock. Please contact lab administrator.');
      return;
    }

    alert('Component checked out successfully!');
    fetchComponents();
    fetchTransactions();
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
      <Header />
      <Navigation activeSection={activeSection} onNavigate={handleNavigate} />

      <div ref={sectionsRef.home}>
        <Hero onNavigate={handleNavigate} />
      </div>

      <Dashboard stats={calculateStats()} />

      <div ref={sectionsRef.inventory}>
        <Inventory components={components} onCheckout={handleCheckout} />
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
