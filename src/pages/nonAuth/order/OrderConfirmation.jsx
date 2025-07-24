import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../common/context/AuthProvider";
import { URL } from "../../../service/api";

function OrderConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!state?.orderId || !user) {
      navigate("/");
      return;
    }

    const fetchOrder = async () => {
      try {
        const { data: userData } = await axios.get(`${URL}/users/${user.id}`);
        const foundOrder = userData.orders?.find(o => o.id === state.orderId);
        
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [state, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-medium text-gray-800 mt-4">Order not found</h2>
          <button 
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 mt-2">Thank you for your purchase</p>
          <p className="text-sm text-gray-500 mt-2">Order #{order.id}</p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8 border-b">
            <div className="flex flex-col sm:flex-row justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {order.orderStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {order.items.map((item, index) => (
              <div key={index} className="p-6 sm:p-8 flex flex-col sm:flex-row">
                <div className="flex-shrink-0">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 rounded-md object-cover border border-gray-200"
                  />
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                    <p className="text-base font-medium text-gray-900 ml-4">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Size: {item.size}</p>
                  <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</p>
                  <p className="mt-1 text-sm text-gray-500">Price: ₹{item.price.toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 sm:p-8 bg-gray-50">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Total</p>
              <p>₹{order.totalAmount.toFixed(2)}</p>
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                We've sent your order confirmation and receipt to {user?.email || 'your email'}.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View All Orders
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;