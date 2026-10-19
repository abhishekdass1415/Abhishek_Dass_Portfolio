import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="notfound on-dark">
      <p className="mono">ERROR 404 · OFF TRACK</p>
      <h1>Page not found</h1>
      <p>This corner of the circuit does not exist.</p>
      <Link href="/" className="btn btn-primary">
        Back to the pits
      </Link>
    </main>
  );
}
