export default function Loader({ show }) {
  if (!show) return null;
  return <p className="loader">Loading...</p>;
}
