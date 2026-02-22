import { NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "google/gemini-2.0-flash-001";

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        if (!OPENROUTER_API_KEY) {
            return NextResponse.json({
                error: "OpenRouter API Key is missing. Please set OPENROUTER_API_KEY in your environment."
            }, { status: 500 });
        }

        const prompt = `
        Analyze the following URL for potential phishing or malicious behavior:
        URL: ${url}

        You MUST evaluate the following heuristics and include findings in your analysis:
        1. URL Length (Is it excessively long/suspicious?)
        2. IP Address (Is the domain actually an IP address?)
        3. Subdomains (High number of subdomains or suspicious nesting?)
        4. URL Shorteners (Is it using a service to hide the final destination?)
        5. Special Characters (Suspicious use of '@', '-', '.', or unicode characters?)
        6. Suspicious TLDs (e.g., .zip, .rev, .xyz when context is sensitive?)
        7. HTTPS Status (Protocol used and validity expectation).

        Provide a deep technical analysis including:
        - Global risk assessment ("safe", "phishing", "suspicious").
        - Risk score (0-100).
        - Technical details:
            - Registrar: Name and likely status.
            - Infrastructure: Hosting Provider (ASN), IP Address, and Server Location.
            - Registration Timeline: Creation Date, Updated Date, and Expiry Date (estimated from WHOIS).
            - DNS Records: Primary A records, MX records (mail servers), and Name Servers (NS).
            - SSL: Certificate Issuer and Validity.
            - Obfuscation: Techniques used (punycode, redirect chains, etc.).
        - Detailed breakdown of reasons (list them clearly in the "threats" array). 
          NOTE: If the URL is safe and no specific threats are found, leave the "threats" array empty.

        Return your analysis ONLY as a JSON object with the following structure:
        {
          "id": "unique-id-here",
          "url": "${url}",
          "type": "safe" | "phishing" | "suspicious",
          "score": number,
          "message": "summary message",
          "details": {
            "registrar": "string",
            "serverLocation": "string",
            "ipAddress": "string",
            "asn": "string (e.g., AS15169 Google LLC)",
            "hostingProvider": "string",
            "creationDate": "string",
            "expiryDate": "string",
            "nameServers": ["ns1.example.com"],
            "mxRecords": ["alt1.aspmx.l.google.com"],
            "sslStatus": "string",
            "threats": ["list of specific threat markers found"],
            "recommendations": ["list of safety actions"]
          }
        }
        `;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    {
                        role: "system",
                        content: "You are a cybersecurity expert specialized in phishing URL detection. You provide deep technical audits and return structured JSON reports. Always generate a unique 8-character alphanumeric 'id' for the report."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                response_format: { type: "json_object" }
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("OpenRouter API Error:", errorData);
            return NextResponse.json({ error: "Failed to analyze URL via OpenRouter" }, { status: 502 });
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        try {
            let result = JSON.parse(content);

            // Normalize: Unwrap array if LLM returned it
            if (Array.isArray(result) && result.length > 0) {
                result = result[0];
            }

            if (!result.id) {
                result.id = Math.random().toString(36).substring(2, 10);
            }

            return NextResponse.json(result);
        } catch (parseError) {
            console.error("JSON Parsing Error:", content);
            return NextResponse.json({ error: "Failed to parse analysis results" }, { status: 500 });
        }

    } catch (error) {
        console.error("Internal Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
