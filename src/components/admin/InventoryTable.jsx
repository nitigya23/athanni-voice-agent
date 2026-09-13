import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Fuel,
  Gauge,
  CheckCircle2,
  XCircle,
  PhoneCall,
  User,
  Car,
  ChevronLeft,
  ChevronRight,
  Info,
  ExternalLink,
  Volume2,
  Edit3,
  ToggleLeft,
  ToggleRight,
  Plus,
  RefreshCw,
  FileSpreadsheet,
  Download,
  Upload,
  Sparkles,
  Check,
  AlertCircle,
  X
} from 'lucide-react';
import { convertToGoogleSheetsCsvUrl, parseInventoryCsv } from '../../data/carsInventory';

export default function InventoryTable({
  inventory = [],
  onSelectCall,
  onUpdateCar = () => {},
  onAddCar = () => {},
  onBulkReplaceInventory = () => {}
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFuel, setSelectedFuel] = useState('ALL');
  const [selectedBookedFilter, setSelectedBookedFilter] = useState('ALL');
  const [selectedModel, setSelectedModel] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [selectedCarModal, setSelectedCarModal] = useState(null);

  // Google Sheets Sync & Add Car States
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);
  const [googleSheetUrl, setGoogleSheetUrl] = useState(() => {
    try {
      return localStorage.getItem('maruti_bazzar_sheet_url') || '';
    } catch {
      return '';
    }
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const fileInputRef = useRef(null);

  // Form State for Adding a New Vehicle
  const [newCarForm, setNewCarForm] = useState({
    model: 'Swift',
    variant: 'VXi',
    mfgDate: new Date().toISOString().split('T')[0],
    mfgYear: new Date().getFullYear(),
    fuelType: 'Petrol',
    transmission: '5-Speed Manual',
    mileage: '22.35 km/l',
    color: 'Pearl Arctic White',
    priceLakhs: 7.25,
    stockStatus: 'In Stock (Fresh Arrival)'
  });

  // Unique model list for dropdown
  const modelOptions = useMemo(() => {
    const set = new Set(inventory.map((c) => c.model));
    return Array.from(set).sort();
  }, [inventory]);

  // Handle Google Sheet Fetch & Sync
  const handleSyncGoogleSheet = async (e) => {
    if (e) e.preventDefault();
    if (!googleSheetUrl || !googleSheetUrl.trim()) {
      setSyncStatus({ type: 'error', message: 'Please paste your Google Sheet link or publish URL.' });
      return;
    }

    setIsSyncing(true);
    setSyncStatus(null);

    try {
      const csvUrl = convertToGoogleSheetsCsvUrl(googleSheetUrl);
      const res = await fetch(csvUrl);
      if (!res.ok) {
        throw new Error(`Failed to fetch sheet (HTTP ${res.status}). Make sure "Share -> Anyone with the link can view" or "File -> Share -> Publish to web (CSV)" is enabled.`);
      }
      const csvText = await res.text();
      const parsedCars = parseInventoryCsv(csvText);

      if (parsedCars.length === 0) {
        throw new Error('No valid car rows found in the sheet. Please ensure column headers match the template.');
      }

      onBulkReplaceInventory(parsedCars);
      try {
        localStorage.setItem('maruti_bazzar_sheet_url', googleSheetUrl.trim());
      } catch (e) {}

      setSyncStatus({
        type: 'success',
        message: `Successfully synced ${parsedCars.length} cars from Google Sheets! Voice Agent is now updated.`
      });
      setTimeout(() => {
        setIsSyncModalOpen(false);
        setSyncStatus(null);
      }, 1500);
    } catch (err) {
      console.error('Google sheet sync error:', err);
      setSyncStatus({
        type: 'error',
        message: err.message || 'Could not sync Google Sheet. Please check the share permissions.'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle local CSV File Upload
  const handleLocalCsvUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        const parsedCars = parseInventoryCsv(text);
        if (parsedCars.length > 0) {
          onBulkReplaceInventory(parsedCars);
          alert(`Successfully loaded ${parsedCars.length} cars from ${file.name}!`);
        } else {
          alert('Could not find valid vehicle rows in the selected CSV file.');
        }
      } catch (err) {
        alert('Failed to parse CSV file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Handle Adding New Car
  const handleAddNewCarSubmit = (e) => {
    e.preventDefault();
    const newId = `MB-${inventory.length + 101}`;
    const carToAdd = {
      id: newId,
      model: newCarForm.model,
      variant: newCarForm.variant,
      mfgDate: newCarForm.mfgDate,
      mfgYear: parseInt(newCarForm.mfgYear) || new Date().getFullYear(),
      fuelType: newCarForm.fuelType,
      transmission: newCarForm.transmission,
      mileage: newCarForm.mileage,
      color: newCarForm.color,
      priceLakhs: parseFloat(newCarForm.priceLakhs) || 7.0,
      stockStatus: newCarForm.stockStatus,
      testDriveBooked: 'No',
      testDriveSlot: 'Available',
      customerCall: {
        hasBooking: false,
        customerName: 'None',
        customerPhone: 'N/A',
        callId: 'None',
        bookingSlot: 'Available for Booking',
        callRecorded: false,
        notes: 'Added via Admin Dashboard'
      }
    };

    onAddCar(carToAdd);
    setIsAddCarModalOpen(false);
  };

  // Filtering logic
  const filteredCars = useMemo(() => {
    return inventory.filter((car) => {
      // Search
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        car.id.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query) ||
        car.variant.toLowerCase().includes(query) ||
        car.color.toLowerCase().includes(query) ||
        car.customerCall?.customerName?.toLowerCase().includes(query);

      // Fuel filter
      const matchesFuel =
        selectedFuel === 'ALL' || car.fuelType.toLowerCase() === selectedFuel.toLowerCase();

      // Booked filter
      const matchesBooked =
        selectedBookedFilter === 'ALL' ||
        (selectedBookedFilter === 'YES' && car.testDriveBooked === 'Yes') ||
        (selectedBookedFilter === 'NO' && car.testDriveBooked === 'No');

      // Model filter
      const matchesModel =
        selectedModel === 'ALL' || car.model.toLowerCase() === selectedModel.toLowerCase();

      return matchesSearch && matchesFuel && matchesBooked && matchesModel;
    });
  }, [inventory, searchQuery, selectedFuel, selectedBookedFilter, selectedModel]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage) || 1;
  const paginatedCars = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCars.slice(start, start + itemsPerPage);
  }, [filteredCars, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden File Input for CSV Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleLocalCsvUpload}
        accept=".csv"
        className="hidden"
      />

      {/* Action Bar: Google Sheet Sync & Add Car */}
      <div className="bg-[#0a1228]/85 border border-[#182c60]/90 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <span>Google Sheets &amp; Live Stock Sync</span>
              <span className="text-[10px] bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                Live Dynamic
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Edit the Google Sheet when cars arrive &rarr; Shweta instantly quotes them to callers.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Quick Add Car Button */}
          <button
            onClick={() => setIsAddCarModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Add Car</span>
          </button>

          {/* Google Sheets Sync Button */}
          <button
            onClick={() => setIsSyncModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-400 to-teal-600 hover:from-emerald-300 hover:to-teal-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 stroke-[2.5] ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync Google Sheet</span>
          </button>

          {/* Upload CSV */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-slate-200 border border-navy-700 transition-colors"
            title="Import from local CSV file"
          >
            <Upload className="w-4 h-4" />
          </button>

          {/* Download Template */}
          <a
            href="/Maruti_Bazzar_Inventory_Template.csv"
            download="Maruti_Bazzar_Inventory_Template.csv"
            className="p-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-slate-200 border border-navy-700 transition-colors"
            title="Download CSV Template"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Controls Header */}
      <div className="bg-[#0a1228]/85 border border-[#182c60]/90 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        {/* Search Input */}
        <div className="relative w-full md:w-88">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by model, ID (MB-001), color..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#0b0f17] border border-[#182c60]/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
          />
        </div>

        {/* Filter Badges & Selectors */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Model Filter */}
          <select
            value={selectedModel}
            onChange={(e) => {
              setSelectedModel(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#0b0f17] border border-[#182c60]/80 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Models ({inventory.length})</option>
            {modelOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* Test Drive Booked Status Filter */}
          <div className="flex bg-[#0b0f17] border border-[#182c60]/80 rounded-xl p-1 text-xs">
            <button
              onClick={() => {
                setSelectedBookedFilter('ALL');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedBookedFilter === 'ALL'
                  ? 'bg-navy-900 text-cyan-300 shadow-[0_0_10px_rgba(0,242,254,0.2)] border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setSelectedBookedFilter('YES');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                selectedBookedFilter === 'YES'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Booked</span>
            </button>
            <button
              onClick={() => {
                setSelectedBookedFilter('NO');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                selectedBookedFilter === 'NO'
                  ? 'bg-navy-900 text-slate-200 border border-navy-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Available</span>
            </button>
          </div>

          {/* Items per page */}
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-[#0b0f17] border border-[#182c60]/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300"
          >
            <option value={15}>15 / page</option>
            <option value={30}>30 / page</option>
            <option value={60}>60 / page</option>
            <option value={120}>All {inventory.length} cars</option>
          </select>
        </div>
      </div>

      {/* 120 Cars Table */}
      <div className="bg-[#0a1228]/85 border border-[#182c60]/90 rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#182c60]/80 bg-[#0b0f17] text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Car ID</th>
                <th className="py-3.5 px-4">Model &amp; Trim</th>
                <th className="py-3.5 px-4 text-cyan-400">Mfg Date &amp; Specs</th>
                <th className="py-3.5 px-4">Color</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock Status</th>
                <th className="py-3.5 px-4 text-emerald-400">Test Drive Booked?</th>
                <th className="py-3.5 px-4 text-cyan-400">Customer Call</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182c60]/60">
              {paginatedCars.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <Car className="w-8 h-8 mx-auto mb-2 opacity-40 text-cyan-400" />
                    <p className="text-sm font-semibold text-slate-300">No cars found matching your search</p>
                    <p className="text-xs text-slate-500">Try changing or clearing your filters</p>
                  </td>
                </tr>
              ) : (
                paginatedCars.map((car) => {
                  const isBooked = car.testDriveBooked === 'Yes';
                  return (
                    <tr
                      key={car.id}
                      className="hover:bg-navy-900/40 transition-colors group cursor-pointer"
                      onClick={() => setSelectedCarModal(car)}
                    >
                      {/* Car ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-teal-700 dark:text-teal-300">
                        {car.id}
                      </td>

                      {/* Model & Variant */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <span>{car.model}</span>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-300 px-1.5 py-0.5 rounded font-mono font-semibold">
                            {car.variant}
                          </span>
                        </div>
                      </td>

                      {/* Manufacturing Date & Full Specs */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-200 font-semibold">
                            <Calendar className="w-3 h-3 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                            <span>Mfg: <strong>{car.mfgDate}</strong> ({car.mfgYear})</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-0.5 font-medium">
                              <Fuel className="w-2.5 h-2.5 text-amber-500" />
                              {car.fuelType}
                            </span>
                            <span>&bull;</span>
                            <span>{car.transmission}</span>
                            <span>&bull;</span>
                            <span className="text-teal-600 dark:text-teal-400/90 font-medium">{car.mileage}</span>
                          </div>
                        </div>
                      </td>

                      {/* Color */}
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-slate-400 dark:border-slate-600"
                            style={{
                              backgroundColor: car.color.toLowerCase().includes('white')
                                ? '#f8fafc'
                                : car.color.toLowerCase().includes('blue')
                                ? '#2563eb'
                                : car.color.toLowerCase().includes('red')
                                ? '#dc2626'
                                : car.color.toLowerCase().includes('grey') || car.color.toLowerCase().includes('silver')
                                ? '#94a3b8'
                                : '#eab308',
                            }}
                          />
                          <span className="truncate max-w-[110px] font-medium">{car.color}</span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100 font-mono text-sm">
                        ₹{car.priceLakhs.toFixed(2)} L
                      </td>

                      {/* Stock Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${
                            car.stockStatus.includes('Booked')
                              ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/30'
                              : 'bg-teal-50 dark:bg-teal-500/10 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-500/30'
                          }`}
                        >
                          {car.stockStatus}
                        </span>
                      </td>

                      {/* Test Drive Booked Column */}
                      <td className="py-3.5 px-4">
                        {isBooked ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>YES</span>
                            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-normal">
                              ({car.testDriveSlot})
                            </span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold text-xs">
                            <XCircle className="w-3.5 h-3.5 text-slate-400" />
                            <span>NO</span>
                            <span className="text-[10px] text-slate-500">(Available)</span>
                          </div>
                        )}
                      </td>

                      {/* Customer Call Recorded Column */}
                      <td className="py-3.5 px-4">
                        {car.customerCall?.hasBooking ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-900 dark:text-slate-200">
                              <User className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                              <span>{car.customerCall.customerName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                              <span>{car.customerCall.customerPhone}</span>
                              <span className="inline-flex items-center gap-0.5 text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-1 rounded font-bold">
                                <Volume2 className="w-2.5 h-2.5" /> Call Logged
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 italic text-[11px]">
                            No call yet
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {/* Quick Toggle Test Drive Status */}
                          <button
                            onClick={() => {
                              const newStatus = isBooked ? 'No' : 'Yes';
                              const newSlot = isBooked ? 'Available' : 'Booked via Admin';
                              onUpdateCar(car.id, {
                                testDriveBooked: newStatus,
                                testDriveSlot: newSlot,
                                stockStatus: isBooked ? 'Available' : 'Booked for Drive'
                              });
                            }}
                            className={`p-1.5 rounded-xl border text-xs font-semibold transition-all ${
                              isBooked
                                ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40 hover:bg-emerald-200'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:text-teal-600'
                            }`}
                            title={isBooked ? 'Click to mark Available' : 'Click to mark Test Drive Booked'}
                          >
                            {isBooked ? <ToggleRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                          </button>

                          <button
                            onClick={() => setSelectedCarModal(car)}
                            className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            title="View Full Vehicle Details"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer & Pagination */}
        <div className="px-4 py-3.5 border-t border-[#182c60]/80 bg-[#0b0f17] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            Showing{' '}
            <strong className="text-white">
              {filteredCars.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
            </strong>{' '}
            to{' '}
            <strong className="text-white">
              {Math.min(currentPage * itemsPerPage, filteredCars.length)}
            </strong>{' '}
            of <strong className="text-cyan-400 font-bold">{filteredCars.length}</strong> cars in stock
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-navy-700 bg-navy-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-navy-800 transition-colors text-slate-200 shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-mono font-bold text-cyan-300 text-xs bg-[#060b18] border border-navy-800 rounded-lg">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-navy-700 bg-navy-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-navy-800 transition-colors text-slate-200 shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      {/* Vehicle Specification & Linked Call Modal */}
      {selectedCarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="bg-[#0a1228] border border-[#182c60] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#182c60] bg-[#060b18]">
              <div className="flex items-center gap-2.5">
                <Car className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="font-bold text-white text-base">
                    {selectedCarModal.model} {selectedCarModal.variant}
                  </h3>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    Unit ID: {selectedCarModal.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCarModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar text-xs">
              {/* Core Specs Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0b0f17] border border-[#182c60]/80 p-3.5 rounded-xl space-y-1">
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    Manufacturing Date
                  </span>
                  <p className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    {selectedCarModal.mfgDate} ({selectedCarModal.mfgYear})
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 p-3.5 rounded-xl space-y-1">
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    Ex-Showroom Price
                  </span>
                  <p className="font-bold text-teal-700 dark:text-teal-300 text-sm font-mono">
                    ₹{selectedCarModal.priceLakhs.toFixed(2)} Lakhs
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 p-3.5 rounded-xl space-y-1">
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    Fuel &amp; Transmission
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedCarModal.fuelType} &bull; {selectedCarModal.transmission}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 p-3.5 rounded-xl space-y-1">
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    ARAI Certified Mileage
                  </span>
                  <p className="font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5" />
                    {selectedCarModal.mileage}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 p-3.5 rounded-xl space-y-1 col-span-2">
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    Exterior Color &amp; Stock Availability
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                    <span>{selectedCarModal.color}</span>
                    <span className="text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 px-2.5 py-0.5 rounded text-xs font-bold border border-teal-200 dark:border-teal-500/20">
                      {selectedCarModal.stockStatus}
                    </span>
                  </p>
                </div>
              </div>

              {/* Test Drive & Customer Call Section */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>Test Drive &amp; Customer Call Record</span>
                </h4>

                {selectedCarModal.customerCall?.hasBooking ? (
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold text-xs border border-emerald-300 dark:border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>TEST DRIVE BOOKED</span>
                      </div>
                      <span className="text-xs font-mono text-emerald-800 dark:text-emerald-300 font-bold">
                        Slot: {selectedCarModal.customerCall.bookingSlot}
                      </span>
                    </div>

                    <div className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/80">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Customer Name:</span>
                        <strong className="text-slate-900 dark:text-slate-100">
                          {selectedCarModal.customerCall.customerName}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Contact Number:</span>
                        <span className="font-mono font-bold text-cyan-700 dark:text-cyan-300">
                          {selectedCarModal.customerCall.customerPhone}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Linked Call ID:</span>
                        <span className="font-mono text-slate-500 dark:text-slate-400">
                          {selectedCarModal.customerCall.callId}
                        </span>
                      </div>
                      <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 italic">
                        "{selectedCarModal.customerCall.notes}"
                      </div>
                    </div>

                    {onSelectCall && (
                      <button
                        onClick={() => {
                          const callId = selectedCarModal.customerCall.callId;
                          setSelectedCarModal(null);
                          onSelectCall(callId);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 text-xs bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-all shadow-md shadow-teal-600/20 cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Listen to Customer Call Recording</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center space-y-2">
                    <XCircle className="w-6 h-6 mx-auto text-slate-400" />
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      No Test Drive Booked for this Car
                    </p>
                    <p className="text-[11px] text-slate-500">
                      This unit ({selectedCarModal.id}) is available for immediate customer booking.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  const isBooked = selectedCarModal.testDriveBooked === 'Yes';
                  const newStatus = isBooked ? 'No' : 'Yes';
                  const newSlot = isBooked ? 'Available' : 'Booked via Admin';
                  const updatedFields = {
                    testDriveBooked: newStatus,
                    testDriveSlot: newSlot,
                    stockStatus: isBooked ? 'Available' : 'Booked for Drive',
                    customerCall: {
                      hasBooking: !isBooked,
                      customerName: isBooked ? 'None' : 'Showroom Customer',
                      customerPhone: isBooked ? 'N/A' : '+91 98999 00000',
                      callId: isBooked ? 'None' : 'ADMIN-RESERVED',
                      bookingSlot: newSlot,
                      callRecorded: false,
                      notes: isBooked ? 'No test drive scheduled' : 'Reserved directly in dashboard'
                    }
                  };
                  onUpdateCar(selectedCarModal.id, updatedFields);
                  setSelectedCarModal({ ...selectedCarModal, ...updatedFields });
                }}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all shadow-sm ${
                  selectedCarModal.testDriveBooked === 'Yes'
                    ? 'bg-red-50 dark:bg-red-500/15 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-300 hover:bg-red-100'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                }`}
              >
                {selectedCarModal.testDriveBooked === 'Yes' ? 'Mark Available (Cancel Booking)' : 'Book Test Drive for this Car'}
              </button>

              <button
                onClick={() => setSelectedCarModal(null)}
                className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Sheets Sync Modal */}
      {isSyncModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="bg-[#0a1228] border border-[#182c60] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#182c60] bg-[#060b18]">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base">
                    Google Sheets Real-Time Sync
                  </h3>
                  <p className="text-xs text-slate-400">
                    Connect dealership inventory sheet directly to Shweta
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSyncModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSyncGoogleSheet} className="p-6 space-y-4 text-xs">
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 text-emerald-300 leading-relaxed space-y-1.5">
                <p className="font-bold flex items-center gap-1.5 text-xs sm:text-sm text-emerald-300">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  How to connect your Google Sheet:
                </p>
                <ol className="list-decimal list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <li>In Google Sheets, click <strong>File &rarr; Share &rarr; Publish to web</strong>.</li>
                  <li>Select <strong>Comma-separated values (.csv)</strong> and click <strong>Publish</strong>.</li>
                  <li>Or simply click <strong>Share &rarr; Anyone with the link can view</strong> and paste that link below!</li>
                </ol>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5 text-xs">
                  Google Sheet Share or CSV Export URL:
                </label>
                <input
                  type="url"
                  value={googleSheetUrl}
                  onChange={(e) => setGoogleSheetUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/your-sheet-id/edit#gid=0"
                  className="w-full bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-navy-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 font-mono"
                  required
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  * Download the <a href="/Maruti_Bazzar_Inventory_Template.csv" download className="text-cyan-600 dark:text-cyan-400 font-bold underline">Template CSV</a> to copy into your Google Sheet.
                </span>
              </div>

              {syncStatus && (
                <div
                  className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                    syncStatus.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                      : 'bg-red-50 dark:bg-red-500/10 border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-300'
                  }`}
                >
                  {syncStatus.type === 'success' ? (
                    <Check className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500 dark:text-red-400" />
                  )}
                  <span>{syncStatus.message}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsSyncModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-navy-900 hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSyncing}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl shadow-md shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Inventory Now'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Car Modal */}
      {isAddCarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="bg-[#0a1228] border border-[#182c60] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#182c60] bg-[#060b18]">
              <div className="flex items-center gap-2.5">
                <Car className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base">
                    + Add New Car to Stock
                  </h3>
                  <p className="text-xs text-slate-400">
                    Immediately available to Shweta for caller inquiries
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddCarModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewCarSubmit} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Model Name:</label>
                  <select
                    value={newCarForm.model}
                    onChange={(e) => setNewCarForm({ ...newCarForm, model: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:border-teal-500"
                  >
                    {['Swift', 'Brezza', 'Baleno', 'Grand Vitara', 'Fronx', 'Dzire', 'Ertiga', 'XL6', 'Jimny', 'Alto K10', 'WagonR', 'Ciaz', 'Celerio', 'Invicto'].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Variant / Trim:</label>
                  <input
                    type="text"
                    value={newCarForm.variant}
                    onChange={(e) => setNewCarForm({ ...newCarForm, variant: e.target.value })}
                    placeholder="e.g. ZXi+, Alpha, VXi"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Fuel Type:</label>
                  <select
                    value={newCarForm.fuelType}
                    onChange={(e) => setNewCarForm({ ...newCarForm, fuelType: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:border-teal-500"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="CNG">CNG</option>
                    <option value="Strong Hybrid">Strong Hybrid</option>
                    <option value="Smart Hybrid">Smart Hybrid</option>
                    <option value="Turbo Petrol">Turbo Petrol</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Transmission:</label>
                  <select
                    value={newCarForm.transmission}
                    onChange={(e) => setNewCarForm({ ...newCarForm, transmission: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:border-teal-500"
                  >
                    <option value="5-Speed Manual">5-Speed Manual</option>
                    <option value="6-Speed Automatic">6-Speed Automatic</option>
                    <option value="5-Speed AGS">5-Speed AGS (AMT)</option>
                    <option value="CVT">CVT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Manufacturing Year:</label>
                  <input
                    type="number"
                    value={newCarForm.mfgYear}
                    onChange={(e) => setNewCarForm({ ...newCarForm, mfgYear: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Price (₹ in Lakhs):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newCarForm.priceLakhs}
                    onChange={(e) => setNewCarForm({ ...newCarForm, priceLakhs: e.target.value })}
                    placeholder="e.g. 7.85"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-slate-100 font-mono font-bold focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Exterior Color:</label>
                  <input
                    type="text"
                    value={newCarForm.color}
                    onChange={(e) => setNewCarForm({ ...newCarForm, color: e.target.value })}
                    placeholder="e.g. Pearl Arctic White"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">ARAI Mileage:</label>
                  <input
                    type="text"
                    value={newCarForm.mileage}
                    onChange={(e) => setNewCarForm({ ...newCarForm, mileage: e.target.value })}
                    placeholder="e.g. 24.5 km/l"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Stock Status:</label>
                <input
                  type="text"
                  value={newCarForm.stockStatus}
                  onChange={(e) => setNewCarForm({ ...newCarForm, stockStatus: e.target.value })}
                  placeholder="e.g. In Stock (Showroom Ready)"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddCarModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-md shadow-teal-600/25 active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Car to Inventory</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
