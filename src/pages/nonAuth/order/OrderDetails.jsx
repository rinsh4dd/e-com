import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../common/context/AuthProvider";
import { URL } from "../../../service/api";
import ShoeCartLoader from "../../../common/ui/Loader";

function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(
          `${URL}/users/${user.id}`
        );
        const foundOrder = data.orders?.find(
          (o) => o.id.toString() === orderId
        );

        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          setError("Order not found");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user, navigate]);

  const handleCancelOrder = async (orderId) => {
    const confirm = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirm) return;

    try {
      const updatedUser = {
        ...user,
        orders: user.orders.map((order) =>
          order.id === orderId ? { ...order, orderStatus: "cancelled" } : order
        ),
      };

      await axios.put(`${URL}/users/${user.id}`, updatedUser);

      toast.success("Order cancelled successfully");

      setOrder((prev) => ({ ...prev, orderStatus: "cancelled" }));
    } catch (error) {
      toast.error("Failed to cancel order");
      console.error("Cancel error:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const normalized = status?.toLowerCase();

    const statusClasses = {
      pending: "bg-blue-100 text-blue-800",
      processing: "bg-blue-100 text-blue-800", // treat as pending
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    const displayText = {
      pending: "Pending",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          statusClasses[normalized] || "bg-gray-100 text-gray-800"
        }`}
      >
        {displayText[normalized] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <ShoeCartLoader/>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-medium text-gray-800 mt-4">
            Error Loading Order
          </h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => navigate("/orders")}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Orders
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-2xl overflow-hidden mb-10 print:p-6 print:shadow-none print:border print:rounded-none print:mb-0">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Order #{order.id}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                {getStatusBadge(order.orderStatus)}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              Shipping Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-800">
              {/* Address */}
              <div>
                <h3 className="text-gray-500 font-medium mb-1">
                  Shipping Address
                </h3>
                <p className="leading-relaxed">
                  {user.shippingAddress?.street || "123 Main St"}
                  <br />
                  {user.shippingAddress?.city || "Anytown"},{" "}
                  {user.shippingAddress?.state || "CA"}{" "}
                  {user.shippingAddress?.zip || "12345"}
                  <br />
                  {user.shippingAddress?.country || "United States"}
                </p>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-gray-500 font-medium mb-1">
                  Contact Information
                </h3>
                <p className="leading-relaxed">
                  {user.email}
                  <br />
                  {user.phone || "Not provided"}
                </p>
              </div>
            </div>

            {/* Print Button */}
            <div className="mt-10 flex justify-end space-x-4 print:hidden">
              {/* Cancel Order - Danger Button */}
              <button
                onClick={() => handleCancelOrder(order.id)}
                className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-red-600 text-white text-sm font-medium shadow-sm hover:bg-red-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Cancel Order
              </button>

              {/* Print Order - Secondary Button */}
              <button
                onClick={() => window.print()}
                className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-white text-gray-800 border border-gray-300 text-sm font-medium hover:bg-gray-100 transition shadow-sm"
              >
                Print Order
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg mb-8">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {order.items.map((item, index) => (
              <div key={index} className="px-6 py-5 flex flex-col sm:flex-row">
                <div className="flex-shrink-0 mb-4 sm:mb-0">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 rounded-md object-cover border border-gray-200"
                  />
                </div>
                <div className="ml-0 sm:ml-6 flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-base font-medium text-gray-900">
                        <Link
                          to={`/products/${item.id}`}
                          className="hover:text-indigo-600"
                        >
                          {item.name}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Size: {item.size} | Color: {item.color || "Standard"}
                      </p>
                    </div>
                    <p className="text-base font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-between items-end">
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Payment Information
              </h2>
            </div>
            <div className="px-6 py-5">
              <div className="flex justify-between mb-3">
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="text-sm font-medium text-gray-900">
                  {order.paymentMethod || "Credit Card (Visa ****4242)"}
                </p>
              </div>
              <div className="flex justify-between mb-3">
                <p className="text-sm text-gray-500">Payment Status</p>
                <p className="text-sm font-medium text-gray-900">
                  {order.paymentStatus === "completed" ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  )}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Transaction ID</p>
                <p className="text-sm font-medium text-gray-900">
                  {order.transactionId || "ch_1JXjw32eZvKYlo2C"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Order Summary
              </h2>
            </div>
            <div className="px-6 py-5">
              <div className="flex justify-between mb-2">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-sm text-gray-900">
                  ${order.totalAmount.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-sm text-gray-600">Shipping</p>
                <p className="text-sm text-gray-900">Free</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-sm text-gray-600">Tax</p>
                <p className="text-sm text-gray-900">
                  ${(order.totalAmount * 0.18).toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between pt-4 mt-4 border-t border-gray-200">
                <p className="text-base font-medium text-gray-900">Total</p>
                <p className="text-base font-medium text-gray-900">
                  ${(order.totalAmount * 1.18).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
