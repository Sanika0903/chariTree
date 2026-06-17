import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-6xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-xl font-bold text-blue-700">ChariTree 🌱</h3>
          <p className="text-gray-600 mt-2">Connecting donors, volunteers and organizations to grow impact.</p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700">Explore</h4>
          <ul className="mt-2 text-gray-600 space-y-1">
            <li>Organizations</li>
            <li>Campaigns</li>
            <li>About</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700">Contact</h4>
          <p className="text-gray-600 mt-2">support@charitree.org</p>
          <p className="text-gray-600">© {new Date().getFullYear()} ChariTree</p>
        </div>
      </div>
    </footer>
  );
}
