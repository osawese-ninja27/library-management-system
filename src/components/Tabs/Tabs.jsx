import "./Tabs.css";

// A row of tab headings. The parent decides which tab is active.
// tabs = [{ key: "pending", label: "Pending" }, ...]
export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={active === tab.key}
          className={`tabs__tab ${active === tab.key ? "tabs__tab--active" : ""}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
