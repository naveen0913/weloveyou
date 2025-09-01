import React from 'react';
import AddressBook from './AddressBook';
import OrdersSection from './OrdersSection';
import './accountstyles.css';
import AccountProfile from './AccountProfile';
import ViewOrder from './ViewOrder';

const AccountContent = ({ activeSection }) => {



  const renderContent = () => {
    switch (activeSection) {
      case 'orders':
        return <OrdersSection />;
      case 'address-book':
        return <AddressBook />;
      case 'wallet':
        return (
          <div className="wallet-container">
            <div className="wallet-inner">
              <h1 className="wallet-title"> Wallet</h1>
              <div className="wallet-card">
                <div className="wallet-content">
                  <div className="wallet-icon">
                    <svg className="wallet-svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="wallet-subtitle">Wallet Balance</h2>
                  <p className="wallet-balance">₹0</p>
                  <p className="wallet-desc">Add money to your wallet for faster checkout</p>
                  <button className="wallet-btn">Add Money</button>
                </div>
              </div>
            </div>
          </div>

        );
      case 'tracking':
        return (
          <div class="orders-tracking-container">
            <div class="orders-tracking-wrapper">
              <h3 class="orders-title">Orders Tracking</h3>
              <div class="orders-card">
              <h1 className='m-auto'>
              No Tracking Yet</h1> 
              </div>
            </div>
          </div>

        );
      case 'rewards':
        return (
          <div className="rewards-container">
            <div className="rewards-wrapper">
              <h1 className="rewards-title">My Rewards</h1>
              <div className="rewards-grid">
                <div className="reward-card">
                  <h3 className="reward-card-title">SuperCash Balance</h3>
                  <p className="reward-card-value orange">₹0</p>
                  <p className="reward-card-text">Earn SuperCash on every purchase</p>
                </div>
                <div className="reward-card">
                  <h3 className="reward-card-title">Loyalty Points</h3>
                  <p className="reward-card-value purple">0</p>
                  <p className="reward-card-text">Collect points and unlock exclusive rewards</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'customer-care':
        return (
          <div className="w-full p-4 lg:p-8">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Customer Care</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Options</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Call Us</p>
                        <p className="text-sm text-gray-600">1800-123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Email Support</p>
                        <p className="text-sm text-gray-600">support@ajio.com</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Help</h3>
                  <div className="space-y-3">
                    <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">Track Your Order</a>
                    <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">Return & Exchange</a>
                    <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">Size Guide</a>
                    <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">Payment Issues</a>
                    <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">FAQ</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'personal-info':
        return (
          <AccountProfile/>
        );
      case 'payments':
        return (
          <div className="payment-container">
            <div className="payment-wrapper">
              <h3 className="payment-title">Saved Payment Methods</h3>

              <div className="payment-actions">
                <button className="add-payment-btn">Add New Payment Method</button>

                <div className="payment-card">
                  <div className="payment-empty">
                    <div className="payment-icon">
                      <svg
                        className="icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path
                          fillRule="evenodd"
                          d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h2 className="empty-title">No Payment Methods</h2>
                    <p className="empty-text">
                      Add your cards or digital wallets for faster checkout
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        );
      default:
        return <AddressBook />;
    }
  };

  return renderContent();
};

export default AccountContent;