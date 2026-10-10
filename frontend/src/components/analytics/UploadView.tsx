import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Database,
  Layers,
  Sparkles,
  RefreshCw,
  Sliders,
  Table,
  Check,
  Info
} from 'lucide-react';
import { api } from '../../services/api';

interface UploadViewProps {
  onSessionSwitched?: (sessionId: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const UploadView: React.FC<UploadViewProps> = ({ onSessionSwitched, onNavigateTab }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [currentSession, setCurrentSession] = useState<any | null>(null);
  const [sessionsList, setSessionsList] = useState<any[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('demo');
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysisLogs, setAnalysisLogs] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load existing sessions
  const loadSessions = async () => {
    try {
      const res = await api.getSessions();
      setSessionsList(res.sessions || []);
      setActiveSessionId(res.active_session_id || 'demo');
    } catch (err: any) {
      console.warn('Could not load sessions:', err);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const res = await api.uploadDataset(file);
      setCurrentSession(res.session);
      setColumnMapping(res.session.column_mapping || {});
      setSuccessMessage(`Dataset "${file.name}" successfully parsed and schema inferred.`);
      await loadSessions();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload and parse dataset.');
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!currentSession) return;
    setAnalyzing(true);
    setErrorMessage(null);
    try {
      // 1. Submit column mappings if changed
      await api.mapColumns(currentSession.id, columnMapping);
      
      // 2. Trigger dynamic analysis
      const res = await api.analyzeSession(currentSession.id);
      setCurrentSession(res.session);
      setAnalysisLogs(res.session.preprocessing_summary || []);
      setSuccessMessage(`Dynamic analysis complete! Session "${res.session.name}" is now active across all dashboard tabs.`);
      await loadSessions();
      if (onSessionSwitched) {
        onSessionSwitched(currentSession.id);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Analysis failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSwitchSession = async (sessId: string) => {
    try {
      await api.switchSession(sessId);
      setActiveSessionId(sessId);
      await loadSessions();
      setSuccessMessage(`Active analysis switched to: ${sessId === 'demo' ? 'CareerTwin Demo Benchmark' : sessId}`);
      if (onSessionSwitched) {
        onSessionSwitched(sessId);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to switch session.');
    }
  };

  return (
    <div className="space-y-6 text-cream font-sans">
      
      {/* Editorial Header */}
      <div className="bg-surface rounded-xl border border-border p-6 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-basil-800/50 border border-basil-700/60 text-basil-400 text-xs font-mono mb-2">
              <Database size={13} />
              <span>DYNAMIC MULTI-SESSION INGESTION ENGINE</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-cream-heading tracking-tight">
              Dataset Upload & Dynamic Analysis Engine
            </h1>
            <p className="text-xs md:text-sm text-cream-muted mt-1 max-w-3xl">
              Upload external job postings, university cohort outcomes, or employee skill evaluations. 
              The engine automatically infers dataset roles, isolates missing fields, and executes verified analytical metrics in a dedicated sandbox session without modifying the 17,443-posting benchmark.
            </p>
          </div>

          {/* Active Session Status */}
          <div className="p-3 bg-surface-subtle rounded-lg border border-border text-xs min-w-[220px]">
            <span className="text-cream-muted text-[11px] block">Current Active Session:</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${activeSessionId === 'demo' ? 'bg-basil' : 'bg-tomato'}`} />
              <span className="font-semibold text-cream-heading truncate">
                {activeSessionId === 'demo' ? 'CareerTwin Demo Benchmark' : currentSession?.name || activeSessionId}
              </span>
            </div>
            {activeSessionId !== 'demo' && (
              <button
                onClick={() => handleSwitchSession('demo')}
                className="mt-2 text-[11px] text-basil hover:underline font-medium flex items-center gap-1"
              >
                Restore Demo Benchmark
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Upload & Inspect Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Dropzone & Sessions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Upload Card */}
          <div className="bg-surface rounded-xl border border-border p-5 shadow-card">
            <h2 className="text-sm font-bold text-cream-heading mb-3 flex items-center gap-2">
              <UploadCloud size={16} className="text-basil" />
              Upload Tabular Dataset
            </h2>

            <div className="border-2 border-dashed border-border hover:border-basil/70 rounded-xl p-6 text-center transition-colors bg-surface-subtle/50">
              <FileSpreadsheet size={36} className="mx-auto text-cream-muted mb-2" />
              <p className="text-xs font-medium text-cream mb-1">
                Drag and drop your dataset here
              </p>
              <p className="text-[11px] text-cream-muted mb-4">
                Supports CSV, XLSX, XLS (up to 50MB)
              </p>

              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-elevated hover:bg-surface-card border border-border text-xs font-semibold text-cream transition-colors">
                <span>Select File</span>
                <input
                  type="file"
                  accept=".csv, .xlsx, .xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {file && (
                <div className="mt-3 p-2 bg-surface rounded border border-border text-xs flex items-center justify-between">
                  <span className="font-mono text-cream truncate max-w-[200px]">{file.name}</span>
                  <span className="text-[10px] text-cream-muted">{(file.size / 1024).toFixed(1)} KB</span>
                </div>
              )}
            </div>

            {file && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-basil hover:bg-basil-600 text-soil-950 font-semibold text-xs transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Inspecting Dataset Schema...</span>
                  </>
                ) : (
                  <>
                    <Database size={14} />
                    <span>Upload & Inspect Schema</span>
                  </>
                )}
              </button>
            )}

            {/* Error or Success notification */}
            {errorMessage && (
              <div className="mt-3 p-3 bg-tomato-soft border border-tomato-dark rounded-lg text-xs text-tomato-400 flex items-start gap-2">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="mt-3 p-3 bg-basil-soft border border-basil-dark rounded-lg text-xs text-basil-300 flex items-start gap-2">
                <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}
          </div>

          {/* Available Sessions List */}
          <div className="bg-surface rounded-xl border border-border p-5 shadow-card">
            <h2 className="text-sm font-bold text-cream-heading mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Layers size={16} className="text-basil" />
                Multi-Session Registry
              </span>
              <span className="text-[10px] font-mono text-cream-muted">{sessionsList.length} Sessions</span>
            </h2>

            <div className="space-y-2">
              {sessionsList.map((s) => {
                const isActive = s.id === activeSessionId;
                return (
                  <div
                    key={s.id}
                    className={`p-3 rounded-lg border text-xs transition-all ${
                      isActive
                        ? 'bg-basil-soft/40 border-basil text-cream-heading font-semibold'
                        : 'bg-surface-subtle border-border text-cream-secondary hover:border-soil-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-2 h-2 rounded-full ${s.is_benchmark ? 'bg-basil' : 'bg-tomato'}`} />
                        <span className="truncate">{s.name}</span>
                      </div>
                      {isActive ? (
                        <span className="text-[10px] bg-basil text-soil-950 font-bold px-1.5 py-0.5 rounded font-mono">
                          ACTIVE
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSwitchSession(s.id)}
                          className="text-[11px] text-basil hover:underline font-semibold"
                        >
                          Switch
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-cream-muted mt-1 font-mono">
                      {s.is_benchmark ? 'Benchmark (17,443 postings + 300 outcomes)' : `${s.type || 'Custom Ingestion'} • ${s.status}`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Schema Inspection, Mapping & Dynamic Execution (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {currentSession && currentSession.inspection ? (
            <>
              {/* Inspection Card */}
              <div className="bg-surface rounded-xl border border-border p-5 shadow-card space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-cream-heading">
                      Inspection Summary: {currentSession.filename}
                    </h2>
                    <p className="text-[11px] text-cream-muted">
                      We're identifying what your columns mean and preparing your data for analysis
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-basil-soft border border-basil-dark text-basil-300 font-mono text-xs font-bold">
                    DATASET KIND: {currentSession.inspection.inferred_role}
                  </span>
                </div>

                {/* Metrics ribbon */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="p-3 bg-surface-subtle rounded-lg border border-border">
                    <span className="text-[10px] text-cream-muted block font-mono">TOTAL ROWS</span>
                    <span className="text-base font-bold text-cream-heading font-mono">
                      {currentSession.inspection.row_count.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 bg-surface-subtle rounded-lg border border-border">
                    <span className="text-[10px] text-cream-muted block font-mono">COLUMNS</span>
                    <span className="text-base font-bold text-cream-heading font-mono">
                      {currentSession.inspection.column_count}
                    </span>
                  </div>
                  <div className="p-3 bg-surface-subtle rounded-lg border border-border">
                    <span className="text-[10px] text-cream-muted block font-mono">DUPLICATES</span>
                    <span className="text-base font-bold text-cream-heading font-mono">
                      {currentSession.inspection.duplicate_rows}
                    </span>
                  </div>
                  <div className="p-3 bg-surface-subtle rounded-lg border border-border">
                    <span className="text-[10px] text-cream-muted block font-mono">STATUS</span>
                    <span className="text-base font-bold text-basil font-mono">
                      {currentSession.status}
                    </span>
                  </div>
                </div>

                {/* Columns table */}
                <div>
                  <h3 className="text-xs font-bold text-cream-heading mb-2 flex items-center gap-1.5">
                    <Sliders size={13} className="text-basil" />
                    Match Your Columns to CareerTwin Fields
                  </h3>
                  <div className="max-h-56 overflow-y-auto border border-border rounded-lg">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-surface-subtle text-cream-muted font-mono text-[10px] sticky top-0 border-b border-border">
                        <tr>
                          <th className="p-2">COLUMN</th>
                          <th className="p-2">TYPE</th>
                          <th className="p-2">MISSING %</th>
                          <th className="p-2">SAMPLE</th>
                          <th className="p-2">MAP AS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-cream-secondary">
                        {currentSession.inspection.columns.map((c: any) => (
                          <tr key={c.name} className="hover:bg-surface-elevated/40">
                            <td className="p-2 font-mono text-cream font-medium">{c.name}</td>
                            <td className="p-2 font-mono text-[11px]">{c.dtype}</td>
                            <td className="p-2 font-mono text-[11px]">
                              {c.null_percentage > 0 ? (
                                <span className="text-tomato">{c.null_percentage}%</span>
                              ) : (
                                <span className="text-basil">0%</span>
                              )}
                            </td>
                            <td className="p-2 text-[11px] truncate max-w-[120px] text-cream-muted">
                              {c.sample_values?.slice(0, 2).join(', ') || 'N/A'}
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                value={columnMapping[c.name] || c.name}
                                onChange={(e) =>
                                  setColumnMapping({ ...columnMapping, [c.name]: e.target.value })
                                }
                                className="bg-surface-subtle border border-border rounded px-2 py-0.5 text-xs text-cream focus:outline-none focus:border-basil w-28 font-mono"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="text-[11px] text-cream-muted">
                    Non-destructive processing isolates missing values and normalizes formats.
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="flex items-center gap-2 py-2 px-4 rounded-lg bg-basil hover:bg-basil-600 text-soil-950 font-bold text-xs transition-colors shadow-none"
                  >
                    {analyzing ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Running Analytical Engine...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        <span>Run Dynamic Analysis</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Analysis Results & Logs Card */}
              {currentSession.analysis_results && (
                <div className="bg-surface rounded-xl border border-border p-5 shadow-card space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-basil" />
                      <h3 className="text-sm font-bold text-cream-heading">
                        Analytical Model Results ({currentSession.analysis_results.role})
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-cream-muted">
                      Processed at: {new Date(currentSession.analysis_results.computed_at).toLocaleTimeString()}
                    </span>
                  </div>

                  {/* Preprocessing execution summary */}
                  {analysisLogs.length > 0 && (
                    <div className="p-3 bg-surface-subtle rounded-lg border border-border space-y-1 font-mono text-[11px] text-cream-muted">
                      <div className="text-[10px] text-cream font-bold uppercase tracking-wider mb-1">
                        Execution Pipeline Logs:
                      </div>
                      {analysisLogs.map((log, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-basil-300">
                          <Check size={12} className="text-basil" />
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Dynamic metrics preview */}
                  {currentSession.analysis_results.top_skills && (
                    <div>
                      <div className="text-xs font-bold text-cream-heading mb-2">
                        Top Skills Extracted ({currentSession.analysis_results.top_skills.length} Detected):
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {currentSession.analysis_results.top_skills.slice(0, 8).map((sk: any, i: number) => (
                          <div
                            key={i}
                            className="px-2.5 py-1 rounded bg-surface-subtle border border-border text-xs text-cream flex items-center gap-1.5"
                          >
                            <span className="font-medium">{sk.skill_name}</span>
                            <span className="text-[10px] font-mono text-basil font-bold">{sk.posting_prevalence_pct}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Salary stats preview */}
                  {currentSession.analysis_results.salary_stats && (
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="p-2.5 bg-surface-subtle rounded border border-border">
                        <span className="text-[10px] text-cream-muted block">AVERAGE SALARY</span>
                        <span className="text-sm font-bold text-cream font-mono">
                          ₹{currentSession.analysis_results.salary_stats.avg} LPA
                        </span>
                      </div>
                      <div className="p-2.5 bg-surface-subtle rounded border border-border">
                        <span className="text-[10px] text-cream-muted block">MEDIAN SALARY</span>
                        <span className="text-sm font-bold text-cream font-mono">
                          ₹{currentSession.analysis_results.salary_stats.median} LPA
                        </span>
                      </div>
                      <div className="p-2.5 bg-surface-subtle rounded border border-border">
                        <span className="text-[10px] text-cream-muted block">MAX SALARY</span>
                        <span className="text-sm font-bold text-cream font-mono">
                          ₹{currentSession.analysis_results.salary_stats.max} LPA
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Link to Views */}
                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-basil font-medium flex items-center gap-1">
                      <Check size={14} /> Session Active across tabs
                    </span>
                    <button
                      onClick={() => onNavigateTab && onNavigateTab('overview')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-card border border-border text-xs text-cream font-semibold transition-colors"
                    >
                      <span>Explore in Dashboard Overview</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Placeholder before upload */
            <div className="bg-surface rounded-xl border border-border p-12 text-center shadow-card space-y-4">
              <Table size={40} className="mx-auto text-soil-400 opacity-60" />
              <h3 className="text-sm font-bold text-cream-heading">
                Schema Inspection & Dynamic Execution Canvas
              </h3>
              <p className="text-xs text-cream-muted max-w-md mx-auto">
                Upload a dataset on the left or select an existing session from the registry. 
                The platform will display interactive column diagnostics, role inference, and let you trigger isolated mathematical analytics.
              </p>
              <div className="pt-4 flex items-center justify-center gap-6 text-[11px] text-cream-muted font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-basil" />
                  <span>Non-destructive</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-basil" />
                  <span>Benchmark Protected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-basil" />
                  <span>Instant Multi-Tab Update</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
