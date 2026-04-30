export interface Course {
  id: string;
  title: string;
  file: string;
  isPremium: boolean;
}

export const courses: Course[] = [
  {
    id: "lesson-1",
    title: "Lesson 1: Introduction to HTML and CSS",
    file: "lesson-1.mdx",
    isPremium: false,
  },
  {
    id: "lesson-2",
    title: "Lesson 2: Advanced CSS & Responsive Design",
    file: "lesson-2.mdx",
    isPremium: false,
  },
  {
    id: "lesson-3",
    title: "Lesson 3: JavaScript Mastery",
    file: "lesson-3.mdx",
    isPremium: true,
  },
  {
    id: "lesson-4",
    title: "Lesson 4: React & Frontend Architecture",
    file: "lesson-4.mdx",
    isPremium: true,
  },
  {
    id: "lesson-5",
    title: "Lesson 5: Backend Engineering with Node.js & Express",
    file: "lesson-5.mdx",
    isPremium: true,
  },
  {
    id: "lesson-6",
    title: "Lesson 6: The Database Layer (MongoDB)",
    file: "lesson-6.mdx",
    isPremium: true,
  },
  {
    id: "lesson-7",
    title: "Lesson 7: Full-Stack Integration & Next.js",
    file: "lesson-7.mdx",
    isPremium: true,
  }
];
