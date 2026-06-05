"use client";

import { useState } from 'react';
import { Lock, Mail, Key, Download, RefreshCw, FileText, CheckCircle2, QrCode, Trash2, IdCard } from 'lucide-react';
import { motion } from 'framer-motion';
import QRScanner from '@/components/QRScanner';
import AttendanceTable from '@/components/AttendanceTable';

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'registrations' | 'scanner' | 'attendance'>('registrations');

  const handleLogin = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Login failed');
      }

      setRegistrations(result.data || []);
      setIsLoggedIn(true);
    } catch (err: any) {
      if (isLoggedIn) {
        alert("Error refreshing data: " + err.message);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus, email, password })
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      // Update local state to reflect the change immediately
      setRegistrations(prev => 
        prev.map(reg => reg.id === id ? { ...reg, payment_status: newStatus } : reg)
      );
    } catch (err) {
      alert("Error updating status: " + (err as Error).message);
    }
  };

  const deleteRegistration = async (id: string) => {
    if (!window.confirm("WARNING: Are you sure you want to delete this registration? This action cannot be undone and will permanently remove all data for this attendee.")) {
      return;
    }
    
    try {
      const res = await fetch('/api/admin/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, email, password })
      });

      if (!res.ok) {
        throw new Error('Failed to delete registration');
      }

      setRegistrations(prev => prev.filter(reg => reg.id !== id));
    } catch (err) {
      alert("Error deleting registration: " + (err as Error).message);
    }
  };

  const downloadCSV = () => {
    if (registrations.length === 0) return;

    // Define CSV Headers
    const headers = [
      "Registration Date",
      "Full Name",
      "Email",
      "Phone",
      "College",
      "Department",
      "Semester/Designation",
      "Ticket Type",
      "IEEE Member ID",
      "IEEE Card URL",
      "Ticket ID",
      "Payment Status",
      "Payment Submitted At",
      "UPI Transaction ID",
      "Message",
      "Screenshot URL",
      "Ticket QR URL"
    ];

    // Map data to rows
    const rows = registrations.map(reg => [
      new Date(reg.created_at).toLocaleString(),
      reg.full_name,
      reg.email,
      reg.phone,
      reg.college,
      reg.department,
      reg.year_designation,
      reg.is_ieee_member ? "IEEE Member" : "General",
      reg.ieee_member_id || "N/A",
      reg.ieee_card_url || "N/A",
      reg.ticket_id,
      reg.payment_status,
      reg.payment_submitted_at ? new Date(reg.payment_submitted_at).toLocaleString() : "N/A",
      reg.transaction_reference || "N/A",
      reg.message || "N/A",
      reg.payment_screenshot_url || "N/A",
      reg.ticket_qr_url || "N/A"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `AI_Week_Registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none"></div>
        
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleLogin}
          className="bg-slate-800/80 backdrop-blur-2xl p-8 sm:p-12 rounded-3xl shadow-2xl border border-slate-700 max-w-md w-full relative z-10"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl border border-slate-700 flex items-center justify-center shadow-inner">
              <Lock className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
          
          <h2 className="text-3xl font-black text-white text-center mb-2 tracking-tight">Admin Portal</h2>
          <p className="text-slate-400 text-center mb-8 font-medium">Enter your credentials to access live data</p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <div className="space-y-5 mb-8">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin Email"
                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-white placeholder-slate-500 font-medium"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400">
                <Key className="w-5 h-5" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin Password"
                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-white placeholder-slate-500 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
              <Lock className="w-6 h-6 mr-3 text-cyan-600" />
              Admin Dashboard
            </h1>
            <p className="text-slate-500 font-medium mt-1">Live Registration Data</p>
          </div>
          
          <div className="flex bg-slate-200 p-1 rounded-xl w-full md:w-auto overflow-hidden">
            <button
              onClick={() => setActiveTab('registrations')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'registrations' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Registrations
            </button>
            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'scanner' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              QR Scanner
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'attendance' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Attendance
            </button>
          </div>
        </div>

        {activeTab === 'scanner' ? (
          <QRScanner email={email} password={password} />
        ) : activeTab === 'attendance' ? (
          <AttendanceTable registrations={registrations} />
        ) : (
          <>
            <div className="flex justify-end mb-4 gap-3">
              <button
                onClick={() => handleLogin()}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={downloadCSV}
                className="flex items-center px-5 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">SL No</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Attendee</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">College/Dept</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ticket Info</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Payment</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Links</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {registrations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">No registrations found.</td>
                  </tr>
                ) : (
                  registrations.map((reg, idx) => (
                    <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 text-sm font-bold text-slate-700 text-center">
                        {idx + 1}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="mb-2">
                          <div className="text-xs text-slate-700 font-bold">
                            {new Date(reg.created_at).toLocaleString()}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">Form Submitted</p>
                        </div>
                        {reg.payment_submitted_at && (
                          <div>
                            <div className="text-xs text-slate-700 font-bold">
                              {new Date(reg.payment_submitted_at).toLocaleString()}
                            </div>
                            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Payment Submitted</p>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{reg.full_name}</p>
                        <p className="text-xs text-slate-500">{reg.year_designation}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-medium text-slate-700">{reg.email}</p>
                        <p className="text-xs text-slate-500">{reg.phone}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-medium text-slate-700">{reg.college}</p>
                        <p className="text-xs text-slate-500">{reg.department}</p>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${reg.is_ieee_member ? 'bg-cyan-50 text-cyan-700' : 'bg-slate-100 text-slate-700'}`}>
                          {reg.is_ieee_member ? 'IEEE Member' : 'General'}
                        </span>
                        <p className="text-xs font-mono text-slate-500 mt-1">{reg.ticket_id}</p>
                        {reg.ieee_member_id && (
                          <p className="text-xs font-bold text-cyan-600 mt-1">ID: {reg.ieee_member_id}</p>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {reg.payment_status === 'pending' ? (
                            <div className="flex flex-col items-start gap-2">
                              <span className="flex items-center text-amber-600 text-xs font-bold bg-amber-50 px-2 py-1 rounded">Pending</span>
                              <div className="flex gap-1">
                                <button onClick={() => updateStatus(reg.id, 'verified')} className="text-[10px] bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-2 py-1 rounded transition-colors font-bold">Approve</button>
                                <button onClick={() => updateStatus(reg.id, 'rejected')} className="text-[10px] bg-red-100 text-red-700 hover:bg-red-200 px-2 py-1 rounded transition-colors font-bold">Reject</button>
                              </div>
                            </div>
                          ) : reg.payment_status === 'verified' ? (
                            <span className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Verified
                            </span>
                          ) : (
                            <span className="flex items-center text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded">Rejected</span>
                          )}
                        </div>
                        {reg.transaction_reference && (
                          <p className="text-[10px] font-mono text-slate-400 mt-2" title="UPI Transaction ID">
                            {reg.transaction_reference}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {reg.payment_screenshot_url && (
                            <a href={reg.payment_screenshot_url} target="_blank" rel="noreferrer" className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded transition-colors" title="View Payment Screenshot">
                              <FileText className="w-4 h-4" />
                            </a>
                          )}
                          {reg.ieee_card_url && (
                            <a href={reg.ieee_card_url} target="_blank" rel="noreferrer" className="p-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-600 rounded transition-colors" title="View IEEE Card">
                              <IdCard className="w-4 h-4" />
                            </a>
                          )}
                          {reg.ticket_qr_url && (
                            <a href={reg.ticket_qr_url} target="_blank" rel="noreferrer" className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded transition-colors" title="View Ticket QR">
                              <QrCode className="w-4 h-4" />
                            </a>
                          )}
                          <button onClick={() => deleteRegistration(reg.id)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors ml-auto" title="Delete Registration">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
}
