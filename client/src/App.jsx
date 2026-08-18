import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import BooksList from './pages/BooksList.jsx';
import BookForm from './pages/BookForm.jsx';
import MembersList from './pages/MembersList.jsx';
import MemberForm from './pages/MemberForm.jsx';
import IssueBook from './pages/IssueBook.jsx';
import Transactions from './pages/Transactions.jsx';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/books" element={<BooksList />} />
        <Route path="/books/new" element={<BookForm />} />
        <Route path="/books/:id/edit" element={<BookForm />} />
        <Route path="/members" element={<MembersList />} />
        <Route path="/members/new" element={<MemberForm />} />
        <Route path="/members/:id/edit" element={<MemberForm />} />
        <Route path="/issue" element={<IssueBook />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
