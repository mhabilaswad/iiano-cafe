'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Store token and user info in cookies
      Cookies.set('token', data.token, { expires: 1 }); // expires in 1 day
      Cookies.set('user', JSON.stringify(data.user), { expires: 1 });

      // Also store in localStorage for client-side access
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect based on user role
      if (data.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F6F6F6]">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center relative" style={{ backgroundImage: "url('/images/cafe-bg.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#F6F6F6] to-transparent"></div>
        <div className="h-full w-full flex items-center justify-center relative z-10">
          <div className="text-center px-8">
            <div className="text-4xl font-bold mb-6 text-[var(--color-2)]">
              <span className="text-[var(--color-1)]">iiano</span>
              <span>Cafe</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-[var(--color-2)]">Welcome Back!</h1>
            <p className="text-lg text-[var(--color-3)]">Experience the perfect blend of comfort and taste</p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[var(--color-2)] mb-2">Sign In</h2>
            <p className="text-sm text-[var(--color-3)]">
              Welcome back! Please enter your details
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--color-2)] mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none block w-full px-4 py-3 border border-[var(--color-4)] rounded-lg shadow-sm placeholder-[var(--color-3)] focus:outline-none focus:ring-2 focus:ring-[var(--color-1)] focus:border-[var(--color-1)] sm:text-sm transition-all"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--color-2)] mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none block w-full px-4 py-3 border border-[var(--color-4)] rounded-lg shadow-sm placeholder-[var(--color-3)] focus:outline-none focus:ring-2 focus:ring-[var(--color-1)] focus:border-[var(--color-1)] sm:text-sm transition-all"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-[var(--color-1)] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-1)] transition-all ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-4)]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[var(--color-3)]">or</span>
              </div>
            </div>

            <div>
              <Link
                href="/"
                className="w-full flex justify-center py-3 px-4 border-2 border-[var(--color-1)] rounded-lg text-sm font-semibold text-[var(--color-1)] hover:bg-[var(--color-1)] hover:text-white transition-all duration-200"
              >
                Continue as Guest
              </Link>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-[var(--color-3)]">
                Don't have an account?{' '}
                <Link href="/register" className="font-semibold text-[var(--color-1)] hover:text-opacity-90">
                  Create one now
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 