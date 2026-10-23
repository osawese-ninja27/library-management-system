import { useState } from "react";
import Tabs from "../../../components/Tabs/Tabs";
import PendingTab from "./PendingTab";
import BorrowedTab from "./BorrowedTab";
import HistoryTab from "./HistoryTab";
import "./BorrowedBooks.css";

const TABS = [
  { key: "pending", label: "Pending" },
  { key: "borrowed", label: "Currently Borrowed" },
  { key: "history", label: "History" },
];

// Admin page at /admin/borrowed. It only holds which tab is open;
// each tab loads and shows its own data.
export default function BorrowedBooks() {
  const [tab, setTab] = useState("pending");

  return (
    <div className="bb-page">
      <h1 className="bb-title">Borrowed Books</h1>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {/* key makes React start fresh (and reload) each time the tab changes */}
      {tab === "pending" && <PendingTab key="pending" />}
      {tab === "borrowed" && <BorrowedTab key="borrowed" />}
      {tab === "history" && <HistoryTab key="history" />}
    </div>
  );
}
