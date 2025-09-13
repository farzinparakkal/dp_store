import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ToastContainer from "./components/ToastContainer";
import { useToast } from "./context/ToastContext";
import Home from "./Pages/Home";
import Admin from "./Pages/Admin";
import Auth from "./Pages/Auth";
import AdminAuth from "./Pages/AdminAuth";
import Products from "./Pages/Products";
import Cart from "./Pages/Cart";
import ProductDetail from "./Pages/ProductDetail";
import Profile from "./Pages/Profile";
import MyOrders from "./Pages/MyOrders";
import ProtectedRoute from "./components/ProtectedRoute";

const AppContent = () => {
  const { toasts, removeToast } = useToast();

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin-auth" element={<AdminAuth />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
