import useBorrowings from "./useBorrowings";
import Panel from "./Panel";
import { capitalise, formatDateTime } from "./helpers";

// Finished records: returned, rejected, or never collected in time. Read-only.
export default function HistoryTab() {
  const state = useBorrowings("history");

  return (
    <Panel state={state} emptyText="No finished records yet.">
      <table className="bb-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Book</th>
            <th>Outcome</th>
            <th>Requested</th>
            <th>Borrowed</th>
            <th>Returned</th>
            <th>Days held</th>
          </tr>
        </thead>
        <tbody>
          {state.items.map((row) => (
            <tr key={row.id}>
              <td>{row.email}</td>
              <td>{row.title}</td>
              <td>{capitalise(row.status)}</td>
              <td>{formatDateTime(row.requested_at)}</td>
              <td>{formatDateTime(row.approved_at)}</td>
              <td>{formatDateTime(row.returned_at)}</td>
              <td>{row.days_held ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}
