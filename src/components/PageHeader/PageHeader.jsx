import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./PageHeader.css";

// Page title with an optional small subtitle (such as a count) and an optional back link.
// backTo looks like { to: "/categories", label: "Categories", onClick: fn }.
export default function PageHeader({ title, subtitle, backTo }) {
  return (
    <div className="page-header">
      {backTo && (
        <Link to={backTo.to} onClick={backTo.onClick} className="page-header__back">
          <ArrowLeft size={15} />
          {backTo.label}
        </Link>
      )}
      <div className="page-header__row">
        <h1>{title}</h1>
        {subtitle && <span>{subtitle}</span>}
      </div>
    </div>
  );
}
