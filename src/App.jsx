import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Discover from "./pages/Discover/Discover";
import AdminLayout from "./pages/admin/AdminLayout/AdminLayout";
import ManageBooks from "./pages/admin/ManageBooks/ManageBooks";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/" element={<Login />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="books" element={<ManageBooks />} />
      </Route>
    </Routes>
  );
}

export default App;

