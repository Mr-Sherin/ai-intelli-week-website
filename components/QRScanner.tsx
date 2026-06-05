"use client";

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { CheckCircle2, XCircle, Loader2, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QRScanner({ email, password }: { email: string, password: string }) {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'already_scanned'>('idle');
  const [message, setMessage] = useState('');
  const [attendee, setAttendee] = useState<any>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    let html5Qrcode: Html5Qrcode | null = null;
    let isMounted = true;
    let startPromise: Promise<any> | null = null;

    const start = async () => {
      // Must wait a tiny bit for the DOM element to be fully ready
      await new Promise(resolve => setTimeout(resolve, 100));
      if (!isMounted) return;

      html5Qrcode = new Html5Qrcode("qr-reader");
      
      startPromise = html5Qrcode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          if (isMounted) onScanSuccess(decodedText);
        },
        () => {} // Ignore continuous scan failures
      );

      try {
        await startPromise;
        if (isMounted) {
          scannerRef.current = html5Qrcode;
        }
      } catch (err) {
        console.error("Failed to start scanner:", err);
      }
    };

    start();

    return () => {
      isMounted = false;
      if (startPromise) {
        startPromise.then(() => {
          if (html5Qrcode && html5Qrcode.isScanning) {
            html5Qrcode.stop().then(() => html5Qrcode?.clear()).catch(console.error);
          }
        }).catch(() => {
          // If start failed, no need to stop
        });
      }
      scannerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onScanSuccess(decodedText: string) {
    // Prevent multiple scans of the same code rapidly
    if (verifyStatus === 'loading') return;
    
    setScanResult(decodedText);
    setVerifyStatus('loading');
    
    // Pause scanner
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.pause();
    }

    try {
      const res = await fetch('/api/admin/verify-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: decodedText, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setVerifyStatus('error');
        setMessage(data.error || 'Verification failed');
        setAttendee(null);
      } else {
        if (data.success) {
          setVerifyStatus('success');
        } else {
          setVerifyStatus('already_scanned');
        }
        setMessage(data.message);
        setAttendee(data.attendee);
      }
    } catch (err: any) {
      setVerifyStatus('error');
      setMessage(err.message);
    }
  };



  const resetScanner = () => {
    setScanResult(null);
    setVerifyStatus('idle');
    setMessage('');
    setAttendee(null);
    if (scannerRef.current) {
      scannerRef.current.resume();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">QR Check-in Scanner</h2>
            <p className="text-slate-500 text-sm mt-1">Scan attendee ticket to mark attendance for today.</p>
          </div>
          <div className="w-12 h-12 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-600">
            <Camera className="w-6 h-6" />
          </div>
        </div>

        {/* Scanner Viewport */}
        <div 
          id="qr-reader" 
          className={`w-full rounded-2xl overflow-hidden border-2 ${verifyStatus === 'idle' ? 'border-cyan-200' : 'border-slate-100'}`}
          style={{ display: verifyStatus === 'idle' ? 'block' : 'none' }}
        ></div>

        {/* Status Indicator */}
        <AnimatePresence mode="wait">
          {verifyStatus !== 'idle' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              {verifyStatus === 'loading' && (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-16 h-16 text-cyan-500 animate-spin mb-4" />
                  <h3 className="text-xl font-bold text-slate-700">Verifying Ticket...</h3>
                  <p className="text-slate-500 font-mono text-sm mt-2">{scanResult}</p>
                </div>
              )}

              {verifyStatus === 'success' && (
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-600 mb-2">Check-in Successful!</h3>
                  <p className="text-emerald-800 bg-emerald-50 px-4 py-2 rounded-lg font-medium">{message}</p>
                </div>
              )}

              {verifyStatus === 'already_scanned' && (
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-12 h-12 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-amber-600 mb-2">Already Checked In</h3>
                  <p className="text-amber-800 bg-amber-50 px-4 py-2 rounded-lg font-medium">{message}</p>
                </div>
              )}

              {verifyStatus === 'error' && (
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <XCircle className="w-12 h-12 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h3>
                  <p className="text-red-800 bg-red-50 px-4 py-2 rounded-lg font-medium max-w-md">{message}</p>
                </div>
              )}

              {attendee && (
                <div className="mt-8 bg-slate-50 p-6 rounded-2xl w-full text-left border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Attendee Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Name</p>
                      <p className="font-bold text-slate-900">{attendee.full_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Ticket Type</p>
                      <p className="font-bold text-cyan-700">{attendee.is_ieee_member ? 'IEEE Member' : 'General'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">College</p>
                      <p className="font-semibold text-slate-700 truncate" title={attendee.college}>{attendee.college}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Ticket ID</p>
                      <p className="font-mono text-sm text-slate-600">{attendee.ticket_id}</p>
                    </div>
                  </div>
                </div>
              )}

              {verifyStatus !== 'loading' && (
                <button
                  onClick={resetScanner}
                  className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
                >
                  Scan Next Ticket
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
