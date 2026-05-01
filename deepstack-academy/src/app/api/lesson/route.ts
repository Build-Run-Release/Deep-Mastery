import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import { courses } from "@/lib/courses";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const file = searchParams.get("file");

  if (!file) {
    return NextResponse.json({ error: "File parameter is missing" }, { status: 400 });
  }

  // Security: Prevent Path Traversal (LFI)
  if (!/^[a-zA-Z0-9-]+\.mdx$/.test(file)) {
      return NextResponse.json({ error: "Invalid file format requested." }, { status: 400 });
  }

  // Security: Missing Authorization Check
  const course = courses.find((c) => c.file === file);
  if (course && course.isPremium) {
    const session = await getSession();
    if (!session.premiumUnlocked) {
      return NextResponse.json({ error: "Unauthorized access to premium content" }, { status: 401 });
    }
  }

  try {
    const filePath = path.join(process.cwd(), "src/content", file);
    const contentDir = path.join(process.cwd(), "src/content");

    if (!filePath.startsWith(contentDir)) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    const content = await fs.promises.readFile(filePath, "utf-8");

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
