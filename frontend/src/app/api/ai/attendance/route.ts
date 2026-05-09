import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { headers, sampleData } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set in environment variables." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are an expert data-mapping assistant for an attendance management system.
We are uploading a spreadsheet that contains student information AND attendance records.

Here are ALL the column headers (by index):
${JSON.stringify(headers.map((h: any, i: number) => ({ index: i, header: h })))}

Here is a sample of the first 2 data rows:
${JSON.stringify(sampleData)}

YOUR TASK — carefully follow these rules:

1. **Student Identifier**: Identify exactly ONE column that contains the student identifier.
   - Prefer columns named "usn", "USN", "roll", "enrollment" (case-insensitive).
   - If no USN column exists, use "email".
   - Report the exact header name and its column index.

2. **Attendance Columns**: Identify ONLY columns that represent attendance for specific dates.
   - Attendance columns typically have headers that are DATES (e.g., "30/04/26", "18-02-26", "2026-04-30") or Excel serial date numbers (integers between 40000-50000 like 46238).
   - Attendance data values are boolean (true/false), or "P"/"A", or "Present"/"Absent", or 1/0.
   
3. **IMPORTANT — columns to EXCLUDE (these are NOT attendance columns)**:
   - "SL NO", "name", "email", "usn", "admission_number", "branch_code", "section" — these are student metadata.
   - "n8n invite links", "n8n links", or any column containing URLs — these are NOT attendance.
   - "Joined the Batch", "Pre Assessment Score", "Post Assessment Score" — these are metadata, NOT attendance.
   - "Knowledge", "Skill", "Knowledge(25)", "Skill(25)", "Total Scores" — these are SCORES, NOT attendance.
   - Any column where sample data contains URLs (starting with "http") — NOT attendance.
   - Any column where sample data contains numbers greater than 1 (like scores out of 25 or 100) — NOT attendance.
   - Columns with null/empty/undefined headers should only be included if their data is clearly boolean attendance data AND they are adjacent to other date columns.

4. **Date Conversion**:
   - For date-formatted headers like "30/04/26" → convert to "2026-04-30" (YYYY-MM-DD). Assume years < 100 are in the 2000s (26 = 2026, 25 = 2025).
   - For Excel serial date numbers: subtract 25569 and multiply by 86400000 to get a JS timestamp. Example: 46238 → 2026-08-12.
   - If you cannot determine the date, set isDateIdentified to false and inferredDate to null.

Output ONLY valid JSON matching this schema — no markdown, no explanation, no extra text:
{
  "studentIdentifierColumn": "usn",
  "studentIdentifierIndex": 4,
  "attendanceColumns": [
    {
      "headerName": "30/04/26",
      "columnIndex": 7,
      "isDateIdentified": true,
      "inferredDate": "2026-04-30"
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text || "";
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(cleanText);

      // Server-side validation: filter out obviously wrong columns
      if (parsed.attendanceColumns && Array.isArray(parsed.attendanceColumns)) {
        const excludeHeaders = new Set([
          "sl no", "name", "email", "usn", "admission_number", "branch_code",
          "section", "n8n invite links", "n8n links", "joined the batch",
          "pre assessment score", "post assessment score", "knowledge", "skill",
          "total scores", "knowledge score", "skill score",
        ]);

        parsed.attendanceColumns = parsed.attendanceColumns.filter(
          (col: any) => {
            const headerLower = (col.headerName || "").toString().toLowerCase().trim();

            // Exclude known non-attendance headers
            if (excludeHeaders.has(headerLower)) return false;

            // Exclude headers containing score-related patterns
            if (/score|knowledge|skill|total|assessment/i.test(headerLower)) return false;

            // Exclude headers that look like URLs
            if (/^http/i.test(headerLower)) return false;

            // Check sample data — if any sample value is a URL or a number > 1, exclude
            for (const row of sampleData) {
              const val = row[col.columnIndex];
              if (typeof val === "string" && val.startsWith("http")) return false;
              if (typeof val === "number" && val > 1 && !headerLower) return false;
            }

            return true;
          }
        );
      }

      console.log(
        "[AI Attendance] Mapped",
        parsed.attendanceColumns?.length,
        "attendance columns, student column:",
        parsed.studentIdentifierColumn
      );

      return NextResponse.json(parsed);
    } catch (e) {
      console.error("Failed to parse AI response:", cleanText);
      return NextResponse.json(
        { error: "Failed to parse AI response", rawText: cleanText },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("AI Mapping Error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during AI processing" },
      { status: 500 }
    );
  }
}
