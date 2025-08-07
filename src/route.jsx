import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// Layout
import Navbar from "./common/layout/navbar/Navbar";
import Footer from "./common/layout/footer/Footer";

// Auth Context
import AuthProvider from "./common/context/AuthProvider";

// Route Protection
import AdminPrivateRoute from "./common/Routes/AdminRoute";
import PrivateRoute from "./common/Routes/privateRoute";
import ShoeCartLoader from "./common/ui/Loader";

// Lazy-loaded Pages
const Landing = lazy(() => import("./pages/nonAuth/landing/Landing"));
const ErrorResponse = lazy(() => import("./pages/nonAuth/404/ErrorResponse"));
const Products = lazy(() => import("./pages/nonAuth/products/Products"));
const ProductDetails = lazy(() =>
  import("./pages/nonAuth/products/ProductDetails")
);
const Cart = lazy(() => import("./pages/nonAuth/cart/Cart"));
const PaymentPage = lazy(() => import("./pages/nonAuth/payment/PaymentPage"));
const RegistrationPage = lazy(() => import("./pages/auth/RegistrationPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const AboutUs = lazy(() => import("./pages/nonAuth/aboutus/AboutUs"));
const OrderConfirmation = lazy(() =>
  import("./pages/nonAuth/order/OrderConfirmation")
);
const OrdersPage = lazy(() => import("./pages/nonAuth/order/OrdersPage"));
const OrderDetails = lazy(() => import("./pages/nonAuth/order/OrderDetails"));
const Wishlist = lazy(() => import("./pages/nonAuth/wishlist/WishList"));

// Admin Pages
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));
const ManageUsers = lazy(() => import("./admin/ManageUsers"));
const ManageProducts = lazy(() => import("./admin/ManageProducts"));
const ManageOrders = lazy(() => import("./admin/ManageOrders"));
const AddProductPage = lazy(() => import("./admin/AddProduct"));
const EditProductPage = lazy(() => import("./admin/EditProduct"));
const UserOrders = lazy(() => import("./admin/UserOrders"));

function AppRoutesWrapper() {
  const location = useLocation();

  const shouldHideNavbar =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <div className="w-full min-h-screen bg-white flex flex-col justify-between">
      {!shouldHideNavbar && <Navbar />}

      <div className="flex-grow w-[95%] mx-auto">
        <Suspense
          fallback={<ShoeCartLoader/>}
        >
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="*" element={<ErrorResponse />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<RegistrationPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/products" element={<Products />} />
            {/* User-Protected */}
            <Route element={<PrivateRoute />}>
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route
                path="/order-confirmation"
                element={<OrderConfirmation />}
              />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:orderId" element={<OrderDetails />} />
              <Route path="/wishlist" element={<Wishlist />} />
            </Route>

            {/* Admin-Protected */}
            <Route element={<AdminPrivateRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/products" element={<ManageProducts />} />
              <Route path="/admin/orders" element={<ManageOrders />} />
              <Route path="/admin/products/addproduct"element={<AddProductPage />}/>
              <Route path="/admin/products/edit/:id" element={<EditProductPage />}/>
              <Route path="/admin/user-orders/:id" element={<UserOrders />} />
            </Route>
          </Routes>
        </Suspense>
      </div>

      {!shouldHideNavbar && <Footer />}
    </div>
  );
}

function UserRouter() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutesWrapper />
      </AuthProvider>
    </Router>
  );
}

export default UserRouter;
