import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUsers,
  FaBoxOpen,
  FaClipboardList,
  FaArrowUp,
  FaShoppingCart,
  FaSignOutAlt,
  FaDollarSign,
} from "react-icons/fa";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";
import { motion } from "framer-motion";
import { AuthContext } from "../common/context/AuthProvider";
import { URL } from "../service/api";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    userGrowth: 0,
    revenueGrowth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout, user, authLoading } = useContext(AuthContext);
  const [chartData, setChartData] = useState({
    orders: [],
    revenue: [],
    statusDistribution: [],
    labels: [],
  });

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || user?.role !== "admin")) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== "admin") return;

      try {
        setLoading(true);
        const [userRes, productRes] = await Promise.all([
          axios.get(`${URL}/users`),
          axios.get(`${URL}/products`),
        ]);

        const users = userRes.data;
        const products = productRes.data;
        let allOrders = [];

        const statusCounts = {
          pending: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0,
        };

        users.forEach((user) => {
          if (Array.isArray(user.orders)) {
            user.orders.forEach((order) => {
              allOrders.push(order);
              const status = order.orderStatus || "pending";
              statusCounts[status]++;
            });
          }
        });

        const userGrowth = 12.5;
        const revenueGrowth = 8.3;

        const totalRevenue = allOrders.reduce(
          (sum, order) =>
            order.paymentStatus === "completed"
              ? sum + Number(order.totalAmount || 0)
              : sum,
          0
        );

        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(today);
          d.setDate(today.getDate() - (6 - i));
          return d.toISOString().split("T")[0];
        });

        const ordersByDay = last7Days.map(
          (day) => allOrders.filter((o) => o.createdAt?.includes(day)).length
        );

        const revenueByDay = last7Days.map((day) =>
          allOrders
            .filter(
              (o) =>
                o.createdAt?.includes(day) && o.paymentStatus === "completed"
            )
            .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0)
        );

        setStats({
          users: users.length,
          products: products.length,
          orders: allOrders.length,
          revenue: totalRevenue,
          userGrowth,
          revenueGrowth,
        });

        setChartData({
          orders: ordersByDay,
          revenue: revenueByDay,
          statusDistribution: Object.values(statusCounts),
          labels: last7Days.map((d) =>
            new Date(d).toLocaleDateString("en-US", {
              weekday: "short",
              day: "numeric",
            })
          ),
        });
      } catch (err) {
        setError("Failed to load dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Error Loading Data
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const barChartData = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Daily Orders",
        data: chartData.orders,
        backgroundColor: "rgba(99, 102, 241, 0.7)",
        borderRadius: 6,
        borderWidth: 0,
      },
    ],
  };

  const lineChartData = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Daily Revenue",
        data: chartData.revenue,
        borderColor: "rgba(16, 185, 129, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
      },
    ],
  };

  const donutChartData = {
    labels: ["Pending", "Shipped", "Delivered", "Cancelled"],
    datasets: [
      {
        data: chartData.statusDistribution,
        backgroundColor: [
          "rgba(245, 158, 11, 0.7)",
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(239, 68, 68, 0.7)",
        ],
        borderColor: [
          "rgba(245, 158, 11, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0,0,0,0.8)",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { drawBorder: false },
      },
      x: {
        grid: { display: false },
      },
    },
    maintainAspectRatio: false,
  };

  const donutOptions = {
    ...chartOptions,
    cutout: "70%",
    plugins: {
      ...chartOptions.plugins,
      legend: {
        position: "right",
      },
    },
    scales: {
      x: { display: false, grid: { display: false } },
      y: { display: false, grid: { display: false } },
    },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <motion.button
          onClick={handleLogout}
          className="group flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-full transition-all duration-200 shadow-sm border border-red-200"
          whileHover={{
            scale: 1.05,
            backgroundColor: "#fef2f2",
            borderColor: "#fca5a5",
          }}
          whileTap={{ scale: 0.95, backgroundColor: "#fee2e2" }}
        >
          <FaSignOutAlt className="text-red-500 group-hover:text-red-600" />
          <span className="group-hover:text-red-600">Logout</span>
        </motion.button>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <DashboardBtn
          color="indigo"
          label="Manage Users"
          icon={<FaUsers className="text-xl" />}
          onClick={() => navigate("/admin/users")}
        />
        <DashboardBtn
          color="emerald"
          label="Manage Products"
          icon={<FaBoxOpen className="text-xl" />}
          onClick={() => navigate("/admin/products")}
        />
        <DashboardBtn
          color="blue"
          label="Manage Orders"
          icon={<FaClipboardList className="text-xl" />}
          onClick={() => navigate("/admin/orders")}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Users"
          value={stats.users}
          growth={stats.userGrowth}
          icon={<FaUsers />}
          color="indigo"
        />
        <StatCard
          label="Total Orders"
          value={stats.orders}
          icon={<FaShoppingCart />}
          color="blue"
        />
        <StatCard
          label="Products"
          value={stats.products}
          icon={<FaBoxOpen />}
          color="emerald"
        />
        <StatCard
          label="Total Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          growth={stats.revenueGrowth}
          icon={<FaDollarSign />}
          color="green"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartBox title="Order Trends (7 Days)">
          <Bar data={barChartData} options={chartOptions} />
        </ChartBox>
        <ChartBox title="Revenue Trends (7 Days)">
          <Line data={lineChartData} options={chartOptions} />
        </ChartBox>
        <ChartBox title="Order Status Distribution">
          <Doughnut data={donutChartData} options={donutOptions} />
        </ChartBox>
      </div>
    </div>
  );
}

// Stat Card Component
const StatCard = ({ icon, label, value, growth, color }) => {
  const colorMap = {
    indigo: "text-indigo-600 bg-indigo-50",
    blue: "text-blue-600 bg-blue-50",
    emerald: "text-emerald-600 bg-emerald-50",
    green: "text-green-600 bg-green-50",
  };
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`rounded-xl p-6 border shadow-sm ${colorMap[color]}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
          {growth && (
            <p className="text-sm mt-2 flex items-center text-green-500">
              <FaArrowUp className="mr-1" /> {growth}% from last week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorMap[color]}`}>{icon}</div>
      </div>
    </motion.div>
  );
};

// Dashboard Navigation Buttons
const DashboardBtn = ({ color, label, icon, onClick }) => {
  const colorClass = {
    indigo: "bg-indigo-600 hover:bg-indigo-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    emerald: "bg-emerald-600 hover:bg-emerald-700",
  };
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${colorClass[color]} text-white py-3 px-6 rounded-lg flex items-center gap-2 justify-center shadow-md`}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
};

// Chart Container 
const ChartBox = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border">
    <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>
    <div className="h-72">{children}</div>
  </div>
);

export default AdminDashboard;
