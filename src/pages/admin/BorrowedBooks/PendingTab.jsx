import useBorrowings from "./useBorrowings";
import Panel from "./Panel";
import { formatDateTime, formatHoldLeft } from "./helpers";

// Requests waiting for the person to come and collect the book (inside the 24-hour hold).
export default function PendingTab() {
  const state = useBorrowings("pending");
  const { items, busyId, serverNow, approve, reject } = state;

  return (
    <Panel state={state} emptyText="No requests waiting for pickup.">
      <table className="bb-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Book</th>
            <th>Requested</th>
            <th>Hold</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr key={row.id}>
              <td>{row.email}</td>
              <td>{row.title}</td>
              <td>{formatDateTime(row.requested_at)}</td>
              <td>{formatHoldLeft(row.expires_at, serverNow)}</td>
              <td>
                <div className="bb-actions">
                  <button
                    type="button"
                    className="bb-btn bb-btn--primary"
                    disabled={busyId === row.id}
                    onClick={() => approve(row.id)}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="bb-btn"
                    disabled={busyId === row.id}
                    onClick={() => reject(row.id)}
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}
