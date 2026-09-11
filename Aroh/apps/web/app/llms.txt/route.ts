import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "llms.txt");
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return new Response(content, {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
      });
    }
  } catch {
    // Fallback if file read fails
  }

  return new Response(
    "# AROH Platform\n> Unified digital ecosystem platform and open-source foundation.\n\nCanonical URL: https://aroh-os.vercel.app\nGitHub: https://github.com/Aroh-Open-Source/AROH\n",
    {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    }
  );
}
