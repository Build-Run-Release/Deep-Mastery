"use client";

import { useUser } from "@/context/UserContext";

export function CompleteButton() {
  const { addXp } = useUser();

  return (
    <button
      onClick={() => addXp(50)}
      className="mt-8 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors"
    >
      Complete Lesson (+50 XP)
    </button>
  );
}
