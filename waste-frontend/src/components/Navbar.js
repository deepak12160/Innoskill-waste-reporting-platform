import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-2xl">♻️</span>
        <h1 className="text-xl font-bold text-green-700 tracking-tighter">WASTEWATCH</h1>
      </div>
      <div className="flex gap-6 font-medium text-gray-600">
        <Link href="/Dashboard" className="hover:text-green-600 transition">Live Map</Link>
        <Link href="/ReportIssue" className="hover:text-green-600 transition">Report Waste</Link>
      </div>
    </nav>
  );
}