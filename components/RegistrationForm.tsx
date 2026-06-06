"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  CheckCircle2, AlertCircle, QrCode, User, Mail, 
  Phone, Building, Briefcase, GraduationCap, MessageSquare, 
  CreditCard, UploadCloud, ArrowRight, ArrowLeft, ShieldCheck, Download 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import * as htmlToImage from 'html-to-image';
import Tesseract from 'tesseract.js';

export default function RegistrationForm() {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Processing...');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1); // 1: Form, 2: Payment
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [finalTicketId, setFinalTicketId] = useState('');
  const [ieeeCardFile, setIeeeCardFile] = useState<File | null>(null);
  
  const [emailState, setEmailState] = useState<'idle' | 'sending' | 'sent' | 'verifying' | 'verified'>('idle');
  const [otp, setOtp] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    department: '',
    yearDesignation: '',
    isIeeeMember: false,
    ieeeMemberId: '',
    message: '',
    referredBy: ''
  });

  useEffect(() => {
    // Restore state from localStorage if the user switched apps and the browser refreshed
    const savedState = localStorage.getItem('aiWeekRegistrationState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
         
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (parsed.step) setStep(parsed.step);
        if (parsed.registeredEmail) setRegisteredEmail(parsed.registeredEmail);
        if (parsed.finalTicketId) setFinalTicketId(parsed.finalTicketId);
        if (parsed.formData) setFormData(parsed.formData);
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const sendOtp = async () => {
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email first.');
      return;
    }
    
    setEmailState('sending');
    setError(null);

    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, fullName: formData.fullName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send verification code');
      
      setEmailState('sent');
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to send OTP.');
      setEmailState('idle');
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit code.');
      return;
    }
    
    setEmailState('verifying');
    setError(null);

    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP');
      
      setEmailState('verified');
    } catch (err: unknown) {
      setError((err as Error).message || 'Invalid verification code.');
      setEmailState('sent');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailState !== 'verified') {
      setError('Please verify your email address first.');
      return;
    }
    
    setLoading(true);
    setLoadingMessage('Processing...');
    setError(null);

    try {
      let ieeeCardUrl = null;

      if (formData.isIeeeMember && ieeeCardFile) {
        setLoadingMessage('Scanning IEEE Card...');
        
        // --- AI OCR Authenticity Check for IEEE Card ---
        const { data: { text } } = await Tesseract.recognize(ieeeCardFile, 'eng');
        const lowerText = text.toLowerCase();
        
        // Keywords expected on a standard IEEE membership card
        const expectedPhrases = [
          'ieee',
          'membership',
          'thank you',
          'member',
          'contact center',
          'park avenue',
          'ieee.org',
          'section'
        ];
        
        // Count how many of these structural phrases appear in the scan
        const matchCount = expectedPhrases.filter(phrase => lowerText.includes(phrase)).length;
        
        // Require at least 3 matching phrases to prove it's an IEEE card layout
        if (matchCount < 3) {
          throw new Error(`AI Verification Failed: The uploaded document does not appear to be a valid IEEE Membership Card. Please ensure you upload a clear screenshot of the card as shown in the guide.`);
        }
        // --- End AI OCR Check ---

        setLoadingMessage('Uploading Details...');

        const fileExt = ieeeCardFile.name.split('.').pop();
        const fileName = `ieee-${formData.email}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('payment-proofs')
          .upload(fileName, ieeeCardFile);

        if (uploadError) {
          throw new Error('Failed to upload IEEE Membership Card.');
        }

        const { data: { publicUrl } } = supabase.storage
          .from('payment-proofs')
          .getPublicUrl(fileName);
          
        ieeeCardUrl = publicUrl;
      }

      const payload = {
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        college: formData.college,
        department: formData.department,
        yearDesignation: formData.yearDesignation,
        isIeeeMember: formData.isIeeeMember,
        ieeeMemberId: formData.isIeeeMember ? formData.ieeeMemberId : null,
        ieeeCardUrl: formData.isIeeeMember ? ieeeCardUrl : null,
        message: formData.message,
        referredBy: formData.referredBy,
        otp: otp
      };

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit registration');
      }

      setFinalTicketId(data.ticketId);
      setRegisteredEmail(formData.email);
      setStep(2);
      
      // Save state to survive background tab suspensions on mobile
      localStorage.setItem('aiWeekRegistrationState', JSON.stringify({
        step: 2,
        registeredEmail: formData.email,
        finalTicketId: data.ticketId,
        formData: formData
      }));
    } catch (err: unknown) {
      setError((err as Error).message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [txnRef, setTxnRef] = useState('');

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !txnRef) {
      setError('Please provide both the transaction reference and a screenshot.');
      return;
    }

    const now = new Date();
    const fileTime = new Date(file.lastModified);
    const diffInMinutes = Math.abs(now.getTime() - fileTime.getTime()) / (1000 * 60);

    if (diffInMinutes > 10) {
      setError('Verification Failed: The uploaded screenshot appears to be older than 10 minutes. Please take a fresh screenshot of your recent payment and upload it.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // --- AI OCR Authenticity Check ---
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      const cleanText = text.replace(/[\s\-_,]/g, '').toLowerCase();
      const cleanTxnRef = txnRef.replace(/[\s\-_]/g, '').toLowerCase();
      
      const expectedAmount = formData.isIeeeMember ? '549' : '799';
      const expectedName = 'anusa';
      
      const hasName = cleanText.includes(expectedName);
      const hasAmount = cleanText.includes(expectedAmount);
      const hasTime = text.includes(':');
      const hasTxnId = cleanText.includes(cleanTxnRef);
      
      // Calculate how many checks passed
      const score = [hasName, hasAmount, hasTime, hasTxnId].filter(Boolean).length;
      
      // Require at least 3 out of 4 checks to pass (handles slight blurriness)
      if (score < 3) {
        throw new Error(`AI Verification Failed: Could not verify enough details in the screenshot. Make sure the Name, Amount, Time, and Transaction ID are clearly visible.`);
      }
      // --- End AI OCR Check ---

      const fileExt = file.name.split('.').pop();
      const fileName = `${registeredEmail}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error('Failed to upload screenshot. Make sure the bucket exists and permissions are set.');
      }

      const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(filePath);

      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registeredEmail,
          publicUrl,
          txnRef,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to update payment details.');
      }

      setSuccess(true);
      localStorage.removeItem('aiWeekRegistrationState');
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to submit payment proof.');
    } finally {
      setUploading(false);
    }
  };

  const downloadQR = async () => {
    const ticketElement = document.getElementById("ticket-card");
    if (!ticketElement) return;
    
    try {
      const dataUrl = await htmlToImage.toPng(ticketElement, {
        quality: 1.0,
        pixelRatio: 3,
      });
      const downloadLink = document.createElement("a");
      downloadLink.download = `AI-Week-Ticket-${finalTicketId}.png`;
      downloadLink.href = dataUrl;
      downloadLink.click();
    } catch (err) {
      console.error("Failed to generate ticket image", err);
    }
  };

  const labelClasses = "block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1";
  const inputContainerClasses = "relative group";
  const iconWrapperClasses = "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400 transition-colors z-10";
  const inputClasses = "w-full pl-12 pr-4 py-3.5 bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 rounded-2xl focus:bg-white/80 dark:focus:bg-slate-800/80 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 outline-none transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm backdrop-blur-sm relative";

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl p-8 sm:p-14 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-white/60 dark:border-slate-800/60 text-center max-w-4xl mx-auto relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-transparent to-cyan-400/10 pointer-events-none"></div>
        <div className="relative z-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          >
            <CheckCircle2 className="w-20 h-20 sm:w-24 sm:h-24 text-emerald-500 mx-auto mb-6 sm:mb-8 drop-shadow-[0_0_25px_rgba(16,185,129,0.4)]" />
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-black text-navy dark:text-white mb-4 tracking-tight">Registration Complete!</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8 text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            Thank you for securing your spot. Your payment proof is under review. 
            We&apos;ll send a confirmation email once verified.
          </p>
          
          <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 w-full max-w-3xl mx-auto">
            
            {/* Left Side: Ticket */}
            <div className="flex flex-col items-center w-full max-w-sm mx-auto">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Your Official Pass</p>
            
            {/* Ticket Element to be captured */}
            <div 
              id="ticket-card" 
              className="w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative border border-slate-700/50 flex flex-col text-left"
            >
              {/* Top part */}
              <div className="p-6 pb-8 relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[30px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-fuchsia-500/10 blur-[30px] rounded-full pointer-events-none"></div>
                
                <h3 className="text-2xl font-black text-white mb-1 tracking-tight">AI Intelli Week 2026</h3>
                <p className="text-cyan-400 text-sm font-bold uppercase tracking-wider mb-6">Premium Access</p>
                
                <div className="space-y-1">
                  <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Date</p>
                  <p className="text-white text-sm font-medium">June 15 - 22, 2026</p>
                </div>
              </div>

              {/* Divider with cutouts */}
              <div className="relative flex items-center justify-between w-full h-4 bg-slate-800">
                <div className="absolute -left-3 w-6 h-6 bg-white rounded-full border-r border-slate-200"></div>
                <div className="w-full border-t-2 border-dashed border-slate-600/50 mx-4"></div>
                <div className="absolute -right-3 w-6 h-6 bg-white rounded-full border-l border-slate-200"></div>
              </div>

              {/* Bottom part */}
              <div className="p-6 pt-8 bg-slate-800 flex justify-between items-end">
                <div className="flex-1 pr-4 min-w-0">
                  <div className="mb-4">
                    <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Attendee</p>
                    <p className="text-white text-lg font-bold leading-tight truncate" title={formData.fullName || "Guest"}>{formData.fullName || "Guest"}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Ticket Type</p>
                    <p className="text-white text-sm font-medium truncate">{formData.isIeeeMember ? "IEEE Member" : "General Delegate"}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Ticket ID</p>
                    <p className="text-cyan-400 font-mono text-sm tracking-wider">{finalTicketId}</p>
                  </div>
                </div>
                
                {/* QR Code */}
                <div className="bg-white p-2 rounded-xl shrink-0 shadow-lg">
                  <QRCode 
                    value={finalTicketId || 'AI-WEEK-TICKET'} 
                    size={80} 
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }} 
                    viewBox={`0 0 80 80`} 
                  />
                </div>
              </div>
            </div>

              <button
                onClick={downloadQR}
                className="mt-6 mb-2 flex items-center justify-center w-full py-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-1 active:translate-y-0"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Ticket
              </button>
            </div>

            {/* Right Side: WhatsApp Group */}
            <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto bg-emerald-50 border border-emerald-100 rounded-3xl p-8 relative overflow-hidden shadow-inner">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-200/50 rounded-full blur-2xl"></div>
              
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-emerald-200 z-10">
                <MessageSquare className="w-10 h-10 text-emerald-600" />
              </div>
              
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 mb-3 z-10">Join the Community</h3>
              <p className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed mb-8 z-10">
                Stay updated with schedules, exclusive announcements, and connect with other attendees before the event!
              </p>
              
              <a
                href="https://chat.whatsapp.com/CfPgFsO9f7k70Yhl4Oq5x9"
                target="_blank"
                rel="noreferrer"
                className="w-full relative group overflow-hidden bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl py-4 px-6 font-bold text-lg transition-all shadow-lg shadow-emerald-500/30 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center z-10"
              >
                <span className="flex items-center">
                  Join WhatsApp Group
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            </div>

          </div>

          <div className="mt-8 inline-flex items-center justify-center px-6 py-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full font-semibold border border-emerald-200 dark:border-emerald-800/50">
            <ShieldCheck className="w-5 h-5 mr-2" />
            Spot Reserved Successfully
          </div>
        </div>
      </motion.div>
    );
  }

  if (step === 2) {
    const upiLink = `upi://pay?pa=anusas860@okicici&pn=AnusaS&am=${formData.isIeeeMember ? '549.00' : '799.00'}&cu=INR`;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl p-8 sm:p-12 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-white/80 dark:border-slate-800/80 max-w-lg mx-auto relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 to-fuchsia-500"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-fuchsia-400/20 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400/20 blur-[80px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-100 to-fuchsia-100 border border-white mb-6 shadow-inner">
              <QrCode className="w-10 h-10 text-cyan-600 drop-shadow-sm" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-navy dark:text-white mb-2 sm:mb-3 tracking-tight">Complete Payment</h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium text-sm sm:text-base max-w-md mx-auto">
              You can try to pay by <strong>clicking the QR code</strong> to open your payment app directly. If that doesn&apos;t work, take a screenshot and scan it in your UPI app.
            </p>
          </div>

          <div className="bg-white/60 dark:bg-slate-900/60 p-8 rounded-3xl mb-8 flex flex-col items-center border border-white dark:border-slate-800 shadow-sm backdrop-blur-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <a 
              href={upiLink} 
              target="_top"
              rel="noopener noreferrer"
              className="w-56 h-56 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center mb-6 shadow-md relative overflow-hidden p-4 hover:border-cyan-400 transition-colors cursor-pointer block" 
              title="Click to open GPay, PhonePe, Paytm, etc."
            >
              <QRCode 
                value={upiLink} 
                size={256} 
                style={{ height: "auto", maxWidth: "100%", width: "100%" }} 
                viewBox={`0 0 256 256`} 
              />
            </a>
            
            <div className="text-center w-full">
              <p className="font-bold text-slate-500 uppercase tracking-wider text-sm mb-1">UPI ID</p>
              <p className="font-black text-cyan-700 tracking-wide text-xl mb-4">anusas860@okicici</p>
              <div className="inline-block px-6 py-2 bg-slate-900 text-white rounded-full font-black text-xl shadow-lg shadow-slate-900/20 mb-4">
                {formData.isIeeeMember ? '₹549' : '₹799'}
              </div>
            </div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-red-50/80 border border-red-200 rounded-2xl flex items-start text-red-600 backdrop-blur-md">
              <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
              <p className="text-sm font-medium leading-relaxed">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            <div className={inputContainerClasses}>
              <label htmlFor="txnRef" className={labelClasses}>UPI Transaction Id *</label>
              <div className="relative">
                <div className={iconWrapperClasses}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  id="txnRef"
                  value={txnRef}
                  onChange={(e) => setTxnRef(e.target.value)}
                  required
                  className={inputClasses}
                  placeholder="Enter UPI transaction Id"
                />
              </div>
            </div>

            <div className={inputContainerClasses}>
              <label htmlFor="screenshot" className={labelClasses}>Payment Screenshot *</label>
              <div className="relative">
                <div className={iconWrapperClasses}>
                  <UploadCloud className="w-5 h-5" />
                </div>
                <input
                  type="file"
                  id="screenshot"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 rounded-2xl focus:bg-white/80 dark:focus:bg-slate-800/80 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 outline-none transition-all text-slate-700 dark:text-slate-200 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-cyan-100 dark:file:bg-cyan-900/40 file:text-cyan-800 dark:file:text-cyan-400 hover:file:bg-cyan-200 dark:hover:file:bg-cyan-800/60 cursor-pointer shadow-sm backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="text-sm font-medium text-slate-600 dark:text-slate-400 bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-xl border border-cyan-100 dark:border-cyan-800">
              <p className="mb-3 flex items-start">
                <AlertCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mr-2 shrink-0 mt-0.5" />
                <span><strong className="text-cyan-700 dark:text-cyan-400">Important:</strong> Please ensure your payment screenshot is recent (taken within the last 10 minutes), otherwise it will be rejected.</span>
              </p>
              <p className="mb-3 flex items-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2 shrink-0 mt-0.5" />
                <span><strong className="text-emerald-700 dark:text-emerald-400">QR Code Issues?</strong> If the QR code doesn&apos;t work, directly pay to the UPI ID shown above and upload the screenshot.</span>
              </p>
              <p className="flex items-start">
                <Phone className="w-4 h-4 text-slate-500 dark:text-slate-400 mr-2 shrink-0 mt-0.5" />
                <span>For further assistance, please contact <strong>Ananthapadmanabhan V</strong> at <a href="https://wa.me/918075648240" target="_blank" rel="noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">+91 80756 48240</a>.</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full relative group overflow-hidden bg-slate-900 text-white font-bold text-lg py-4 px-6 rounded-2xl transition-all shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none mt-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center">
                {uploading ? 'Scanning & Submitting...' : (
                  <>
                    Submit Verification <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={uploading}
              className="w-full bg-white text-slate-700 border border-slate-200 font-bold text-lg py-4 px-6 rounded-2xl transition-all hover:bg-slate-50 flex items-center justify-center disabled:opacity-50 group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform text-slate-400" />
              Go Back & Edit Details
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit} 
      className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl p-8 sm:p-12 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-white/80 dark:border-slate-800/80 max-w-2xl mx-auto relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-400/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-navy dark:text-white mb-3 sm:mb-4 tracking-tight">Reserve Your Spot</h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium text-base sm:text-lg">Join us for the AI Intelli Week</p>
        </div>
        
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-red-50/80 border border-red-200 rounded-2xl flex items-start text-red-600 backdrop-blur-md">
            <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
            <p className="text-sm font-medium leading-relaxed">{error}</p>
          </motion.div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={inputContainerClasses}>
              <label htmlFor="fullName" className={labelClasses}>Full Name *</label>
              <div className="relative">
                <div className={iconWrapperClasses}><User className="w-5 h-5" /></div>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Full name"
                />
              </div>
            </div>
            <div className={inputContainerClasses}>
              <label htmlFor="email" className={labelClasses}>Email Address *</label>
              <div className="relative">
                <div className={iconWrapperClasses}>
                  {emailState === 'verified' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Mail className="w-5 h-5" />
                  )}
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={emailState === 'verified'}
                  className={`${inputClasses} ${emailState === 'verified' ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : ''}`}
                  placeholder="Email address"
                />
              </div>

              {formData.email && emailState === 'idle' && (
                <button 
                  type="button" 
                  onClick={sendOtp}
                  className="mt-2 text-sm font-bold text-cyan-600 hover:text-cyan-700 hover:underline px-1"
                >
                  Verify Email Address
                </button>
              )}

              {emailState === 'sending' && (
                <p className="mt-2 text-sm font-medium text-slate-500 px-1 animate-pulse">Sending code...</p>
              )}

              {(emailState === 'sent' || emailState === 'verifying') && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">Enter 6-Digit Code</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full min-w-0 sm:flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-center tracking-[0.5em] font-bold focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                      placeholder="------"
                    />
                    <button 
                      type="button"
                      onClick={verifyOtp}
                      disabled={emailState === 'verifying' || otp.length !== 6}
                      className="w-full sm:w-auto shrink-0 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
                    >
                      {emailState === 'verifying' ? '...' : 'Verify'}
                    </button>
                  </div>
                  <button type="button" onClick={sendOtp} className="mt-2 text-xs font-medium text-slate-500 hover:text-cyan-600 underline">Resend Code</button>
                </motion.div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={inputContainerClasses}>
              <label htmlFor="phone" className={labelClasses}>Phone Number *</label>
              <div className="relative">
                <div className={iconWrapperClasses}><Phone className="w-5 h-5" /></div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Phone number"
                />
              </div>
            </div>
            <div className={inputContainerClasses}>
              <label htmlFor="college" className={labelClasses}>College / Institution / School *</label>
              <div className="relative">
                <div className={iconWrapperClasses}><Building className="w-5 h-5" /></div>
                <input
                  type="text"
                  id="college"
                  name="college"
                  required
                  value={formData.college}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="College / School name"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={inputContainerClasses}>
              <label htmlFor="department" className={labelClasses}>Department / Class *</label>
              <div className="relative">
                <div className={iconWrapperClasses}><Briefcase className="w-5 h-5" /></div>
                <input
                  type="text"
                  id="department"
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Department / Class name"
                />
              </div>
            </div>
            <div className={inputContainerClasses}>
              <label htmlFor="yearDesignation" className={labelClasses}>Semester / Designation / Division *</label>
              <div className="relative">
                <div className={iconWrapperClasses}><GraduationCap className="w-5 h-5" /></div>
                <input
                  type="text"
                  id="yearDesignation"
                  name="yearDesignation"
                  required
                  value={formData.yearDesignation}
                  onChange={handleChange}
                  placeholder="Semester, Designation or Division"
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          <div className={inputContainerClasses}>
            <label htmlFor="referredBy" className={labelClasses}>Referred By (Optional)</label>
            <div className="relative">
              <div className={iconWrapperClasses}><User className="w-5 h-5" /></div>
              <input
                type="text"
                id="referredBy"
                name="referredBy"
                value={formData.referredBy}
                onChange={handleChange}
                placeholder="Who referred you?"
                className={inputClasses}
              />
            </div>
          </div>

          <div className={inputContainerClasses}>
            <label htmlFor="message" className={labelClasses}>Message (Optional)</label>
            <div className="relative">
              <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none text-slate-400 group-focus-within:text-cyan-500 transition-colors">
                <MessageSquare className="w-5 h-5" />
              </div>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Any questions or areas of interest?"
                className={`${inputClasses} resize-none pt-4`}
              ></textarea>
            </div>
          </div>

          <div className="flex items-center p-4 bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 rounded-2xl shadow-sm backdrop-blur-sm cursor-pointer group hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors" onClick={() => setFormData(prev => ({ ...prev, isIeeeMember: !prev.isIeeeMember }))}>
            <div className={`w-6 h-6 flex items-center justify-center rounded border-2 transition-colors mr-3 ${formData.isIeeeMember ? 'bg-cyan-500 border-cyan-500' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'}`}>
              {formData.isIeeeMember && <CheckCircle2 className="w-4 h-4 text-white" />}
            </div>
            <label className="text-sm sm:text-base text-slate-700 dark:text-slate-200 font-bold select-none cursor-pointer flex-1">
              I am an IEEE Member <span className="block sm:inline text-cyan-700 dark:text-cyan-400 font-black sm:ml-1">(Pay ₹549 instead of ₹799)</span>
            </label>
          </div>

          <AnimatePresence>
            {formData.isIeeeMember && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={inputContainerClasses}
              >
                <label htmlFor="ieeeMemberId" className={labelClasses}>IEEE Member ID *</label>
                <div className="relative mb-6">
                  <div className={iconWrapperClasses}><User className="w-5 h-5" /></div>
                  <input
                    type="text"
                    id="ieeeMemberId"
                    name="ieeeMemberId"
                    required={formData.isIeeeMember}
                    value={formData.ieeeMemberId}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="Enter your IEEE Member ID"
                  />
                </div>
                
                <label htmlFor="ieeeCard" className={labelClasses}>Upload IEEE Membership Card *</label>
                <div className="relative">
                  <div className={iconWrapperClasses}><UploadCloud className="w-5 h-5" /></div>
                  <input
                    type="file"
                    id="ieeeCard"
                    accept="image/*"
                    onChange={(e) => setIeeeCardFile(e.target.files?.[0] || null)}
                    required={formData.isIeeeMember}
                    className="w-full pl-12 pr-4 py-3 bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-800/60 rounded-2xl focus:bg-white/80 dark:focus:bg-slate-800/80 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 outline-none transition-all text-slate-700 dark:text-slate-200 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-cyan-100 dark:file:bg-cyan-900/40 file:text-cyan-800 dark:file:text-cyan-400 hover:file:bg-cyan-200 dark:hover:file:bg-cyan-800/60 cursor-pointer shadow-sm backdrop-blur-sm"
                  />
                  <div className="mt-3 text-right">
                    <a href="/ieee-guide" className="text-sm font-bold text-cyan-600 hover:text-cyan-700 hover:underline transition-all">
                      Don&apos;t know how to get your Membership ID card?
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12">
          <button
            type="submit"
            disabled={loading || emailState !== 'verified'}
            title={emailState !== 'verified' ? "Please verify your email first" : ""}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white font-bold text-xl py-4 px-6 rounded-2xl transition-all shadow-[0_10px_30px_rgba(6,182,212,0.3)] hover:shadow-[0_15px_40px_rgba(217,70,239,0.4)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none disabled:hover:-translate-y-0 disabled:shadow-none"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            <span className="relative z-10 flex items-center justify-center">
              {loading ? loadingMessage : (
                <>
                  Proceed to Payment <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </span>
          </button>
          
          {emailState !== 'verified' && (
            <p className="text-center text-sm font-medium text-amber-600 mt-4">
              * You must click &quot;Verify Email Address&quot; below the email field before proceeding.
            </p>
          )}
        </div>
      </div>
    </motion.form>
  );
}
