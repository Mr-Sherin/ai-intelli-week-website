import { useState } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function AttendanceTable({ 
  registrations, 
  email, 
  password, 
  onAttendanceChange 
}: { 
  registrations: any[]; 
  email?: string; 
  password?: string; 
  onAttendanceChange?: (id: string, newAttendance: string[]) => void;
}) {
  // The specific dates for the internship in YYYY-MM-DD format
  // Assuming the year is 2026 based on previous context.
  const INTERNSHIP_DATES = [
    { label: 'Jun 13', value: '2026-06-13' },
    { label: 'Jun 15', value: '2026-06-15' },
    { label: 'Jun 16', value: '2026-06-16' },
    { label: 'Jun 17', value: '2026-06-17' },
    { label: 'Jun 18', value: '2026-06-18' },
    { label: 'Jun 19', value: '2026-06-19' },
    { label: 'Jun 22', value: '2026-06-22' },
    { label: 'Jun 23', value: '2026-06-23' },
    { label: 'Jun 24', value: '2026-06-24' },
    { label: 'Jun 25', value: '2026-06-25' },
    { label: 'Jun 26', value: '2026-06-26' }
  ];

  // We only want to show attendance for verified attendees (those who actually got tickets)
  const verifiedRegistrations = [...registrations]
    .filter(r => r.payment_status === 'verified')
    .sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''));

  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const toggleAttendance = async (regId: string, dateValue: string) => {
    if (!email || !password || !onAttendanceChange) return;

    const key = `${regId}-${dateValue}`;
    setLoadingMap(prev => ({ ...prev, [key]: true }));

    try {
      const res = await fetch('/api/admin/toggle-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: regId, date: dateValue, email, password })
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to toggle attendance');
      }

      onAttendanceChange(regId, result.attendance);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoadingMap(prev => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Attendance Tracker</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track daily check-ins for the internship program.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
              <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider sticky left-0 bg-slate-50 dark:bg-slate-950 z-10 border-r border-slate-200 dark:border-slate-800">SL No</th>
              <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider sticky left-[60px] bg-slate-50 dark:bg-slate-950 z-10 border-r border-slate-200 dark:border-slate-800 min-w-[200px]">Attendee Name</th>
              
              {INTERNSHIP_DATES.map((date) => (
                <th key={date.value} className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center border-r border-slate-100 dark:border-slate-800 last:border-r-0">
                  {date.label}
                </th>
              ))}
              
              <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center border-l border-slate-200 dark:border-slate-800">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {verifiedRegistrations.length === 0 ? (
              <tr>
                <td colSpan={INTERNSHIP_DATES.length + 3} className="p-8 text-center text-slate-500">
                  No verified attendees yet.
                </td>
              </tr>
            ) : (
              verifiedRegistrations.map((reg, idx) => {
                const attendanceLog: string[] = Array.isArray(reg.attendance) ? reg.attendance : [];
                
                // Calculate total days attended (only counting the official dates)
                const totalAttended = INTERNSHIP_DATES.filter(date => attendanceLog.includes(date.value)).length;
                const attendancePercentage = (totalAttended / INTERNSHIP_DATES.length) * 100;

                return (
                  <tr key={reg.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="p-4 text-sm font-bold text-slate-700 dark:text-slate-300 text-center sticky left-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 group-hover:bg-slate-50 dark:group-hover:bg-slate-800">
                      {idx + 1}
                    </td>
                    <td className="p-4 sticky left-[60px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 min-w-[200px]">
                      <p className="font-bold text-slate-900 dark:text-white">{reg.full_name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{reg.college}</p>
                    </td>

                    {INTERNSHIP_DATES.map((date) => {
                      const isPresent = attendanceLog.includes(date.value);
                      const key = `${reg.id}-${date.value}`;
                      const isLoading = loadingMap[key];
                      
                      return (
                        <td key={date.value} className="p-2 sm:p-4 text-center border-r border-slate-100 dark:border-slate-800 last:border-r-0">
                          <div className="flex justify-center">
                            <button
                              onClick={() => toggleAttendance(reg.id, date.value)}
                              disabled={isLoading}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm disabled:opacity-50
                                ${isPresent 
                                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-red-50 hover:text-red-500 hover:dark:bg-red-900/30 hover:dark:text-red-400' 
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 hover:bg-emerald-50 hover:text-emerald-500 hover:dark:bg-emerald-900/30 hover:dark:text-emerald-400'
                                }`}
                              title={isPresent ? "Mark Absent" : "Mark Present"}
                            >
                              {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
                              ) : isPresent ? (
                                <CheckCircle2 className="w-5 h-5" />
                              ) : (
                                <XCircle className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </td>
                      );
                    })}

                    <td className="p-4 text-center border-l border-slate-200 dark:border-slate-800">
                      <div className="flex flex-col items-center">
                        <span className={`text-sm font-bold ${
                          attendancePercentage >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 
                          attendancePercentage >= 50 ? 'text-amber-500 dark:text-amber-400' : 'text-red-500 dark:text-red-400'
                        }`}>
                          {totalAttended}/{INTERNSHIP_DATES.length}
                        </span>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                          <div 
                            className={`h-1.5 rounded-full ${
                              attendancePercentage >= 75 ? 'bg-emerald-500' : 
                              attendancePercentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${attendancePercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
