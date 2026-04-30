"use client";

import { useState, useEffect } from "react";
import { courses } from "@/lib/courses";
import { initializePayment, verifyPayment } from "@/services/payment";
import { CodeEditor } from "@/components/CodeEditor";
import { CompleteButton } from "@/components/CompleteButton";
import { MDXRemote } from "next-mdx-remote";

export default function Home() {
  const [currentLesson, setCurrentLesson] = useState(courses[0]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mdxSource, setMdxSource] = useState<any>(null);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadContent() {
      setLoading(true);
      try {
        const res = await fetch(`/api/lesson?file=${currentLesson.file}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setMdxSource(data.mdxSource);
        } else {
           if (isMounted) setMdxSource(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (!currentLesson.isPremium || isPremiumUnlocked) {
      loadContent();
    } else {
      const timer = setTimeout(() => {
        if (isMounted) {
          setMdxSource(null);
          setLoading(false);
        }
      }, 0);
      return () => clearTimeout(timer);
    }

    return () => {
        isMounted = false;
    }
  }, [currentLesson, isPremiumUnlocked]);

  const handleUnlock = async () => {
    setIsPaying(true);
    try {
      const initRes = await initializePayment({
        email: "student@example.com",
        amount: 1500000,
        userId: "user_123",
        planId: "premium_fullstack",
      });

      if (initRes.status) {
        const verified = await verifyPayment(initRes.reference);
        if (verified) {
          setIsPremiumUnlocked(true);
        }
      }
    } catch (e) {
      console.error("Payment failed", e);
    } finally {
      setIsPaying(false);
    }
  };

  const components = { CodeEditor, CompleteButton };

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto shrink-0">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Curriculum</h2>
        <ul>
          {courses.map((course) => (
            <li key={course.id} className="mb-2">
              <button
                onClick={() => setCurrentLesson(course)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  currentLesson.id === course.id
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                {course.title} {course.isPremium && !isPremiumUnlocked && "🔒"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        {currentLesson.isPremium && !isPremiumUnlocked ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Unlock Deep Stack Premium</h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                This lesson is part of our premium &quot;Deep Stack&quot; modules. Upgrade now to unlock advanced React, Node.js, and Database engineering courses.
              </p>
              <button
                onClick={handleUnlock}
                disabled={isPaying}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full transition-colors disabled:opacity-50"
              >
                {isPaying ? "Processing..." : "Unlock Now (₦15,000)"}
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto prose dark:prose-invert lg:prose-xl w-full">
             {loading ? (
                <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-6 py-1"><div className="h-2 bg-slate-700 rounded"></div><div className="space-y-3"><div className="grid grid-cols-3 gap-4"><div className="h-2 bg-slate-700 rounded col-span-2"></div><div className="h-2 bg-slate-700 rounded col-span-1"></div></div><div className="h-2 bg-slate-700 rounded"></div></div></div></div>
             ) : mdxSource ? (
                <MDXRemote {...mdxSource} components={components} />
             ) : (
                <p>Failed to load content.</p>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
