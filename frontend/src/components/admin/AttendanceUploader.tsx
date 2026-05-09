"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Loader2,
  ArrowRight,
  XCircle,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AIMapping {
  studentIdentifierColumn: string;
  studentIdentifierIndex: number;
  attendanceColumns: {
    headerName: string;
    columnIndex: number;
    isDateIdentified: boolean;
    inferredDate: string | null;
  }[];
}

export default function AttendanceUploader() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [subjectName, setSubjectName] = useState("");

  const [loading, setLoading] = useState(false);
  const [mapping, setMapping] = useState<AIMapping | null>(null);
  const [manualDates, setManualDates] = useState<Record<number, string>>({});

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error" | "duplicate"
  >("idle");
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Mentoring prompt state
  const [uploadedStudentIds, setUploadedStudentIds] = useState<string[]>([]);
  const [mentorPromptStatus, setMentorPromptStatus] = useState<
    "idle" | "assigning" | "done" | "skipped"
  >("idle");
  const [mentorId, setMentorId] = useState("");
  const [mentors, setMentors] = useState<{ id: string; full_name: string; department?: string }[]>([]);

  // ── File Upload ──
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      setWorkbook(wb);
      setSheets(wb.SheetNames);
      setSelectedSheet(wb.SheetNames[0]);
      setStep(2);
    };
    reader.readAsBinaryString(uploadedFile);
  };

  // ── AI Processing ──
  const processWithAI = async () => {
    if (!workbook || !selectedSheet || !subjectName) {
      setErrorMsg("Please select a sheet and enter a subject name.");
      return;
    }
    setErrorMsg("");
    setLoading(true);
    setStep(3);

    try {
      const sheet = workbook.Sheets[selectedSheet];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

      // Find the header row
      let headerRowIndex = 0;
      for (let i = 0; i < Math.min(10, jsonData.length); i++) {
        if (jsonData[i] && jsonData[i].length > 3) {
          headerRowIndex = i;
          break;
        }
      }

      const headers = jsonData[headerRowIndex];
      const sampleData = jsonData.slice(headerRowIndex + 1, headerRowIndex + 3);

      const response = await fetch("/api/ai/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headers, sampleData }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "AI processing failed. Please try again.");
      }

      const aiMapping: AIMapping = await response.json();

      // Client-side validation: double-check AI's column mapping
      const excludePatterns = /^(sl\s*no|name|email|usn|admission|branch|section|n8n|joined|assessment|knowledge|skill|total|score)/i;

      const validatedColumns = aiMapping.attendanceColumns.filter((col) => {
        const header = (col.headerName || "").toString().trim();

        // Exclude known non-attendance headers
        if (excludePatterns.test(header)) {
          console.log("[AttendanceUploader] Excluded column:", header, "at index", col.columnIndex);
          return false;
        }

        // Check sample data for this column — if values are URLs or large numbers, exclude
        const sampleValues = sampleData.map((row: any[]) => row[col.columnIndex]);
        const hasUrl = sampleValues.some((v: any) => typeof v === "string" && v.startsWith("http"));
        if (hasUrl) {
          console.log("[AttendanceUploader] Excluded URL column:", header, "at index", col.columnIndex);
          return false;
        }

        // If values are numbers > 1, it's likely a score, not attendance
        const hasLargeNumbers = sampleValues.some((v: any) => typeof v === "number" && v > 1);
        if (hasLargeNumbers) {
          console.log("[AttendanceUploader] Excluded score column:", header, "at index", col.columnIndex, "sample values:", sampleValues);
          return false;
        }

        return true;
      });

      console.log(
        "[AttendanceUploader] AI returned",
        aiMapping.attendanceColumns.length,
        "columns, after validation:",
        validatedColumns.length
      );

      aiMapping.attendanceColumns = validatedColumns;
      setMapping(aiMapping);
      setStep(4);
    } catch (error: any) {
      setErrorMsg(error.message);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  // ── Duplicate Check & Upload ──
  const checkDuplicatesAndUpload = async () => {
    if (!mapping || !workbook || !selectedSheet) return;

    const missingDates = mapping.attendanceColumns.filter(
      (c) => !c.isDateIdentified && !manualDates[c.columnIndex]
    );
    if (missingDates.length > 0) {
      setErrorMsg("Please provide dates for all unrecognised columns before uploading.");
      return;
    }

    setErrorMsg("");
    setLoading(true);
    setUploadStatus("uploading");
    setStep(5);

    try {
      const sheet = workbook.Sheets[selectedSheet];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

      let headerRowIndex = 0;
      for (let i = 0; i < Math.min(10, jsonData.length); i++) {
        if (jsonData[i] && jsonData[i].length > 3) {
          headerRowIndex = i;
          break;
        }
      }

      // Gather dates
      const datesToCheck = mapping.attendanceColumns
        .map((c) => (c.isDateIdentified ? c.inferredDate : manualDates[c.columnIndex]))
        .filter(Boolean) as string[];

      // Check for duplicates
      if (!duplicateWarning) {
        const { data: existingRecords, error: fetchError } = await supabase
          .from("attendance_records")
          .select("date")
          .eq("subject_name", subjectName)
          .in("date", datesToCheck)
          .limit(1);

        if (fetchError) throw fetchError;

        if (existingRecords && existingRecords.length > 0) {
          setDuplicateWarning(true);
          setUploadStatus("duplicate");
          setLoading(false);
          return;
        }
      }

      // Map student identifiers → profile IDs
      const studentColumnIndex = mapping.studentIdentifierIndex;

      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, usn, email, full_name, role");

      if (profileError) throw profileError;

      // Build a lookup map: USN, email, and full_name all point → profile id
      const profileMap = new Map<string, string>();
      profiles?.forEach((p) => {
        if (p.usn) profileMap.set(p.usn.trim().toUpperCase(), p.id);
        if (p.email) profileMap.set(p.email.trim().toUpperCase(), p.id);
        if (p.full_name) profileMap.set(p.full_name.trim().toUpperCase(), p.id);
      });

      console.log("[AttendanceUploader] DB profiles loaded:", profiles?.length);
      console.log("[AttendanceUploader] ProfileMap keys:", Array.from(profileMap.keys()));
      console.log("[AttendanceUploader] AI-detected student column index:", studentColumnIndex);
      console.log("[AttendanceUploader] AI-detected student column name:", mapping.studentIdentifierColumn);

      // Build records
      const recordsToInsert: any[] = [];
      const rows = jsonData.slice(headerRowIndex + 1);
      const unmatchedIdentifiers: string[] = [];
      const matchedIdentifiers: string[] = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rawIdentifier = row[studentColumnIndex];
        const identifier = String(rawIdentifier || "")
          .replace(/\s+/g, " ")
          .trim()
          .toUpperCase();
        if (!identifier) continue;

        const studentId = profileMap.get(identifier);
        if (!studentId) {
          unmatchedIdentifiers.push(String(rawIdentifier || "").trim());
          continue;
        }
        matchedIdentifiers.push(identifier);

        for (const col of mapping.attendanceColumns) {
          const rawValue = row[col.columnIndex];
          let isPresent = false;

          if (typeof rawValue === "boolean") {
            isPresent = rawValue;
          } else if (typeof rawValue === "string") {
            const lower = rawValue.toLowerCase().trim();
            if (["true", "present", "p", "yes", "y", "1"].includes(lower)) {
              isPresent = true;
            }
          } else if (typeof rawValue === "number" && rawValue === 1) {
            isPresent = true;
          }

          const date = col.isDateIdentified
            ? col.inferredDate
            : manualDates[col.columnIndex];

          if (date) {
            recordsToInsert.push({
              student_id: studentId,
              subject_name: subjectName,
              date,
              status: isPresent ? "Present" : "Absent",
            });
          }
        }
        setUploadProgress(Math.round((i / rows.length) * 50));
      }
      // Deduplicate records — same (student_id, subject_name, date) can appear
      // if multiple columns map to the same date or if the sheet has duplicate rows.
      const deduped = new Map<string, (typeof recordsToInsert)[0]>();
      for (const rec of recordsToInsert) {
        const key = `${rec.student_id}::${rec.subject_name}::${rec.date}`;
        deduped.set(key, rec); // last-write-wins
      }
      const uniqueRecords = Array.from(deduped.values());

      console.log(
        "[AttendanceUploader] Records before dedup:",
        recordsToInsert.length,
        "| After dedup:",
        uniqueRecords.length
      );

      if (uniqueRecords.length === 0) {
        const sampleUnmatched = unmatchedIdentifiers.slice(0, 5).join(", ");
        const dbSampleKeys = Array.from(profileMap.keys()).slice(0, 5).join(", ");
        throw new Error(
          `No valid attendance records could be generated.\n\n` +
          `The AI mapped column "${mapping.studentIdentifierColumn}" (index ${studentColumnIndex}) as the student identifier.\n` +
          `${unmatchedIdentifiers.length} student(s) from the spreadsheet could not be matched to any profile in the database.\n` +
          (sampleUnmatched ? `Sample unmatched values: ${sampleUnmatched}\n` : "") +
          (dbSampleKeys ? `Sample database identifiers: ${dbSampleKeys}\n` : "") +
          `\nPlease ensure the students in your spreadsheet (USN, email, or name) match the profiles stored in the database.`
        );
      }

      // Batch upsert (with auto-generated IDs, deduplicated)
      const chunkSize = 500;
      for (let i = 0; i < uniqueRecords.length; i += chunkSize) {
        const chunk = uniqueRecords.slice(i, i + chunkSize).map((r) => ({
          ...r,
          id: crypto.randomUUID(),
        }));
        const { error: insertError } = await supabase
          .from("attendance_records")
          .upsert(chunk, {
            onConflict: "student_id,subject_name,date",
          });

        if (insertError) throw insertError;
        setUploadProgress(
          50 + Math.round((i / uniqueRecords.length) * 50)
        );
      }

      setUploadProgress(100);
      setUploadStatus("success");

      // Collect unique student IDs from the uploaded records for mentor prompt
      const uniqueStudentIds = Array.from(
        new Set(uniqueRecords.map((r) => r.student_id))
      );
      setUploadedStudentIds(uniqueStudentIds);

      // Fetch mentors for the mentor assignment prompt
      const { data: mentorProfiles } = await supabase
        .from("profiles")
        .select("id, full_name, department")
        .eq("role", "mentor");
      if (mentorProfiles) setMentors(mentorProfiles);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Failed to upload attendance");
      setUploadStatus("error");
    } finally {
      setLoading(false);
    }
  };

  // ── Reset ──
  const handleReset = () => {
    setStep(1);
    setFile(null);
    setWorkbook(null);
    setSheets([]);
    setSelectedSheet("");
    setSubjectName("");
    setMapping(null);
    setManualDates({});
    setDuplicateWarning(false);
    setUploadProgress(0);
    setUploadStatus("idle");
    setErrorMsg("");
    setUploadedStudentIds([]);
    setMentorPromptStatus("idle");
    setMentorId("");
    setMentors([]);
  };

  // ── Step indicator data ──
  const steps = [
    { num: 1, label: "Upload" },
    { num: 2, label: "Configure" },
    { num: 4, label: "Review AI" },
    { num: 5, label: "Sync" },
  ];

  return (
    <div className="card p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-button bg-accent/10 flex items-center justify-center">
          <FileSpreadsheet className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="text-lg font-heading font-bold text-text-primary">
            AI-Powered Attendance Sync
          </h2>
          <p className="text-text-muted text-xs">
            Upload a spreadsheet and let the AI engine map columns, resolve dates, and detect duplicates.
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-1 mb-8 px-1">
        {steps.map((s, idx) => {
          const isActive = step >= s.num;
          return (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "bg-accent text-background"
                      : "bg-surface-border text-text-muted"
                  }`}
                >
                  {s.num === 5 && step >= 5 && uploadStatus === "success"
                    ? "✓"
                    : idx + 1}
                </div>
                <span
                  className={`text-xs font-medium transition-colors duration-300 ${
                    isActive ? "text-accent" : "text-text-muted"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-1 transition-colors duration-300 ${
                    step > s.num ? "bg-accent/40" : "bg-surface-border"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="flex items-start gap-3 mb-6 p-3 rounded-input bg-danger/10 border border-danger/20">
          <XCircle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
          <p className="text-sm text-danger whitespace-pre-line">{errorMsg}</p>
        </div>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* ── Step 1: File Upload ── */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="drop-zone p-12 relative">
              <input
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="file-upload-input"
              />
              <UploadCloud className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-heading font-semibold text-text-primary">
                Click or drag a file to upload
              </h3>
              <p className="text-text-muted text-sm mt-2">
                Supported formats: .xlsx, .xls, .csv
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Step 2: Configure ── */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* File info */}
            <div className="flex items-center gap-3 p-4 rounded-input bg-success/5 border border-success/20">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {file?.name}
                </p>
                <button
                  onClick={handleReset}
                  className="text-xs text-accent hover:underline mt-0.5"
                >
                  Change file
                </button>
              </div>
            </div>

            {/* Subject Name */}
            <div>
              <label className="label" htmlFor="subject-name-input">
                Subject / Course Name
              </label>
              <input
                id="subject-name-input"
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="e.g. Data Engineering and AI"
                className="input"
              />
              <p className="input-hint">
                This groups the attendance records under a specific subject in the database.
              </p>
            </div>

            {/* Sheet Selection */}
            <div>
              <label className="label">Select Sheet to Process</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {sheets.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSheet(s)}
                    className={`p-3 rounded-button border text-left text-sm transition-all duration-200 ${
                      selectedSheet === s
                        ? "border-accent bg-accent-light text-accent font-medium"
                        : "border-surface-border text-text-muted hover:border-accent/30 hover:text-text-primary"
                    }`}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" />
                    {s}
                  </button>
                ))}
              </div>
              <p className="input-hint mt-2">
                Choose which tab from the workbook to analyse.
              </p>
            </div>

            {/* Submit */}
            <button
              onClick={processWithAI}
              disabled={!subjectName || loading}
              className="btn-primary w-full btn-lg"
              id="analyze-ai-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Analysing…
                </>
              ) : (
                <>
                  Analyse with AI <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* ── Step 3: AI Processing ── */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-16 flex flex-col items-center justify-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-5">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
            <h3 className="text-xl font-heading font-bold text-text-primary">
              AI is analysing your spreadsheet…
            </h3>
            <p className="text-text-muted text-sm mt-2 max-w-xs">
              Mapping student identifiers, resolving date columns, and preparing the data for sync.
            </p>
          </motion.div>
        )}

        {/* ── Step 4: Review AI Mapping ── */}
        {step === 4 && mapping && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Mapping success banner */}
            <div className="p-4 rounded-input bg-success/10 border border-success/20">
              <h3 className="font-heading font-semibold text-success flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-5 h-5" /> AI Mapping Complete
              </h3>
              <p className="text-sm text-text-muted">
                Student identifier detected:{" "}
                <span className="badge badge-accent">{mapping.studentIdentifierColumn}</span>
              </p>
            </div>

            {/* Attendance columns */}
            <div>
              <h4 className="label mb-3">
                Detected Attendance Columns ({mapping.attendanceColumns.length})
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
                {mapping.attendanceColumns.map((col, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-input bg-surface border border-surface-border"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-text-primary truncate">
                        {col.headerName || "(Empty Header)"}
                      </span>
                      {col.isDateIdentified ? (
                        <span className="text-xs text-secondary mt-0.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Resolved:{" "}
                          {col.inferredDate}
                        </span>
                      ) : (
                        <span className="text-xs text-accent mt-0.5 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Date not found — manual input required
                        </span>
                      )}
                    </div>

                    {!col.isDateIdentified && (
                      <div className="flex-shrink-0 ml-3">
                        <input
                          type="date"
                          value={manualDates[col.columnIndex] || ""}
                          onChange={(e) =>
                            setManualDates((prev) => ({
                              ...prev,
                              [col.columnIndex]: e.target.value,
                            }))
                          }
                          className="input text-xs py-1.5 px-2 w-40"
                        />
                        <p className="text-[10px] text-text-muted mt-1 text-right">
                          Enter the session date
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-ghost flex-1">
                Back
              </button>
              <button
                onClick={checkDuplicatesAndUpload}
                className="btn-primary flex-1 btn-lg"
                id="confirm-upload-btn"
              >
                Confirm & Upload
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Step 5: Upload / Duplicate / Done ── */}
        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-10"
          >
            {uploadStatus === "duplicate" ? (
              <div className="text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5">
                  <AlertCircle className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-heading font-bold text-text-primary mb-2">
                  Duplicate Records Detected
                </h3>
                <p className="text-text-muted text-sm mb-6">
                  Attendance data for <span className="text-accent font-medium">{subjectName}</span>{" "}
                  on some of these dates already exists in the database. Proceeding will
                  skip duplicate entries.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      setUploadStatus("idle");
                      setStep(4);
                    }}
                    className="btn-ghost"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={checkDuplicatesAndUpload}
                    className="btn-primary"
                  >
                    Proceed Anyway
                  </button>
                </div>
              </div>
            ) : uploadStatus === "success" ? (
              <div className="text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-xl font-heading font-bold text-text-primary mb-2">
                  Synchronisation Complete
                </h3>
                <p className="text-text-muted text-sm mb-4">
                  Attendance records have been successfully written to the database.
                </p>

                {/* Mentor Prompt */}
                {uploadedStudentIds.length > 0 && mentorPromptStatus === "idle" && (
                  <div className="mt-4 p-4 rounded-input bg-accent/5 border border-accent/20 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-accent" />
                      <h4 className="text-sm font-semibold text-text-primary">
                        Mentor these {uploadedStudentIds.length} students?
                      </h4>
                    </div>
                    <p className="text-xs text-text-muted mb-3">
                      Assign the students from this upload to a mentor so they appear in the mentee list.
                    </p>
                    <div className="mb-3">
                      <select
                        value={mentorId}
                        onChange={(e) => setMentorId(e.target.value)}
                        className="input bg-surface border-surface-border text-text-primary text-sm h-[38px] px-3 rounded-input w-full"
                      >
                        <option value="">-- Select Mentor --</option>
                        {mentors.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.full_name} ({m.department || "Faculty"})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          if (!mentorId) return;
                          setMentorPromptStatus("assigning");
                          try {
                            const records = uploadedStudentIds.map((sid) => ({
                              mentor_id: mentorId,
                              mentee_id: sid,
                              is_active: true,
                            }));
                            const { error } = await supabase
                              .from("allocations")
                              .upsert(records, { onConflict: "mentor_id,mentee_id" });
                            if (error) throw error;
                            setMentorPromptStatus("done");
                          } catch (err: any) {
                            console.error(err);
                            setErrorMsg(err.message);
                            setMentorPromptStatus("idle");
                          }
                        }}
                        disabled={!mentorId}
                        className="btn-primary btn-sm flex-1"
                      >
                        Assign as Mentees
                      </button>
                      <button
                        onClick={() => setMentorPromptStatus("skipped")}
                        className="btn-ghost btn-sm"
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                )}

                {mentorPromptStatus === "assigning" && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-accent text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Assigning mentees…
                  </div>
                )}

                {mentorPromptStatus === "done" && (
                  <div className="mt-4 p-3 rounded-input bg-success/10 border border-success/20 text-sm text-success flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {uploadedStudentIds.length} student(s) assigned as mentees.
                  </div>
                )}

                <button
                  onClick={handleReset}
                  className="btn-primary mt-4"
                >
                  Upload Another File
                </button>
              </div>
            ) : uploadStatus === "error" ? (
              <div className="text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-5">
                  <XCircle className="w-8 h-8 text-danger" />
                </div>
                <h3 className="text-xl font-heading font-bold text-text-primary mb-2">
                  Upload Failed
                </h3>
                <p className="text-text-muted text-sm mb-2">{errorMsg}</p>
                <button
                  onClick={() => {
                    setUploadStatus("idle");
                    setStep(4);
                  }}
                  className="btn-ghost mt-4"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5">
                  <Loader2 className="w-8 h-8 text-accent animate-spin" />
                </div>
                <h3 className="text-lg font-heading font-bold text-text-primary mb-5">
                  Syncing to Database…
                </h3>
                <div className="w-full h-2 bg-surface-border rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-text-muted">{uploadProgress}% complete</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
