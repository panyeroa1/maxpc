
import { NextRequest, NextResponse } from "next/server";
import { Client, type ClientChannel } from "ssh2";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getVpsConfig() {
    const host = process.env.VPS_SSH_HOST;
    const user = process.env.VPS_SSH_USER;
    const password = process.env.VPS_SSH_PASSWORD;
    const portRaw = process.env.VPS_SSH_PORT;
    const port = portRaw ? Number(portRaw) : 22;

    return {
        host,
        user,
        password,
        port: Number.isFinite(port) && port > 0 ? port : 22,
        token: process.env.VPS_DEPLOY_TOKEN,
    };
}

export async function POST(req: NextRequest) {
    try {
        const cfg = getVpsConfig();

        const providedToken = req.headers.get("x-vps-deploy-token") ?? "";
        if (!cfg.token || providedToken !== cfg.token) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        if (!cfg.host || !cfg.user || !cfg.password) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Missing VPS SSH config. Set VPS_SSH_HOST, VPS_SSH_USER, VPS_SSH_PASSWORD (and optional VPS_SSH_PORT).",
                },
                { status: 400 }
            );
        }

        const body = (await req.json()) as { command?: unknown };
        const command = typeof body.command === "string" ? body.command : "";

        if (!command) {
            return NextResponse.json({ error: "No command provided" }, { status: 400 });
        }

        const output = await new Promise<string>((resolve, reject) => {
            const conn = new Client();
            conn.on("ready", () => {
                conn.exec(command, (err: Error | undefined, stream: ClientChannel) => {
                    if (err) {
                        conn.end();
                        return reject(err);
                    }
                    let stdout = "";
                    let stderr = "";
                    stream.on("close", () => {
                        conn.end();
                        resolve(stdout || stderr); // Return combined output for simplicity
                    }).on("data", (data: any) => {
                        stdout += data;
                    }).stderr.on("data", (data: any) => {
                        stderr += data;
                    });
                });
            }).on("error", (err: Error) => {
                reject(err);
            }).connect({
                host: cfg.host,
                port: cfg.port,
                username: cfg.user,
                password: cfg.password,
                // readyTimeout: 20000, // Optional timeout
            });
        });

        return NextResponse.json({ success: true, term_output: output });

    } catch (error: any) {
        console.error("VPS Error:", error);
        return NextResponse.json({ success: false, error: error.message || "VPS Execution Failed" }, { status: 500 });
    }
}
