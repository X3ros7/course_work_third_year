import Link from 'next/link';

export default function AuctionPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-bold text-blue-600">Coming Soon</h1>
      <p className="text-gray-500">This page is under construction</p>
      <Link href="/products" className="text-blue-600 hover:text-blue-700">
        Go to Products
      </Link>
      <Link href="/about#auction" className="text-gray-800 hover:text-gray-900">
        Learn more about the auction
      </Link>
    </div>
  );
}
