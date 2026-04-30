"use client";

import Editor from "@monaco-editor/react";
import { useState } from "react";

export function CodeEditor({ initialCode }: { initialCode: string }) {
  const [code, setCode] = useState(initialCode);

  return (
    <div className="my-4 flex flex-col md:flex-row gap-4 h-[32rem]">
       <div className="flex-1 border rounded-lg overflow-hidden border-gray-700">
        <Editor
            height="100%"
            defaultLanguage="html"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
            minimap: { enabled: false },
            fontSize: 14,
            }}
        />
       </div>
       <div className="flex-1 flex flex-col">
         <div className="bg-gray-800 text-white px-4 py-2 font-bold text-sm rounded-t-lg border border-gray-700 border-b-0">Live Preview</div>
         <div className="flex-1 border-x border-b rounded-b-lg overflow-hidden border-gray-700 bg-white relative">
           <iframe
            srcDoc={code}
            title="preview"
            sandbox="allow-scripts"
            className="absolute inset-0 w-full h-full"
           />
         </div>
       </div>
    </div>
  );
}
