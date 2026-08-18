import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookService, memberService, transactionService } from '../services/api.js';
import Message from '../components/Message.jsx';

export default function IssueBook() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [bookId, setBookId] = useState('');
  const [memberId, setMemberId] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([bookService.list(), memberService.list()])
      .then(([b, m]) => {
        setBooks(b);
        setMembers(m);
      })
      .catch((err) => setError(err.message));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!bookId || !memberId) {
      setError('Please select both a book and a member');
      return;
    }
    setSaving(true);
    try {
      await transactionService.issue({ bookId, memberId });
      navigate('/transactions');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <h2>Issue Book</h2>
      <Message type="error" text={error} />
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Book
          <select value={bookId} onChange={(e) => setBookId(e.target.value)}>
            <option value="">Select a book</option>
            {books.map((book) => (
              <option key={book._id} value={book._id} disabled={book.availableQuantity < 1}>
                {book.title} ({book.availableQuantity} available)
              </option>
            ))}
          </select>
        </label>
        <label>
          Member
          <select value={memberId} onChange={(e) => setMemberId(e.target.value)}>
            <option value="">Select a member</option>
            {members.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name} ({member.email})
              </option>
            ))}
          </select>
        </label>
        <div className="actions">
          <button className="btn primary" type="submit" disabled={saving}>
            {saving ? 'Issuing...' : 'Issue Book'}
          </button>
        </div>
      </form>
    </section>
  );
}
