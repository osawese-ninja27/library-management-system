import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Discover from "./pages/Discover/Discover";
import Categories from "./pages/Categories/Categories";
import CategoryBooks from "./pages/Categories/CategoryBooks";
import Favorites from "./pages/Favorites/Favorites";
import ComingSoon from "./pages/ComingSoon/ComingSoon";
import UserLayout from "./components/UserLayout/UserLayout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminLayout from "./pages/admin/AdminLayout/AdminLayout";
import ManageBooks from "./pages/admin/ManageBooks/ManageBooks";
import ManageCategories from "./pages/admin/ManageCategories/ManageCategories";
import ManageUsers from "./pages/admin/ManageUsers/ManageUsers";
import ChangePassword from "./pages/admin/ChangePassword/ChangePassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Regular users */}
      <Route element={<ProtectedRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/discover" element={<Discover />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:categoryId" element={<CategoryBooks />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/borrowed" element={<ComingSoon title="Borrow Book" />} />
          <Route path="/settings" element={<ComingSoon title="Settings" />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute adminOnly />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="books" replace />} />
          <Route path="books" element={<ManageBooks />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="password" element={<ChangePassword />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
