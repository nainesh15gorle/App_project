import { Transaction, Component } from '../lib/supabase';
import { Clock, User, Package, Calendar, CheckCircle, XCircle } from 'lucide-react';

interface TransactionsProps {
  transactions: Transaction[];
  components: Component[];
}

export default function Transactions({ transactions, components }: TransactionsProps) {
  const getComponentName = (componentId: string) => {
    const component = components.find((c) => c.id === componentId);
    return component?.name || 'Unknown Component';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} />;
      case 'overdue':
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-[#003366] mb-8">Transaction History</h2>

        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl">
              <Clock size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No transactions yet</p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border-l-4"
                style={{
                  borderLeftColor:
                    transaction.transaction_type === 'checkout' ? '#3b82f6' : '#10b981',
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Package size={20} className="text-[#003366]" />
                      <h3 className="text-lg font-bold text-[#003366]">
                        {getComponentName(transaction.component_id)}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.transaction_type === 'checkout'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {transaction.transaction_type.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>{transaction.user_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Quantity:</span>
                        <span>{transaction.quantity} units</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{new Date(transaction.transaction_date).toLocaleDateString()}</span>
                      </div>
                      {transaction.expected_return_date && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Expected Return:</span>
                          <span>
                            {new Date(transaction.expected_return_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {transaction.purpose && (
                      <p className="mt-3 text-sm text-gray-600">
                        <span className="font-medium">Purpose:</span> {transaction.purpose}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {getStatusIcon(transaction.status)}
                      {transaction.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
