import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../services/api.js';
import Message from '../components/Message.jsx';
import Loader from '../components/Loader.jsx';

export default function BooksList() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (term) => {
    setLoading(true);
    try {
      setBooks(await bookService.list(term));
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load('');
  }, [load]);

  async function handleDelete(book) {
    if (!window.confirm(`Delete "${book.title}"?`)) return;
    try {
      await bookService.remove(book._id);
      setInfo('Book deleted');
      setError('');
      load(search);
    } catch (err) {
      setInfo('');
      setError(err.message);
    }
  }

  return (
    <section>
      <div className="page-head">
        <h2>Books</h2>
        <Link className="btn primary" to="/books/new">Add Book</Link>
      </div>

      <form
        className="search"
        onSubmit={(e) => {
          e.preventDefault();
          load(search);
        }}
      >
        <input
          placeholder="Search by title, author, ISBN or category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn" type="submit">Search</button>
      </form>

      <Message type="error" text={error} />
      <Message type="success" text={info} />
      <Loader show={loading} />

      {!loading && books.length === 0 && <p className="empty">No books found.</p>}

      {books.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>ISBN</th>
              <th>Available / Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>{book.isbn}</td>
                <td>
                  {book.availableQuantity} / {book.quantity}
                </td>
                <td className="row-actions">
                  <Link className="btn small" to={`/books/${book._id}/edit`}>Edit</Link>
                  <button className="btn small danger" onClick={() => handleDelete(book)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
