import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Compass, LayoutGrid, Heart, BookMarked, Settings, LogOut, Search, Bell, Menu, X } from "lucide-react";
import { logout, getUser } from "../../utils/auth";
import "./UserLayout.css";

const NAV_ITEMS = [
  { label: "Discover", icon: Compass, path: "/discover" },
  { label: "Categories", icon: LayoutGrid, path: "/categories" },
  { label: "Favorites", icon: Heart, path: "/favorites" },
  { label: "Borrow Book", icon: BookMarked, path: "/borrowed" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const FILTERS = ["Title", "Genre", "Category"];

export default function UserLayout() {
  const user = getUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Title");

  const name = user?.firstName || user?.first_name || "";
  const initial = (name || user?.email || "U").charAt(0).toUpperCase();

  return (
    <div className="user-layout">
      <aside className={`user-sidebar ${menuOpen ? "user-sidebar--open" : ""}`}>
        <div className="user-sidebar__brand">DreamCode Library</div>

        <nav className="user-sidebar__nav">
          {NAV_ITEMS.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `user-sidebar__link ${isActive ? "user-sidebar__link--active" : ""}`
              }
            >
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="user-sidebar__link" onClick={logout}>
          <LogOut size={17} />
          <span>Log out</span>
        </button>
      </aside>

      {menuOpen && <div className="user-backdrop" onClick={() => setMenuOpen(false)} />}

      <div className="user-content">
        <header className="user-topbar">
          <button
            className="user-topbar__menu"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="user-search">
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search by ${filter.toLowerCase()}`}
            />
            <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Search by">
              {FILTERS.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>

          <button className="user-topbar__icon" aria-label="Notifications">
            <Bell size={18} />
          </button>

          <div className="user-topbar__profile" title={user?.email}>
            {initial}
          </div>
        </header>

        <main className="user-main">
          <Outlet context={{ query, filter }} />
        </main>
      </div>
    </div>
  );
}
