import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBoxOpen,
  FaShippingFast,
  FaCheckCircle,
  FaTimesCircle,
  FaRupeeSign,
  FaDollarSign,
} from "react-icons/fa";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import { URL } from "../service/api";
import ShoeCartLoader from "../common/ui/Loader";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch users and extract all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${URL}/users`);
        const users = res.data;

        const allOrders = [];
        const productSales = {};

        users.forEach((user) => {
          if (Array.isArray(user.orders)) {
            user.orders.forEach((order, index) => {
              // Collect all orders
              allOrders.push({
                userId: user.id,
                orderId: order.id || index,
                name: user.name || "Unknown",
                ...order,
              });

              // Track product sales
              if (order.items) {
                order.items.forEach((item) => {
                  if (!productSales[item.id]) {
                    productSales[item.id] = {
                      name: item.name,
                      image: item.image_url,
                      sales: 0,
                      revenue: 0,
                    };
                  }
                  productSales[item.id].sales += item.quantity || 1;
                  productSales[item.id].revenue +=
                    (item.price || 0) * (item.quantity || 1);
                });
              }
            });
          }
        });

        setOrders(allOrders);
        setProductSalesData(Object.values(productSales));
      } catch (err) {
        console.error("Error loading orders:", err);
        setError("Failed to fetch orders.");
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const [productSalesData, setProductSalesData] = useState([]);

  // Calculate order statistics
  const orderStats = orders.reduce(
    (stats, order) => {
      stats.totalOrders++;
      stats.totalRevenue += order.totalAmount || 0;

      if (order.orderStatus === "delivered") stats.delivered++;
      else if (order.orderStatus === "shipped") stats.shipped++;
      else if (order.orderStatus === "cancelled") stats.cancelled++;
      else stats.pending++;

      return stats;
    },
    {
      totalOrders: 0,
      totalRevenue: 0,
      pending: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    }
  );

  const handleStatusChange = async (userId, orderId, newStatus) => {
    try {
      const res = await axios.get(`${URL}/users/${userId}`);
      const user = res.data;

      const updatedOrders = user.orders.map((order) =>
        order.id.toString() === orderId.toString()
          ? {
              ...order,
              orderStatus: newStatus,
              // Don't modify paymentStatus here
            }
          : order
      );

      await axios.patch(`${URL}/users/${userId}`, {
        orders: updatedOrders,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.userId === userId && order.orderId === orderId
            ? {
                ...order,
                orderStatus: newStatus,
                // Keep original payment status
              }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Prepare data for donut chart
  const donutData = {
    labels: ["Pending", "Shipped", "Delivered", "Cancelled"],
    datasets: [
      {
        data: [
          orderStats.pending,
          orderStats.shipped,
          orderStats.delivered,
          orderStats.cancelled,
        ],
        backgroundColor: [
          "rgba(255, 159, 64, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(255, 99, 132, 0.7)",
        ],
        borderColor: [
          "rgba(255, 159, 64, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };


  const sortedProducts = [...productSalesData]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  const barData = {
    labels: sortedProducts.map((p) => p.name),
    datasets: [
      {
        label: "Units Sold",
        data: sortedProducts.map((p) => p.sales),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
      {
        label: "Revenue ($)",
        data: sortedProducts.map((p) => p.revenue),
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
      },
    ],
  };

  if (loading)
    return (
      <ShoeCartLoader/>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          {error}
        </div>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Order Management
      </h1>

      {/* Order Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold mt-1">
                {orderStats.totalOrders}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
              <FaBoxOpen className="text-xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold mt-1">
                ${orderStats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 text-green-600">
              <FaDollarSign className="text-xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Shipped Orders
              </p>
              <p className="text-2xl font-bold mt-1">{orderStats.shipped}</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-50 text-orange-600">
              <FaShippingFast className="text-xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Delivered Orders
              </p>
              <p className="text-2xl font-bold mt-1">{orderStats.delivered}</p>
            </div>
            <div className="p-3 rounded-lg bg-teal-50 text-teal-600">
              <FaCheckCircle className="text-xl" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Order Status Donut Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">
            Order Status Distribution
          </h3>
          <div className="h-64">
            <Doughnut
              data={donutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "right",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Best Selling Products */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
          <div className="h-64">
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {orders.map((order, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.orderId.toString().slice(-6)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {order.items?.map((item, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 px-2 py-1 rounded text-xs"
                        >
                          {item.name} (x{item.quantity})
                        </span>
                      )) || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${order.totalAmount}.00
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.paymentStatus === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.paymentStatus === "completed" ? "Paid" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      disabled={["delivered", "cancelled"].includes(
                        order.orderStatus
                      )}
                      className={`text-sm rounded-md border px-2 py-1 cursor-pointer
    ${
      order.orderStatus === "pending"
        ? "bg-orange-50 text-orange-700 border-orange-300"
        : order.orderStatus === "shipped"
        ? "bg-blue-50 text-blue-700 border-blue-300"
        : order.orderStatus === "delivered"
        ? "bg-green-50 text-green-700 border-green-300"
        : "bg-red-50 text-red-700 border-red-300"
    }
    ${
      ["delivered", "cancelled"].includes(order.orderStatus)
        ? "opacity-60 cursor-not-allowed"
        : ""
    }
  `}
                      value={order.orderStatus || "pending"}
                      onChange={(e) =>
                        handleStatusChange(
                          order.userId,
                          order.orderId,
                          e.target.value
                        )
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageOrders;
