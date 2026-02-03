import Link from 'next/link';
import { Sparkles, Heart, Camera, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-black" />
              <span className="text-2xl font-bold text-black tracking-tight">
                Moments
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/sign-in"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-900 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-black" />
            <span className="text-black font-medium text-sm">Capture Life's Beautiful Moments</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-black mb-6 leading-tight tracking-tight">
            Your Memories,
            <br />
            <span className="text-gray-500">
              Beautifully Preserved
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Share and cherish your favorite moments with friends and family.
            Create lasting memories in a beautiful, private space.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/sign-up"
              className="px-8 py-4 bg-black text-white rounded-full font-semibold text-lg hover:bg-gray-900 hover:-translate-y-1 transition-all"
            >
              Start Capturing Moments
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 bg-white text-black rounded-full font-semibold text-lg border-2 border-gray-200 hover:border-black transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Moments?
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to preserve and share your special memories
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-6">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">
                Capture & Share
              </h3>
              <p className="text-gray-600">
                Upload photos and videos effortlessly. Share your favorite moments
                with the people who matter most.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">
                Private & Secure
              </h3>
              <p className="text-gray-600">
                Your memories are yours alone. Control who sees what with
                powerful privacy settings and secure storage.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">
                Connect & Engage
              </h3>
              <p className="text-gray-600">
                React, comment, and engage with moments from your loved ones.
                Build stronger connections through shared experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of users preserving their precious memories
          </p>
          <Link
            href="/sign-up"
            className="inline-block px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-gray-200 hover:-translate-y-1 transition-all"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>

      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-gray-500" />
            <span className="text-xl font-bold text-white">Moments</span>
          </div>
          <p className="text-gray-400">
            © 2025 Moments. Cherish every memory.
          </p>
        </div>
      </footer>
    </div>
  );
}