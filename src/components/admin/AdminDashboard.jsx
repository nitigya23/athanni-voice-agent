import React, { useState } from 'react';
import {
  Car,
  PhoneCall,
  CalendarCheck,
  CheckCircle2,
  TrendingUp,
  Download,
  Layers,
  Sparkles,
  Search,
  Database
} from 'lucide-react';
import InventoryTable from './InventoryTable';
import CallHistoryView from './CallHistoryView';

export default function AdminDashboard({
  inventory = [],
  callHistory = [],
  onSelectCar,
  onUpdateCar,
  onUpdateCall,
  onDeleteCall
}) {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'calls'
  const [highlightedCallId, setHighlightedCallId] = useState(null);

  // Metrics
  const totalCars = inventory.length;
  const bookedDrivesCount = inventory.filter((c) => c.testDriveBooked === 'Yes').length;
  const availableCars = totalCars - bookedDrivesCount;
  const totalCalls = callHistory.length;
  const bookedFromCalls = callHistory.filter((c) => c.testDriveBooked === 'Yes').length;
  const conversionRate = totalCalls > 0 ? Math.round((bookedFromCalls / totalCalls) * 100) : 0;

  // Jump from Inventory to specific Call
  const handleSelectCall = (callId) => {
    setActiveTab('calls');
    setHighlightedCallId(callId);
    setTimeout(() => setHighlightedCallId(null), 3000);
  };

  // Export 120 cars to CSV
  const handleExportCSV = () => {
    const headers = [
      'Car ID',
      'Model',
      'Variant',
      'Manufacturing Date',
      'Manufacturing Year',
      'Fuel Type',
      'Transmission',
      'Mileage',
      'Color',
      'Price (₹ Lakhs)',
      'Stock Status',
      'Test Drive Booked',
      'Test Drive Slot',
      'Customer Name',
      'Customer Phone'
    ];

    const rows = inventory.map((c) => [
      c.id,
      c.model,
      c.variant,
      c.mfgDate,
      c.mfgYear,
      c.fuelType,
      c.transmission,
      c.mileage,
      `"${c.color}"`,
      c.priceLakhs,
      c.stockStatus,
      c.testDriveBooked,
      `"${c.testDriveSlot}"`,
      `"${c.customerCall?.customerName || ''}"`,
      `"${c.customerCall?.customerPhone || ''}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Maruti_Bazzar_120_Cars_Inventory.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inventory */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Cars in Inventory
            </span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-300">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-mono">{totalCars}</span>
            <span className="text-xs text-teal-400 font-medium">120 Verified Units</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Available for Voice Agent queries</p>
        </div>

        {/* Test Drives Booked */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Test Drives Booked
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-300">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-300 font-mono">
              {bookedDrivesCount}
            </span>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-medium">
              {Math.round((bookedDrivesCount / totalCars) * 100)}% Booked
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Scheduled customer test sessions</p>
        </div>

        {/* Available Cars */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Ready for Test Drive
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-300">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-cyan-300 font-mono">{availableCars}</span>
            <span className="text-xs text-slate-400">Immediate Showroom Stock</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Available for customer demonstration</p>
        </div>

        {/* Total Calls & Conversion */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Calls &amp; Conversion
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-300">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-purple-300 font-mono">{totalCalls}</span>
            <span className="text-xs text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded font-medium">
              {conversionRate}% Booked
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Inbound voice agent conversion rate</p>
        </div>
      </div>

      {/* Sub-Navigation & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        {/* Tab Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'inventory'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/25'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>120 Cars Inventory Database</span>
            <span className="bg-teal-950/60 text-teal-200 px-1.5 py-0.5 rounded-full text-[10px] font-mono">
              120
            </span>
          </button>

          <button
            onClick={() => setActiveTab('calls')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'calls'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/25'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call History &amp; Recordings</span>
            <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-full text-[10px] font-mono">
              {callHistory.length}
            </span>
          </button>
        </div>

        {/* Export CSV Button */}
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-xl transition-all shadow-sm"
          title="Export 120 cars inventory to CSV spreadsheet"
        >
          <Download className="w-3.5 h-3.5 text-teal-400" />
          <span>Export 120 Cars (CSV)</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'inventory' ? (
        <InventoryTable
          inventory={inventory}
          onSelectCall={handleSelectCall}
          onUpdateCar={onUpdateCar}
        />
      ) : (
        <CallHistoryView
          callHistory={callHistory}
          activeCallHighlight={highlightedCallId}
          onUpdateCall={onUpdateCall}
          onDeleteCall={onDeleteCall}
        />
      )}
    </div>
  );
}
