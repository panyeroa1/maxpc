import { NextResponse } from "next/server";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { promisify } from "node:util";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const execFileAsync = promisify(execFile);
const OPENCLAW_BIN = existsSync("/opt/homebrew/bin/openclaw")
  ? "/opt/homebrew/bin/openclaw"
  : "openclaw";

function safeError(error: unknown) {
  if (error instanceof Error) {
    return { name: error.name, message: error.message, stack: error.stack };
  }
  return { message: String(error) };
}

export async function GET() {
  try {
    const { stdout } = await execFileAsync(
      OPENCLAW_BIN,
      ["skills", "list", "--json"],
      {
        // Default to the Next.js app root; override if needed.
        cwd: process.env.OPENCLAW_WORKSPACE_DIR ?? process.cwd(),
        timeout: 15_000,
        maxBuffer: 10 * 1024 * 1024,
      }
    );

    const parsed = JSON.parse(stdout);
    return NextResponse.json({ success: true, ...parsed });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to list OpenClaw skills",
        details: safeError(error),
      },
      { status: 500 }
    );
  }
}
