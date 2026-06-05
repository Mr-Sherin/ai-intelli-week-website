import React from 'react';
import { Download, ExternalLink, ShieldCheck, UserCircle, CheckCircle2, ArrowLeft, Menu, MonitorSmartphone, AlertTriangle, Phone } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function IeeeGuide() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-cyan-200 selection:text-cyan-900 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-400/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-fuchsia-400/20 blur-[120px]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-blue-400/10 blur-[80px]" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-24 relative z-10 w-full">
        
        <Link href="/" className="inline-flex items-center text-slate-500 hover:text-cyan-600 font-bold mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Registration
        </Link>

        <div className="bg-white/70 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-white/80 p-6 sm:p-12">
          
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 border border-white mb-8 shadow-inner">
            <ShieldCheck className="w-10 h-10 text-cyan-600 drop-shadow-sm" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-navy mb-4 tracking-tight">How to Access Your IEEE Membership Card</h1>
          <p className="text-slate-600 font-medium text-lg mb-10 leading-relaxed">
            Follow the steps below to access your IEEE Membership Card and upload it during AI Intelli Week registration.
          </p>

          <div className="space-y-4">
            
            {/* Step 1 */}
            <div className="flex items-start bg-white/80 p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -translate-x-full group-hover:translate-x-full duration-1000 ease-in-out pointer-events-none"></div>
              <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl shadow-md z-10 mr-4 sm:mr-5">
                1
              </div>
              <div className="z-10 pt-1 flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Visit IEEE Website</h3>
                <p className="text-slate-600">Open your browser and go to <a href="https://www.ieee.org" target="_blank" rel="noreferrer" className="text-cyan-600 font-bold hover:underline">ieee.org</a>.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col bg-white/80 p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -translate-x-full group-hover:translate-x-full duration-1000 ease-in-out pointer-events-none"></div>
              <div className="flex items-start">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl shadow-md z-10 mr-4 sm:mr-5">
                  2
                </div>
                <div className="z-10 pt-1 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Open the Menu</h3>
                  <p className="text-slate-600 mb-4">Click the <Menu className="inline w-4 h-4 text-slate-700" /> (Three-Line Menu) in the top-right corner.</p>
                  <img src="/images/ieee/step1.png" alt="IEEE menu button" className="w-full max-w-xs rounded-xl border border-slate-200 shadow-sm mx-auto" />
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col bg-white/80 p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -translate-x-full group-hover:translate-x-full duration-1000 ease-in-out pointer-events-none"></div>
              <div className="flex items-start">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl shadow-md z-10 mr-4 sm:mr-5">
                  3
                </div>
                <div className="z-10 pt-1 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Select Sign In</h3>
                  <p className="text-slate-600 mb-4">Scroll to the bottom of the menu and click <strong>Sign In</strong>.</p>
                  <img src="/images/ieee/step2.png" alt="IEEE Sign In option" className="w-full max-w-xs rounded-xl border border-slate-200 shadow-sm mx-auto" />
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col bg-white/80 p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -translate-x-full group-hover:translate-x-full duration-1000 ease-in-out pointer-events-none"></div>
              <div className="flex items-start">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl shadow-md z-10 mr-4 sm:mr-5">
                  4
                </div>
                <div className="z-10 pt-1 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Enter Credentials</h3>
                  <p className="text-slate-600 mb-4">Enter your IEEE account email address and password, then click <strong>Sign In</strong>.</p>
                  <img src="/images/ieee/step3.png" alt="IEEE Login form" className="w-full max-w-xs rounded-xl border border-slate-200 shadow-sm mx-auto" />
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex items-start bg-white/80 p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -translate-x-full group-hover:translate-x-full duration-1000 ease-in-out pointer-events-none"></div>
              <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl shadow-md z-10 mr-4 sm:mr-5">
                5
              </div>
              <div className="z-10 pt-1 flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Open Your Profile</h3>
                <p className="text-slate-600 mb-4">Click the <Menu className="inline w-4 h-4 text-slate-700" /> (Three-Line Menu) again and click on your name.</p>
                <img src="/images/ieee/step4.png" alt="IEEE Profile menu" className="w-full max-w-xs rounded-xl border border-slate-200 shadow-sm mx-auto" />
              </div>
            </div>

            {/* Step 6 */}
            <div className="flex items-start bg-white/80 p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -translate-x-full group-hover:translate-x-full duration-1000 ease-in-out pointer-events-none"></div>
              <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl shadow-md z-10 mr-4 sm:mr-5">
                6
              </div>
              <div className="z-10 pt-1 flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Access Membership Information</h3>
                <p className="text-slate-600 mb-4">Select <strong>Membership Information</strong>, then click <strong>Membership Card & Certificates</strong>.</p>
                <img src="/images/ieee/step6.png" alt="IEEE Membership Information Menu" className="w-full max-w-xs rounded-xl border border-slate-200 shadow-sm mx-auto" />
              </div>
            </div>

            {/* Step 7 */}
            <div className="flex items-start bg-white/80 p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -translate-x-full group-hover:translate-x-full duration-1000 ease-in-out pointer-events-none"></div>
              <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl shadow-md z-10 mr-4 sm:mr-5">
                7
              </div>
              <div className="z-10 pt-1 flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Open Membership Card</h3>
                <ul className="text-slate-600 space-y-2 list-disc ml-5 mb-4">
                  <li>Click <strong>IEEE Membership Card</strong>.</li>
                </ul>
                <img src="/images/ieee/step7.png" alt="IEEE Membership Card Link" className="w-full max-w-xs rounded-xl border border-slate-200 shadow-sm mx-auto" />
              </div>
            </div>

            {/* Step 8 */}
            <div className="flex items-start bg-amber-50/50 p-5 sm:p-6 rounded-2xl border border-amber-200/50 shadow-sm relative overflow-hidden group">
              <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl shadow-md z-10 mr-4 sm:mr-5">
                8
              </div>
              <div className="z-10 pt-1 flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-amber-900 mb-2 flex items-center">
                  If an Error Occurs <AlertTriangle className="w-5 h-5 ml-2 text-amber-500" />
                </h3>
                <p className="text-amber-800 mb-3 text-sm">If the membership card page does not load properly:</p>
                <ol className="text-amber-900/80 space-y-2 list-decimal ml-5 mb-4">
                  <li>Copy the URL of the redirected page.</li>
                  <li>Open a new browser tab or window.</li>
                  <li>Paste the URL and enable <MonitorSmartphone className="inline w-4 h-4 mx-1" /><strong>Desktop View/Desktop Mode</strong>.</li>
                  <li>Reload the page.</li>
                </ol>
                <img src="/images/ieee/step8.png" alt="Browser URL Bar" className="w-full max-w-xs rounded-xl border border-amber-200/50 shadow-sm mx-auto" />
              </div>
            </div>

            {/* Step 9 */}
            <div className="flex items-start bg-white/80 p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -translate-x-full group-hover:translate-x-full duration-1000 ease-in-out pointer-events-none"></div>
              <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl shadow-md z-10 mr-4 sm:mr-5">
                9
              </div>
              <div className="z-10 pt-1 flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Capture Your Membership Card</h3>
                <ul className="text-slate-600 space-y-2 list-disc ml-5 mb-4">
                  <li>Once your IEEE Membership Card is displayed, take a clear screenshot of the card.</li>
                  <li>Ensure that your <strong>name</strong>, <strong>membership number</strong>, and <strong>membership status</strong> are clearly visible.</li>
                </ul>
                <img src="/images/ieee/step9.png" alt="IEEE Membership Card Screenshot" className="w-full max-w-xs rounded-xl border border-slate-200 shadow-sm mx-auto" />
              </div>
            </div>

            {/* Step 10 */}
            <div className="flex items-start bg-emerald-50/50 p-5 sm:p-6 rounded-2xl border border-emerald-200/50 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -translate-x-full group-hover:translate-x-full duration-1000 ease-in-out pointer-events-none"></div>
              <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl shadow-md z-10 mr-4 sm:mr-5 shadow-emerald-500/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="z-10 pt-1 flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-emerald-900 mb-2">Upload for Registration</h3>
                <p className="text-emerald-800">
                  Upload the screenshot of your IEEE Membership Card during the AI Intelli Week Registration process.
                </p>
              </div>
            </div>

          </div>

          <div className="mt-12 pt-8 border-t border-slate-200/60 text-center">
            <h4 className="text-lg font-bold text-slate-800 mb-2">Need Help?</h4>
            <p className="text-slate-600 mb-4">If you encounter any issues, please contact the event coordinator for assistance:</p>
            
            <div className="inline-flex flex-col items-center bg-slate-100/80 p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="font-black text-slate-800 text-lg">Ananthapadmanabhan V</span>
              <span className="text-cyan-600 font-semibold text-sm mb-3 uppercase tracking-wider">IEEE Chair</span>
              <a href="https://wa.me/918075648240" target="_blank" rel="noreferrer" className="flex items-center text-slate-700 hover:text-emerald-600 font-bold bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm transition-colors">
                <Phone className="w-4 h-4 mr-2" />
                +91 80756 48240
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
