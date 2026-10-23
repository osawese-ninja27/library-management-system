import { PAGE_SIZE } from "./useBorrowings";

// The frame every tab shares: messages, the empty state, the table, and page buttons.
// The table itself is passed in as children.
export default function Panel({ state, emptyText, children }) {
  const { items, total, page, setPage, loading, error, notice } = state;
  const first = page * PAGE_SIZE + 1;
  const last = page * PAGE_SIZE + items.length;

  return (
    <div className="bb-panel">
      {error && <p className="bb-message bb-message--error" role="alert">{error}</p>}
      {notice && <p className="bb-message bb-message--ok" role="status">{notice}</p>}

      {loading && items.length === 0 && <p className="bb-empty">Loading…</p>}
      {!loading && items.length === 0 && !error && <p className="bb-empty">{emptyText}</p>}

      {items.length > 0 && (
        <>
          <div className="bb-table-wrap">{children}</div>
          <div className="bb-pager">
            <span>
              {first}–{last} of {total}
            </span>
            <div>
              <button
                type="button"
                className="bb-btn"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <button
                type="button"
                className="bb-btn"
                disabled={last >= total}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
