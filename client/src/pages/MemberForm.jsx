import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { memberService } from '../services/api.js';
import Message from '../components/Message.jsx';
import Loader from '../components/Loader.jsx';

const empty = { name: '', email: '', phone: '' };

export default function MemberForm() {
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
    memberService
      .get(id)
      .then((member) =>
        setForm({ name: member.name, email: member.email, phone: member.phone })
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function validate() {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Valid email is required';
    if (!/^[0-9+\-\s()]{7,20}$/.test(form.phone)) errors.phone = 'Valid phone number is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (id) await memberService.update(id, form);
      else await memberService.create(form);
      navigate('/members');
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
      <h2>{id ? 'Edit Member' : 'Add Member'}</h2>
      <Message type="error" text={error} />
      <Loader show={loading} />
      <form className="form" onSubmit={handleSubmit} noValidate>
        <fieldset className="fields" disabled={loading}>
          <label>
            Name
            <input value={form.name} onChange={(e) => update('name', e.target.value)} />
            {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
          </label>
          <label>
            Email
            <input value={form.email} onChange={(e) => update('email', e.target.value)} />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </label>
          <label>
            Phone
            <input value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            {fieldErrors.phone && <span className="field-error">{fieldErrors.phone}</span>}
          </label>
          <div className="actions">
            <button className="btn primary" type="submit" disabled={saving || loading}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button className="btn" type="button" onClick={() => navigate('/members')}>
              Cancel
            </button>
          </div>
        </fieldset>
      </form>
    </section>
  );
}
