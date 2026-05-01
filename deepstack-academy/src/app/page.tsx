"use client";

import { useState, useEffect, useRef } from "react";
import { courses } from "@/lib/courses";
import { CodeEditor } from "@/components/CodeEditor";
import { CompleteButton } from "@/components/CompleteButton";
import { MDXRemote } from "next-mdx-remote";
import { BookOpen, Lock, Unlock, PlayCircle, Code } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Script from "next/script";

export default function Home() {
  const router = useRouter();
  const [currentLesson, setCurrentLesson] = useState(courses[0]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { user, isPremiumUnlocked, unlockPremium } = useUser();
  const [mdxSource, setMdxSource] = useState<any>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [forceReload, setForceReload] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cache = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    let isMounted = true;
    async function loadContent() {
      setLoading(true);
      try {
        if (cache.current.has(currentLesson.file)) {
          if (isMounted) setMdxSource(cache.current.get(currentLesson.file));
          return;
        }

        const res = await fetch(`/api/lesson?file=${currentLesson.file}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            cache.current.set(currentLesson.file, data.mdxSource);
            setMdxSource(data.mdxSource);
          }
        } else {
           if (isMounted) setMdxSource(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadContent();

    return () => {
        isMounted = false;
    }
  }, [currentLesson, forceReload]);

  const handleUnlock = async () => {
    if (!user) {
      router.push("/signin");
      return;
    }
    setIsPaying(true);
    try {
      if (typeof (window as any).PaystackPop !== 'undefined') {
        const paystack = new (window as any).PaystackPop();
        paystack.newTransaction({
          key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_mock_key",
          email: user.email,
          amount: 1500000,
          reference: `deepstack_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
          onSuccess: async (transaction: any) => {
            setIsPaying(true);
            try {
              const verifyRes = await fetch('/api/payment/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ reference: transaction.reference, userId: user.id })
              });
              const verifyData = await verifyRes.json();

              if (verifyData.verified) {
                  unlockPremium();
              }
            } catch (err) {
              console.error("Verification error", err);
            } finally {
              setIsPaying(false);
            }
          },
          onCancel: () => {
            setIsPaying(false);
          }
        });
      } else {
        // Mock fallback if Paystack script is unavailable
        setTimeout(() => {
          unlockPremium();
          setIsPaying(false);
        }, 1500);
      }
    } catch (e) {
      console.error("Payment failed", e);
      setIsPaying(false);
    }
  };

  const components = { CodeEditor, CompleteButton };

  return (
    <div className="flex bg-gray-50 dark:bg-[#0B0F19] transition-colors duration-500" style={{ height: 'calc(100vh - 72px)' }}>
      <Script src="https://js.paystack.co/v2/inline.js" strategy="lazyOnload" />
      {/* Sidebar - Glassmorphism */}
      <div className="w-80 bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 p-6 overflow-y-auto shrink-0 shadow-lg z-10 flex flex-col gap-6">
        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
          <BookOpen className="w-6 h-6" />
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Curriculum</h2>
        </div>

        <div className="space-y-3">
          {courses.map((course, index) => {
            const isActive = currentLesson.id === course.id;
            // The module is verified as locked if we have explicitly received a PAYWALL error for it.
            // Since we don't have a user state endpoint, we'll tentatively show it as unlocked if it's the current lesson and not showing a paywall,
            // but normally you would use the result of a `/api/user/me` endpoint.
            const isLocked = course.isPremium && (isActive ? mdxSource === "PAYWALL" : forceReload === 0);

            return (
              <motion.button
                key={course.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentLesson(course)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-300 group border flex items-start gap-4 ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 shadow-sm"
                    : "bg-white/50 dark:bg-gray-800/30 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:border-gray-200 dark:hover:border-gray-700/50"
                }`}
              >
                <div className={`mt-1 flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${isActive ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-sm leading-tight mb-1 ${isActive ? "text-indigo-700 dark:text-indigo-300" : "text-gray-700 dark:text-gray-300"}`}>
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
                     {isLocked ? (
                       <><Lock className="w-3 h-3 text-rose-500" /> Premium</>
                     ) : course.isPremium ? (
                       <><Unlock className="w-3 h-3 text-emerald-500" /> Unlocked</>
                     ) : (
                       <><PlayCircle className="w-3 h-3" /> Free Module</>
                     )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto relative scroll-smooth bg-[url('/grid.svg')] bg-center bg-repeat" style={{ backgroundSize: '40px 40px' }}>
        <AnimatePresence mode="wait">
          {mdxSource === "PAYWALL" && !loading ? (
            <motion.div
              key="paywall"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 dark:bg-[#0B0F19]/80 backdrop-blur-md z-10 p-8"
            >
              <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-2xl text-center max-w-lg border border-gray-100 dark:border-gray-800 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                <div className="mx-auto w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
                  <Lock className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                </div>

                <h3 className="text-3xl font-extrabold mb-4 text-gray-900 dark:text-white tracking-tight">Unlock Deep Stack Mastery</h3>
                <p className="mb-8 text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                  This lesson is part of our premium engineering modules. Upgrade now to unlock advanced React, Node.js, Database design, and interactive milestones.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUnlock}
                  disabled={isPaying}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl w-full transition-colors disabled:opacity-50 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-3 text-lg"
                >
                  {isPaying ? "Securely Processing..." : "Unlock Now (₦15,000)"}
                </motion.button>
                <p className="mt-4 text-xs text-gray-500 flex items-center justify-center gap-2">
                  <Lock className="w-3 h-3" /> Secured by Paystack Integration
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={currentLesson.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto py-12 px-8 lg:px-16"
            >
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100/50 dark:border-gray-800/50 prose prose-indigo dark:prose-invert lg:prose-lg w-full max-w-none">
                {loading ? (
                  <div className="animate-pulse flex flex-col gap-6">
                    <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                    <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl w-full mt-8" />
                  </div>
                ) : mdxSource ? (
                  <MDXRemote {...mdxSource} components={components} />
                ) : (
                  <div className="text-center py-20">
                    <Code className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                    <p className="text-xl text-gray-500 font-medium">Failed to load content.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
