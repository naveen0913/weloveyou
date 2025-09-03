import React from 'react';
import { Package, Wallet,Truck, UserPlus, Gift, HelpCircle, User, MapPin, CreditCard, KeyRound } from 'lucide-react';

const AccountSidebar = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    {
      category: 'Orders',
      items: [
        { id: 'orders', label: 'Orders', icon: Package },
        // { id: 'wallet', label: 'Wallet', icon: Wallet, badge: 'New' },
        // { id: 'tracking', label: 'Tracking', icon: Truck },
      ]
    },

    {
      category: 'Profile',
      items: [
        { id: 'personal-info', label: 'My profile', icon: User },
        { id: 'address-book', label: 'Address Book', icon: MapPin },
        // { id: 'payments', label: 'Payments', icon: CreditCard }
        // { id: 'change-password', label: 'Update Password', icon: KeyRound },
      ]
    }
  ];

  return (
    <div className="account-sidebar">
      <h2 className="sidebar-title">My Account</h2>

      {menuItems.map((category, categoryIndex) => (
        <div key={categoryIndex} className="category-block">
          <h3 className="category-heading">{category.category}</h3>

          <div className="menu-items">
            {category.items.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`menu-item ${isActive ? "active" : ""}`}
                >
                  <div className="item-flex">
                    <div className="item-left">
                      <IconComponent
                        size={18}
                        className={`item-icon ${isActive ? "active-icon" : ""}`}
                      />
                      <div>
                        <div className="item-label-wrapper">
                          <span className={`item-label ${isActive ? "active-label" : ""}`}>
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className="badge">{item.badge}</span>
                          )}
                        </div>
                        {item.subtitle && (
                          <p className="item-subtitle">{item.subtitle}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>

  );
};

export default AccountSidebar;