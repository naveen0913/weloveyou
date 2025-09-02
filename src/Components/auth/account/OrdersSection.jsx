import React, { useEffect, useState } from 'react';
import { ChevronDown, ShoppingBag, Truck } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ViewOrder from './ViewOrder';
import ViewTracking from './ViewTracking';

const OrdersSection = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 6 months');
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const accountId = user?.accountDetails?.id;
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [navType,setNavType] = useState('');


  const fetchOrders = async () => {
    try {

      const ordersRes = await axios.get(
        `http://localhost:8081/api/order/account/${accountId}`,
      );
      if (ordersRes.data.code === 200) {
        setOrders(ordersRes.data.data);
      } else {
        setOrders([]);
      }

    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchOrders();
    }
  }, [accountId]);

  const periods = [
    'Last 6 months',
    'Last 3 months',
    'Last month',
    'Last year'
  ];

  const navigateToOrder = (id,nav) => {
    setSelectedOrderId(id);
    setNavType(nav);
  };

  const navigateToTracking = (id,nav) => {
    setSelectedOrderId(id);
    setNavType(nav);
  }

  // Handle back to orders
  const goBack = () => {
    setSelectedOrderId(null);
  };

  // If a specific order is selected → render ViewOrder
  if (selectedOrderId) {
    return navType ==='order' ? <ViewOrder data={selectedOrderId} onBack={goBack} /> : <ViewTracking data={selectedOrderId} onBack={goBack} />;
  }

  return (
    <div className="orders-container">
      <div className="orders-wrapper">
        <div className="orders-header">
          <h3 className="orders-title">My Orders</h3>

          {/* <div className="select-wrapper">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="select-period"
            >
              {periods.map((period) => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
            <ChevronDown size={16} className="select-icon" />
          </div> */}
        </div>

        {
          <div className="address-grid">
            {orders.map((order) => (
              <div key={order.id} className="address-card">
                <div className="address-card-header">
                  <div className="address-card-title">
                    <h5>
                      #{order?.orderId}
                    </h5>

                  </div>
                </div>

                <div className="address-details">
                  <p>Ordered Date: <strong>{order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "N/A"}</strong>
                  </p>
                  <p>
                    Status: <strong>{order.orderStatus}</strong>
                  </p>
                  <p>
                    Total : <strong> ₹{order.orderTotal}</strong>
                  </p>
                  <p>Estd. Delivery Date: <strong>
                    {order.deliveredAt
                      ? new Date(order.deliveredAt).toLocaleDateString()
                      : "N/A"}</strong>
                  </p>
                  <p>
                    City : <strong> {order?.userAddress?.city}</strong>
                  </p>
                  <p>Phone: <strong>{order?.userAddress?.phone}</strong></p>
                </div>

                <hr />
                <div className="order-actions mt-2">
                  <div className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => navigateToOrder(order.orderId,'order')}
                    >
                      <i className='pi pi-eye' style={{ fontSize: "1rem" }}></i>
                      <span>View</span>
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => navigateToTracking(order.orderId,'tracking')}

                    >
                      <Truck size={14} />
                      <span>Tracking</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        }

        {orders.length == 0 && (
          <div className="empty-state">
            <div className="empty-icon-box">
              <ShoppingBag size={64} className="empty-icon" />
              <h2 className="empty-title">No orders placed</h2>
              <p className="empty-text">You have items in your Cart waiting to be yours!</p>
            </div>
            <Link to="/products">
              <button className="wishlist-btn" >Order Now</button>
            </Link>
          </div>
        )}

      </div>
    </div>

  );
};

export default OrdersSection;