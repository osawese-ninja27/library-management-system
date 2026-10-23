import useBorrowings from "./useBorrowings";
import Panel from "./Panel";
import { formatDateTime, getDueStatus } from "./helpers";

// Books that are out right now. Overdue rows are shown in red.
export default function BorrowedTab() {
  const state = useBorrowings("borrowed");
  const { items, busyId, serverNow, markReturned } = state;

  return (
    <Panel state={state} emptyText="No books are out right now.">
      <table className="bb-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Book</th>
            <th>Borrowed</th>
            <th>Due</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row) => {
            const due = getDueStatus(row.due_date, serverNow);
            return (
              <tr key={row.id} className={due.overdue ? "bb-row--overdue" : ""}>
                <td>{row.email}</td>
                <td>{row.title}</td>
                <td>{formatDateTime(row.approved_at)}</td>
                <td>{formatDateTime(row.due_date)}</td>
                <td className={due.overdue ? "bb-overdue" : ""}>{due.text}</td>
                <td>
                  <button
                    type="button"
                    className="bb-btn bb-btn--primary"
                    disabled={busyId === row.id}
                    onClick={() => markReturned(row.id)}
                  >
                    Mark returned
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Panel>
  );
}
