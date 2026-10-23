import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { getMyBorrowings } from "../../api/borrowings";
import PageHeader from "../../components/PageHeader/PageHeader";
import StatusMessage from "../../components/StatusMessage/StatusMessage";
import Countdown from "../../components/Countdown/Countdown";
import "./Borrowed.css";

const DAY_MS = 24 * 60 * 60 * 1000;

const STATUS_LABEL = {
  pending: "Waiting for pickup",
  borrowed: "Borrowed",
  returned: "Returned",
  rejected: "Declined",
  expired: "Not collected in time",
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function BookThumb({ item }) {
  return (
    <div className="borrow-row__cover">
      {item.cover_image_url ? <img src={item.cover_image_url} alt="" loading="lazy" /> : <BookOpen size={20} strokeWidth={1.5} />}
    </div>
  );
}

// The user's borrowing page: what is active right now, then everything that is finished.
export default function Borrowed() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    return getMyBorrowings()
      .then((rows) => {
        setItems(rows);
        setError("");
      })
      .catch((err) => {
        if (err.status !== 401) setError("Could not load your borrowing. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const active = items.filter((i) => i.status === "pending" || i.status === "borrowed");
  const history = items.filter((i) => !["pending", "borrowed"].includes(i.status));

  return (
    <div className="borrowed">
      <PageHeader title="Borrow Book" />

      {loading && <StatusMessage>Loading…</StatusMessage>}
      {error && <StatusMessage variant="error">{error}</StatusMessage>}

      {!loading && !error && items.length === 0 && (
        <StatusMessage>
          You haven&apos;t requested any book yet.
          <br />
          <Link to="/discover">Find a book on Discover</Link>
        </StatusMessage>
      )}

      {!loading && !error && active.length > 0 && (
        <section className="borrowed__section">
          <h2>Right now</h2>
          {active.map((item) => (
            <div className="borrow-row" key={item.id}>
              <BookThumb item={item} />
              <div className="borrow-row__info">
                <span className="borrow-row__title">{item.title}</span>
                {item.author && <span className="borrow-row__meta">by {item.author}</span>}
                <span className={`borrow-row__pill borrow-row__pill--${item.status}`}>{STATUS_LABEL[item.status]}</span>
              </div>

              <div className="borrow-row__time">
                {item.status === "pending" ? (
                  <>
                    <span className="borrow-row__label">Collect within</span>
                    {/* When the hold runs out the request is no longer active, so reload. */}
                    <Countdown target={item.expires_at} serverTime={item.server_time} onExpire={load} />
                  </>
                ) : (
                  <>
                    <span className="borrow-row__label">Due back</span>
                    <Countdown
                      target={item.due_date}
                      serverTime={item.server_time}
                      hideUntilMs={DAY_MS}
                      hiddenLabel={formatDate(item.due_date)}
                    />
                  </>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {!loading && !error && history.length > 0 && (
        <section className="borrowed__section">
          <h2>History</h2>
          {history.map((item) => (
            <div className="borrow-row borrow-row--past" key={item.id}>
              <BookThumb item={item} />
              <div className="borrow-row__info">
                <span className="borrow-row__title">{item.title}</span>
                {item.author && <span className="borrow-row__meta">by {item.author}</span>}
                <span className={`borrow-row__pill borrow-row__pill--${item.status}`}>{STATUS_LABEL[item.status]}</span>
              </div>
              <div className="borrow-row__time">
                <span className="borrow-row__label">{item.returned_at ? "Returned" : "Requested"}</span>
                <span className="borrow-row__date">{formatDate(item.returned_at || item.requested_at)}</span>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
