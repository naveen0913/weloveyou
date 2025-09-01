import React, { useState } from 'react';
import AccountSidebar from './AccountSidebar';
import AccountContent from './AccountContent';
import './accountstyles.css';


const AccountLayout = () => {
  const [activeSection, setActiveSection] = useState('orders');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setIsMobileSidebarOpen(false);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="layout-container">
      <div className="layout-wrapper">
        {/* Desktop Sidebar */}
        <div className="sidebar-desktop">
          <AccountSidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div className="sidebar-overlay">
            <div className="sidebar-mobile">
              <div className="sidebar-mobile-header">
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="close-btn"
                >
                  ✕
                </button>
              </div>
              <AccountSidebar
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
              />
            </div>
          </div>
        )}

        {/* Mobile Sidebar Toggle Button */}
        <button onClick={toggleMobileSidebar} className="sidebar-toggle-btn">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>

        {/* Main Content */}
        <main className="main-content">
          <AccountContent activeSection={activeSection} />
        </main>
      </div>
    </div>
  );
};

export default AccountLayout;