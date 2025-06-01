"use client";

import React, { useState, useEffect } from "react";
import {
  generateDashboardMetrics,
  generateRecentTransactions,
  generateHoldingsData,
  DashboardMetrics,
  Transaction,
  HoldingPoint,
} from "../lib/fakeData";

// Chart.js setup for a Barr chart
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2"; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement, 
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  // State hooks for client-side data generation
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [holdings, setHoldings] = useState<HoldingPoint[]>([]);

  useEffect(() => {
    // I'll generate everything only in the browser to avoid SSR/client mismatch
    setMetrics(generateDashboardMetrics());
    setTransactions(generateRecentTransactions());
    setHoldings(generateHoldingsData());
  }, []);

  // waiting for useEffect to run, render a simple placeholder
  if (!metrics) {
    return <main className="min-h-screen bg-gray-50 p-6">Loading dashboard…</main>;
  }

  const barData = {
    labels: holdings.map((h) => h.label),
    datasets: [
      {
        label: "Holdings",
        data: holdings.map((h) => h.value),
        backgroundColor: "rgba(34, 197, 94, 0.6)", // green bars with some opacity
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: false, text: "Holdings Over Time" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    
    <main className="min-h-screen bg-gray-50 p-6">
      {/* Page header */}
      <h1 className="text-3xl font-bold mb-6">Crypto Dashboard</h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-500">Account Balance</h2>
          <p className="text-2xl font-bold">{metrics.balance}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-500">Total Trades</h2>
          <p className="text-2xl font-bold">{metrics.totalTrades}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-500">Net P&L</h2>
          <p className="text-2xl font-bold">{metrics.netPnL}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-500">Active Positions</h2>
          <p className="text-2xl font-bold">{metrics.activePositions}</p>
        </div>
      </div>

      {/* Transactions & Chart Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* Recent Transactions Table */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
          <div className="overflow-auto shadow rounded-lg bg-white">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tx.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tx.symbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tx.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tx.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tx.user}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

       {/* Bar Chart of Portfolio Value */}
       <section>
          <h2 className="text-2xl font-semibold mb-4">Portfolio Value Over Time</h2>
          <div className="bg-white shadow rounded-lg p-4 h-full flex flex-col">
            <Bar data={barData} options={barOptions} />
          </div>
        </section>
      </div>
    </main>
  );
}