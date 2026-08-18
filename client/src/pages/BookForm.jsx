import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { bookService } from '../services/api.js';
import Message from '../components/Message.jsx';
import Loader from '../components/Loader.jsx';

const empty = { title: '', author: '', category: '', isbn: '', quantity: 1 };

export default function BookForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    bookService
      .get(id)
      .then((book) =>
        setForm({
          title: book.title,
          author: book.author,
          category: book.category || '',
          isbn: book.isbn,
          quantity: book.quantity
        })
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function validate() {
    const errors = {};
    if (!form.title.trim()) errors.title = 'Title is required';
    if (!form.author.trim()) errors.author = 'Author is required';
    if (!form.isbn.trim()) errors.isbn = 'ISBN is required';
    if (form.quantity === '' || Number(form.quantity) < 0) {
      errors.quantity = 'Quantity must be zero or more';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { ...form, quantity: Number(form.quantity) };
      if (id) await bookService.update(id, payload);
      else await bookService.create(payload);
      navigate('/books');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <section>
      <h2>{id ? 'Edit Book' : 'Add Book'}</h2>
      <Message type="error" text={error} />
      <Loader show={loading} />
      <form className="form" onSubmit={handleSubmit} noValidate>
        <fieldset className="fields" disabled={loading}>
          <label>
            Title
            <input value={form.title} onChange={(e) => update('title', e.target.value)} />
            {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
          </label>
          <label>
            Author
            <input value={form.author} onChange={(e) => update('author', e.target.value)} />
            {fieldErrors.author && <span className="field-error">{fieldErrors.author}</span>}
          </label>
          <label>
            Category
            <input value={form.category} onChange={(e) => update('category', e.target.value)} />
          </label>
          <label>
            ISBN
            <input value={form.isbn} onChange={(e) => update('isbn', e.target.value)} />
            {fieldErrors.isbn && <span className="field-error">{fieldErrors.isbn}</span>}
          </label>
          <label>
            Quantity
            <input
              type="number"
              min="0"
              value={form.quantity}
              onChange={(e) => update('quantity', e.target.value)}
            />
            {fieldErrors.quantity && <span className="field-error">{fieldErrors.quantity}</span>}
          </label>
          <div className="actions">
            <button className="btn primary" type="submit" disabled={saving || loading}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button className="btn" type="button" onClick={() => navigate('/books')}>
              Cancel
            </button>
          </div>
        </fieldset>
      </form>
    </section>
  );
}
