import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { memberService } from '../services/api.js';
import Message from '../components/Message.jsx';
import Loader from '../components/Loader.jsx';

export default function MembersList() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (term) => {
    setLoading(true);
    try {
      setMembers(await memberService.list(term));
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

  async function handleDelete(member) {
    if (!window.confirm(`Delete member "${member.name}"?`)) return;
    try {
      await memberService.remove(member._id);
      setInfo('Member deleted');
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
        <h2>Members</h2>
        <Link className="btn primary" to="/members/new">Add Member</Link>
      </div>

      <form
        className="search"
        onSubmit={(e) => {
          e.preventDefault();
          load(search);
        }}
      >
        <input
          placeholder="Search by name, email or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn" type="submit">Search</button>
      </form>

      <Message type="error" text={error} />
      <Message type="success" text={info} />
      <Loader show={loading} />

      {!loading && members.length === 0 && <p className="empty">No members found.</p>}

      {members.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Membership Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member._id}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.phone}</td>
                <td>{new Date(member.membershipDate).toLocaleDateString()}</td>
                <td className="row-actions">
                  <Link className="btn small" to={`/members/${member._id}/edit`}>Edit</Link>
                  <button className="btn small danger" onClick={() => handleDelete(member)}>
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
