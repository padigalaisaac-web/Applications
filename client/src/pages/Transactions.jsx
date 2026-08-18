import { useCallback, useEffect, useState } from 'react';
import { transactionService } from '../services/api.js';
import Message from '../components/Message.jsx';
import Loader from '../components/Loader.jsx';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (value) => {
    setLoading(true);
    try {
      setTransactions(await transactionService.list(value));
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(status);
  }, [load, status]);

  async function handleReturn(transaction) {
    try {
      await transactionService.markReturned(transaction._id);
      setInfo('Book marked as returned');
      setError('');
      load(status);
    } catch (err) {
      setInfo('');
      setError(err.message);
    }
  }

  return (
    <section>
      <div className="page-head">
        <h2>Transactions</h2>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="issued">Issued</option>
          <option value="returned">Returned</option>
        </select>
      </div>

      <Message type="error" text={error} />
      <Message type="success" text={info} />
      <Loader show={loading} />

      {!loading && transactions.length === 0 && <p className="empty">No transactions yet.</p>}

      {transactions.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Book</th>
              <th>Member</th>
              <th>Issue Date</th>
              <th>Return Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t._id}>
                <td>{t.bookId?.title || 'Deleted book'}</td>
                <td>{t.memberId?.name || 'Deleted member'}</td>
                <td>{new Date(t.issueDate).toLocaleDateString()}</td>
                <td>{t.returnDate ? new Date(t.returnDate).toLocaleDateString() : '-'}</td>
                <td>
                  <span className={`badge ${t.status}`}>{t.status}</span>
                </td>
                <td>
                  {t.status === 'issued' && (
                    <button className="btn small primary" onClick={() => handleReturn(t)}>
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
