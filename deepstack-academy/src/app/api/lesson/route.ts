import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";

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

  try {
    const filePath = path.join(process.cwd(), "src/content", file);
    const contentDir = path.join(process.cwd(), "src/content");

    if (!filePath.startsWith(contentDir)) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    const content = await fs.readFile(filePath, "utf-8");

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
