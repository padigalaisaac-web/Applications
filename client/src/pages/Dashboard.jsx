import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { transactionService } from '../services/api.js';
import Message from '../components/Message.jsx';
import Loader from '../components/Loader.jsx';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    transactionService
      .stats()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { label: 'Total Books', value: stats.totalBooks },
        { label: 'Total Copies', value: stats.totalCopies },
        { label: 'Total Members', value: stats.totalMembers },
        { label: 'Issued Books', value: stats.issuedBooks },
        { label: 'Returned Books', value: stats.returnedBooks }
      ]
    : [];

  return (
    <section>
      <h2>Dashboard</h2>
      <Message type="error" text={error} />
      <Loader show={loading} />
      <div className="cards">
        {cards.map((card) => (
          <div className="card" key={card.label}>
            <span className="card-value">{card.value}</span>
            <span className="card-label">{card.label}</span>
          </div>
        ))}
      </div>
      <div className="actions">
        <Link className="btn primary" to="/books/new">Add Book</Link>
        <Link className="btn" to="/members/new">Add Member</Link>
        <Link className="btn" to="/issue">Issue Book</Link>
      </div>
    </section>
  );
}
