import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import { courses } from "@/lib/courses";
import { verifySession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const file = searchParams.get("file");

  if (!file) {
    return NextResponse.json({ error: "File parameter is missing" }, { status: 400 });
  }

  // Security: Prevent Path Traversal (LFI)
  // Ensure the requested file only contains word characters, numbers, dashes, and the .mdx extension
  if (!/^[a-zA-Z0-9-]+\.mdx$/.test(file)) {
      return NextResponse.json({ error: "Invalid file format requested." }, { status: 400 });
  }

  // Security: Enforce Paywall server-side
  const course = courses.find(c => c.file === file);
  if (!course) {
     return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }
  if (course.isPremium) {
     const hasPremiumAccess = await verifySession();
     if (!hasPremiumAccess) {
         return NextResponse.json({ error: "Premium access required." }, { status: 403 });
     }
  }

  try {
    const filePath = path.join(process.cwd(), "src/content", file);

    // Extra security check to ensure the resolved path remains inside src/content
    const contentDir = path.join(process.cwd(), "src/content");
    if (!filePath.startsWith(contentDir)) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    const content = await fs.promises.readFile(filePath, "utf-8");

    // Serialize MDX on the server side
    const mdxSource = await serialize(content, {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        format: 'mdx',
      },
    });

    return NextResponse.json({ mdxSource });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
