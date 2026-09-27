import React, { useState, useEffect } from 'react';
import { RevenueExpenseChart, BarChartCard } from '../components/ChartCard';
import { calculateEMI, calculateTotalInterest, formatCurrency } from '../utils/calculations';

export default function FinancialAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const [loanAmount, setLoanAmount] = useState(200000);
  const [interestRate, setInterestRate] = useState(9);
  const [tenure, setTenure] = useState(3);

  useEffect(() => {
    const data = localStorage.getItem('currentAnalysis');
    if (data) setAnalysis(JSON.parse(data));
  }, []);

  const emi = calculateEMI(loanAmount, interestRate, tenure);
  const totalInterest = calculateTotalInterest(loanAmount, interestRate, tenure);
  const totalRepayment = loanAmount + totalInterest;

  const financial = analysis?.financial || {
    investment: 300000,
    monthlyRevenue: 150000,
    monthlyExpenses: 95000,
    monthlyProfit: 55000,
    breakEvenMonths: 6
  };

  const yearlyData = [
    { year: "Year 1", revenue: financial.monthlyRevenue * 12, expenses: financial.monthlyExpenses * 12, profit: financial.monthlyProfit * 12 },
    { year: "Year 2", revenue: financial.monthlyRevenue * 12 * 1.1, expenses: financial.monthlyExpenses * 12 * 1.05, profit: financial.monthlyProfit * 12 * 1.15 },
    { year: "Year 3", revenue: financial.monthlyRevenue * 12 * 1.2, expenses: financial.monthlyExpenses * 12 * 1.1, profit: financial.monthlyProfit * 12 * 1.3 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Financial Analysis</h1>
        <p className="text-gray-500 mt-1">Detailed financial projections and loan calculator</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Initial Investment</p>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(financial.investment)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Monthly Revenue</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(financial.monthlyRevenue)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Monthly Expenses</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(financial.monthlyExpenses)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Est. Monthly Profit</p>
          <p className={`text-2xl font-bold ${financial.monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(financial.monthlyProfit)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RevenueExpenseChart revenue={financial.monthlyRevenue} expenses={financial.monthlyExpenses} />
        <BarChartCard
          title="3-Year Projection"
          data={yearlyData}
          dataKey="profit"
          xKey="year"
          color="#10B981"
        />
      </div>

      {/* Break-even */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Break-even Analysis</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="w-full bg-gray-100 rounded-full h-4">
              <div
                className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
                style={{ width: `${Math.min(100, (6 / financial.breakEvenMonths) * 100)}%` }}
              />
            </div>
          </div>
          <span className="text-lg font-bold text-gray-800">~{financial.breakEvenMonths} months</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Estimated time to recover initial investment based on current projections
        </p>
      </div>

      {/* Loan Calculator */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Loan Calculator</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount (₹)</label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (% p.a.)</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tenure (Years)</label>
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-xs text-blue-600">Monthly EMI</p>
            <p className="text-xl font-bold text-blue-700">{formatCurrency(emi)}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <p className="text-xs text-red-600">Total Interest</p>
            <p className="text-xl font-bold text-red-700">{formatCurrency(totalInterest)}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-xs text-green-600">Total Repayment</p>
            <p className="text-xl font-bold text-green-700">{formatCurrency(totalRepayment)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
