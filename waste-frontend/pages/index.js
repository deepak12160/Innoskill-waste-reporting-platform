import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">♻️ WASTEWATCH</h1>
        <p className="text-xl mb-8">Keep your community clean and green</p>
        <div className="space-x-4">
          <Link href="/Dashboard" className="bg-white text-green-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">
            View Live Map
          </Link>
          <Link href="/ReportIssue" className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition">
            Report Waste
          </Link>
        </div>
      </div>
    </div>
  );
}