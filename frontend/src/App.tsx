import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/public/HomePage";
import OrderPage from "./pages/public/OrderPage";
import ConfirmPage from "./pages/public/ConfirmPage";
import LoginPage from "./pages/public/LoginPage";
import RegisterPage from "./pages/public/RegisterPage";
import PaymentPage from "./pages/public/PaymentPage";
import ProfilePage from "./pages/public/ProfilePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCitiesPage from "./pages/admin/AdminCitiesPage";
import AdminTariffsPage from "./pages/admin/AdminTariffsPage";
import OrderDetailPage from "./pages/admin/OrderDetailPage";
import SuccessPage from "./pages/public/SuccessPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/confirm" element={<ConfirmPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/payment/:orderId" element={<PaymentPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/cities" element={<AdminCitiesPage />} />
        <Route path="/admin/tariffs" element={<AdminTariffsPage />} />
        <Route path="/admin/orders/:id" element={<OrderDetailPage />} />
        <Route path="/success/:orderId" element={<SuccessPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

