"use client";

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { Code2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

export default function SignIn() {
  const { login } = useUser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        login(data.user);
        router.push("/");
      } else {
        setError(data.error || "Failed to sign in");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0B0F19]">
      {/* Left split - Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-indigo-600 dark:bg-indigo-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 bg-indigo-500 rounded-full blur-[120px] opacity-50" />
        <div className="absolute -right-1/4 -bottom-1/4 w-1/2 h-1/2 bg-purple-500 rounded-full blur-[120px] opacity-50" />

        <div className="relative z-10 text-white max-w-lg">
          <div className="bg-white/10 p-3 rounded-2xl w-fit mb-8 backdrop-blur-md border border-white/20">
            <Code2 className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Welcome back to DeepStack Academy.
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Continue your journey to mastering full-stack software engineering. Pick up right where you left off.
          </p>
        </div>
      </div>

      {/* Right split - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 sm:p-12"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8 text-indigo-600 dark:text-indigo-400">
             <Code2 className="w-6 h-6" />
             <span className="font-bold text-xl text-gray-900 dark:text-white">DeepStack</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Sign In</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Access your personalized learning dashboard.</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? "Signing In..." : "Sign In"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              Sign up for free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
