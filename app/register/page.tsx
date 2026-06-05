import RegistrationForm from '@/components/RegistrationForm';

export const metadata = {
  title: 'Register - AI Intelli Week',
  description: 'Register for the AI Intelli Week event.',
};

export default function RegisterPage() {
  return (
    <div className="w-full py-20 relative z-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-navy tracking-tight mb-4">Event Registration</h1>
          <p className="text-xl text-slate-600 font-medium">
            Secure your spot for AI Intelli Week. Limited seats available.
          </p>
        </div>
        
        <RegistrationForm />
      </div>
    </div>
  );
}
