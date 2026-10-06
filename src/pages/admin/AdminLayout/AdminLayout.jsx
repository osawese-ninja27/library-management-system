import { Link, useLocation, Outlet } from "react-router-dom";
import { Book, Tag, LogOut } from "lucide-react";
import { logout, getUser } from "../../../utils/auth";
import "./AdminLayout.css";

const NAV_ITEMS = [
  { label: "Books", icon: Book, path: "/admin/books" },
  { label: "Categories", icon: Tag, path: "/admin/categories" },
];

export default function AdminLayout() {
  const location = useLocation();
  const user = getUser();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">DreamCode Library</div>
        <nav className="admin-sidebar__nav">
          {NAV_ITEMS.map(({ label, icon: Icon, path }) => (
            <Link
              key={path}
              to={path}
              className={`admin-sidebar__link ${
                location.pathname === path ? "admin-sidebar__link--active" : ""
              }`}
            >
              <Icon size={17} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <button className="admin-sidebar__link" onClick={logout}>
          <LogOut size={17} />
          <span>Log out</span>
        </button>
      </aside>

      <div className="admin-content">
        <header className="admin-topbar">
          <span>Welcome, {user?.firstName || "Admin"}</span>
        </header>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}