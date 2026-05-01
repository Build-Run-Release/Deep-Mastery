"use client";

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { Code2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignUp() {
  const { login } = useUser();
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    await login();
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0B0F19]">
      {/* Left split - Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full blur-[120px] opacity-30" />

        <div className="relative z-10 text-white max-w-lg">
          <div className="bg-white/10 p-3 rounded-2xl w-fit mb-8 backdrop-blur-md border border-white/20">
            <Code2 className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Start Your Engineering Journey.
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Join thousands of developers mastering the craft of modern software engineering. Build real projects, earn XP, and level up.
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

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Create Account</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Start your free software engineering modules today.</p>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="Ada Lovelace"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email address</label>
              <input
                type="email"
                placeholder="developer@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 mt-6"
            >
              Sign Up <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/signin" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
