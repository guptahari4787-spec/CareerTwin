import React, { useState, useEffect, useRef } from 'react';
import { 
  Server, 
  Database, 
  Cpu, 
  Globe, 
  Layers, 
  Activity, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Clock, 
  Code2, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  FileText, 
  HardDrive, 
  Terminal, 
  Network,
  X,
  FileSpreadsheet,
  Check,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface NodeDetail {
  id: string;
  name: string;
  layer: string;
  technology: string;
  files: string[];
  responsibility: string;
  input: string;
  output: string;
  metrics?: string;
  liveSnippet?: string;
}

const ARCHITECTURE_NODES: Record<string, NodeDetail> = {
  user: {
    id: 'user',
    name: 'User / Browser Client',
    layer: 'Layer 1: User Experience',
    technology: 'Modern Web Browser (Chrome, Safari, Edge)',
    files: ['User Interface & Client Sessions'],
    responsibility: 'Initiates workforce queries, adjusts What-If scenario sliders, and visualizes career alignment matrices.',
    input: 'Mouse clicks, slider inputs, capability selections',
    output: 'DOM events & HTTP client triggers',
    metrics: 'Desktop & Mobile responsive viewports'
  },
  frontend: {
    id: 'frontend',
    name: 'React 19 + Vite Frontend',
    layer: 'Layer 2: Frontend Application',
    technology: 'React 19, TypeScript, Vite 8, Tailwind CSS, Framer Motion',
    files: [
      'frontend/src/App.tsx',
      'frontend/src/services/api.ts',
      'frontend/src/components/analytics/*',
      'frontend/src/components/dashboard/*'
    ],
    responsibility: 'Renders analytical charts, reactive state updates, client-side routing, and formats REST JSON payloads.',
    input: 'User interactions & Backend JSON responses',
    output: 'Interactive DOM tree, Canvas charts, HTTP fetch requests',
    metrics: 'Host: localhost:5173 | Hot Reload: <400ms'
  },
  api: {
    id: 'api',
    name: 'FastAPI Gateway Router',
    layer: 'Layer 3: API Gateway & Router',
    technology: 'Python 3.10+, FastAPI 2.0, Uvicorn ASGI Server',
    files: [
      'backend/main.py',
      'backend/database.py'
    ],
    responsibility: 'Asynchronous HTTP request handling, CORS authorization, request validation via Pydantic, route dispatching to service engines.',
    input: 'HTTP GET / POST requests with JSON headers',
    output: 'JSON payloads with HTTP 200/400/500 status codes',
    metrics: 'Host: 127.0.0.1:8000 | 25+ Registered REST Endpoints'
  },
  intelligence: {
    id: 'intelligence',
    name: 'CareerTwin Intelligence & ML',
    layer: 'Layer 4: Analytical Services & Machine Learning',
    technology: 'NumPy, SciPy, Scikit-Learn, Pandas',
    files: [
      'backend/careertwin_service.py',
      'backend/careertwin_pipeline.py',
      'backend/matching_engine.py',
      'backend/recommendation_engine.py',
      'backend/simulator.py'
    ],
    responsibility: 'Executes inferential statistics (Welch t-test, Mann-Whitney U, Cohen d), Benjamini-Hochberg FDR, Logistic Regression (Odds Ratios), Random Forest (5-fold CV), and 4-tier Alignment classification.',
    input: 'Normalized SQL query records & Scenario parameters',
    output: 'Statistical p-values, feature importances, scenario probabilities',
    metrics: 'JDS RF Accuracy: 84.1% | Logit CV: 84.1%'
  },
  data_access: {
    id: 'data_access',
    name: 'SQLAlchemy ORM Data Access',
    layer: 'Layer 5: Data Access Layer',
    technology: 'SQLAlchemy ORM, Python Context Managers',
    files: [
      'backend/database.py',
      'backend/models.py'
    ],
    responsibility: 'Manages SessionLocal connection lifecycles, thread concurrency safety, object-relational mapping for 26 entities.',
    input: 'Python model queries & transactional commits',
    output: 'Typed SQLAlchemy Model instances & query result iterators',
    metrics: 'check_same_thread: False | Session Pooling'
  },
  database: {
    id: 'database',
    name: 'SQLite Relational Database',
    layer: 'Layer 6: Relational Persistence',
    technology: 'SQLite 3 Embedded Engine',
    files: [
      'backend/careertwin.db'
    ],
    responsibility: 'Persists raw job postings, candidate trajectories, pre-computed effect sizes, alignment matrices, and student profiles across 26 tables.',
    input: 'SQL DDL / DML commands (SELECT, INSERT, UPDATE)',
    output: 'Indexed relational rows and aggregation result sets',
    metrics: '17,743 Total Records | 26 Normalized Tables'
  },
  raw_data: {
    id: 'raw_data',
    name: 'Empirical Data Sources',
    layer: 'Layer 7: External Real Datasets',
    technology: 'CSV & XLSX Tabular Datasets',
    files: [
      'data/Analytics Jobs.csv (15,841 rows)',
      'data/DataScience Jobs.csv (1,602 rows)',
      'data/JDS Skill Traits.xlsx (139 rows)',
      'data/SDS Personality Traits.xlsx (161 rows)'
    ],
    responsibility: 'Authentic hackathon source records ingested by careertwin_pipeline.py into normalized SQLite schemas.',
    input: 'Raw CSV/Excel files',
    output: 'Cleaned tabular records without synthetic generation',
    metrics: '17,443 Postings + 300 Career Trajectory Profiles'
  },
  sas_validation: {
    id: 'sas_validation',
    name: 'SAS Statistical Validation Layer',
    layer: 'Layer 4b: Enterprise Validation Protocol',
    technology: 'SAS Enterprise / SAS Batch Scripts (PROC TTEST, PROC LOGISTIC, PROC NPAR1WAY)',
    files: [
      'backend/careertwin_sas_validation.sas'
    ],
    responsibility: 'Executes independent verification of hypothesis tests (PROC TTEST), non-parametric rank tests (PROC NPAR1WAY), multiple testing FDR corrections (PROC MULTTEST), and odds ratios (PROC LOGISTIC) to guarantee dual-engine mathematical consistency with Python runtime outputs.',
    input: 'JDS Skill Traits.xlsx (139 rows) & SDS Personality Traits.xlsx (161 rows)',
    output: 'ODS Output tables verifying Welch t-statistics, p-values, odds ratios, and Hosmer-Lemeshow fit',
    metrics: 'Dual-Engine Cross-Check: Python Runtime + SAS Verification Suite'
  }
};

interface RequestSample {
  id: string;
  name: string;
  method: 'GET' | 'POST';
  endpoint: string;
  service: string;
  table: string;
  payload?: any;
  uiTarget: string;
}

const REQUEST_SAMPLES: RequestSample[] = [
  {
    id: 'overview',
    name: 'Executive Summary',
    method: 'GET',
    endpoint: '/api/overview',
    service: 'get_overview_summary()',
    table: 'market_analytics_jobs, jds_skill_traits',
    uiTarget: 'OverviewView (Headline KPI Cards)'
  },
  {
    id: 'market',
    name: 'Market Intelligence',
    method: 'GET',
    endpoint: '/api/market/overview',
    service: 'get_market_overview()',
    table: 'market_skill_metrics, market_salary_metrics',
    uiTarget: 'MarketIntelligenceView (Salary & Skill Charts)'
  },
  {
    id: 'jds',
    name: 'Junior Outcomes (JDS)',
    method: 'GET',
    endpoint: '/api/jds/overview',
    service: 'get_jds_overview()',
    table: 'jds_skill_traits, jds_statistical_results',
    uiTarget: 'JuniorOutcomesView (Cohen d & Logit Models)'
  },
  {
    id: 'sds',
    name: 'Senior Outcomes (SDS)',
    method: 'GET',
    endpoint: '/api/sds/overview',
    service: 'get_sds_overview()',
    table: 'sds_personality_traits, sds_statistical_results',
    uiTarget: 'SeniorOutcomesView (Big Five Trait Metrics)'
  },
  {
    id: 'alignment',
    name: 'Alignment Engine',
    method: 'GET',
    endpoint: '/api/alignment',
    service: 'get_alignment_matrix()',
    table: 'alignment_results (4-Tier Classification)',
    uiTarget: 'AlignmentEngineView (Priority/Watch Matrix)'
  },
  {
    id: 'whatif',
    name: 'What-If Simulation',
    method: 'POST',
    endpoint: '/api/what-if',
    service: 'calculate_what_if_scenario()',
    table: 'jds_model_results (Validated Logit Weights)',
    payload: {
      coding_skills: 4.2,
      maths_stats_skills: 4.0,
      ai_and_ml_skills: 3.8
    },
    uiTarget: 'WhatIfSimulatorMathView (Probability Delta)'
  },
  {
    id: 'quality',
    name: 'Data Quality Audit',
    method: 'GET',
    endpoint: '/api/data-quality',
    service: 'get_data_quality_report()',
    table: 'data_quality_results (Audit Provenance)',
    uiTarget: 'DataQualityView (Audit Ledger)'
  }
];

export const SystemArchitectureView: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<NodeDetail | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<RequestSample>(REQUEST_SAMPLES[0]);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  
  // Live System Status
  const [systemHealth, setSystemHealth] = useState<{
    frontend: 'connected' | 'checking';
    backend: 'connected' | 'offline' | 'checking';
    database: 'available' | 'offline' | 'checking';
    apiLatencyMs: number | null;
    lastChecked: string;
  }>({
    frontend: 'connected',
    backend: 'checking',
    database: 'checking',
    apiLatencyMs: null,
    lastChecked: '--'
  });

  // Request Simulation Animation State
  const [animatingStep, setAnimatingStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [liveResponse, setLiveResponse] = useState<any>(null);
  const [liveStatus, setLiveStatus] = useState<string>('Ready');
  const [measuredLatency, setMeasuredLatency] = useState<number | null>(null);
  const animationTimerRef = useRef<any>(null);

  // Check live backend connectivity
  const checkLiveHealth = async () => {
    const start = performance.now();
    try {
      const res = await fetch('http://127.0.0.1:8000/api/overview');
      const elapsed = Math.round(performance.now() - start);
      if (res.ok) {
        const data = await res.json();
        setSystemHealth({
          frontend: 'connected',
          backend: 'connected',
          database: data.headline_metrics?.total_job_postings_analyzed ? 'available' : 'checking',
          apiLatencyMs: elapsed,
          lastChecked: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        });
      } else {
        setSystemHealth(prev => ({ ...prev, backend: 'offline', database: 'offline', apiLatencyMs: elapsed }));
      }
    } catch (e) {
      setSystemHealth(prev => ({ ...prev, backend: 'offline', database: 'offline', apiLatencyMs: null }));
    }
  };

  useEffect(() => {
    checkLiveHealth();
    const interval = setInterval(checkLiveHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  // Execute Live Request with Animated Step Sequence
  const executeLiveRequest = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setLiveResponse(null);
    setLiveStatus('Initiating User Action...');

    // Sequence of 7 architecture steps
    // 1: User -> 2: Frontend -> 3: API Gateway -> 4: Analytics -> 5: Database -> 6: Response -> 7: UI Update
    const steps = [
      { step: 1, text: 'Step 1: User interaction triggered in browser viewport' },
      { step: 2, text: `Step 2: React API client dispatches ${selectedRequest.method} ${selectedRequest.endpoint}` },
      { step: 3, text: 'Step 3: FastAPI gateway routes request on port 8000' },
      { step: 4, text: `Step 4: ${selectedRequest.service} initiates mathematical computation` },
      { step: 5, text: `Step 5: SQLAlchemy queries careertwin.db (${selectedRequest.table})` },
      { step: 6, text: 'Step 6: Serializing relational records to validated JSON response' },
      { step: 7, text: `Step 7: React receives payload and updates ${selectedRequest.uiTarget}` }
    ];

    let current = 0;
    const advanceStep = () => {
      if (current < steps.length) {
        setAnimatingStep(steps[current].step);
        setLiveStatus(steps[current].text);
        current++;
        animationTimerRef.current = setTimeout(advanceStep, 650);
      } else {
        // Finalize with real API execution
        finalizeRealCall();
      }
    };

    advanceStep();
  };

  const finalizeRealCall = async () => {
    const start = performance.now();
    try {
      const url = `http://127.0.0.1:8000${selectedRequest.endpoint}`;
      const options: RequestInit = {
        method: selectedRequest.method,
        headers: { 'Content-Type': 'application/json' },
        body: selectedRequest.method === 'POST' ? JSON.stringify(selectedRequest.payload || {}) : undefined
      };

      const res = await fetch(url, options);
      const latency = Math.round(performance.now() - start);
      setMeasuredLatency(latency);

      if (res.ok) {
        const json = await res.json();
        setLiveResponse({
          status: res.status,
          statusText: '200 OK',
          latencyMs: latency,
          preview: json
        });
        setLiveStatus('✓ 200 OK — Request successfully resolved & UI state synchronized');
      } else {
        setLiveResponse({
          status: res.status,
          statusText: res.statusText,
          latencyMs: latency,
          error: 'Backend responded with non-200 code'
        });
        setLiveStatus(`⚠ HTTP ${res.status} — ${res.statusText}`);
      }
    } catch (err: any) {
      setLiveResponse({
        status: 0,
        statusText: 'Network Error',
        error: 'Backend unavailable on 127.0.0.1:8000'
      });
      setLiveStatus('⚠ Backend unavailable on 127.0.0.1:8000');
    } finally {
      setIsSimulating(false);
      setTimeout(() => setAnimatingStep(0), 2000);
    }
  };

  // Node highlight checker based on active step
  const isNodeActive = (nodeId: string) => {
    if (animatingStep === 0) return false;
    switch (nodeId) {
      case 'user': return animatingStep === 1 || animatingStep === 7;
      case 'frontend': return animatingStep === 2 || animatingStep === 7;
      case 'api': return animatingStep === 3 || animatingStep === 6;
      case 'intelligence': return animatingStep === 4 || animatingStep === 6;
      case 'data_access': return animatingStep === 5;
      case 'database': return animatingStep === 5;
      case 'raw_data': return animatingStep === 5;
      default: return false;
    }
  };

  return (
    <div className={`space-y-6 text-cream font-sans ${isPresentationMode ? 'fixed inset-0 z-50 bg-soil-950 text-cream overflow-y-auto p-8' : ''}`}>
      
      {/* Top Banner / System Health Bar */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-xl border transition-all ${
        isPresentationMode 
          ? 'bg-surface border-border shadow-sheet' 
          : 'bg-surface border-border shadow-card'
      }`}>
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-basil-soft text-basil-300 border border-basil-dark">
              <Network size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-cream-heading">
                  Live Runtime System Architecture
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-basil-soft text-basil-300 border border-basil-dark font-mono">
                  CareerTwin 2.0 Engine
                </span>
              </div>
              <p className="text-xs text-cream-muted">
                Visual data-flow walkthrough connecting React 19, FastAPI, ML pipelines, and SQLite persistence
              </p>
            </div>
          </div>
        </div>

        {/* Live System Health Meter */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-lg border border-border bg-surface-subtle flex items-center gap-2">
            <span className="text-cream-muted">Frontend:</span>
            <span className="flex items-center gap-1 font-semibold text-basil font-mono">
              <span className="w-2 h-2 rounded-full bg-basil animate-pulse"></span>
              localhost:5173
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-lg border border-border bg-surface-subtle flex items-center gap-2">
            <span className="text-cream-muted">Backend:</span>
            <span className={`flex items-center gap-1 font-semibold font-mono ${
              systemHealth.backend === 'connected' ? 'text-basil' : 'text-tomato'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                systemHealth.backend === 'connected' ? 'bg-basil' : 'bg-tomato'
              }`}></span>
              {systemHealth.backend === 'connected' ? '127.0.0.1:8000' : 'Offline'}
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-lg border border-border bg-surface-subtle flex items-center gap-2">
            <span className="text-cream-muted">Database:</span>
            <span className={`flex items-center gap-1 font-semibold font-mono ${
              systemHealth.database === 'available' ? 'text-basil' : 'text-tomato'
            }`}>
              <Database size={13} />
              careertwin.db (17.7k rows)
            </span>
          </div>

          {systemHealth.apiLatencyMs !== null && (
            <div className="px-3 py-1.5 rounded-lg border border-border bg-surface-subtle flex items-center gap-1.5 text-cream-secondary">
              <Clock size={12} className="text-basil" />
              <span className="font-mono font-semibold">{systemHealth.apiLatencyMs}ms</span>
            </div>
          )}

          {/* Presentation Mode Toggle */}
          <button
            onClick={() => setIsPresentationMode(!isPresentationMode)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isPresentationMode
                ? 'bg-tomato-soft hover:bg-tomato text-cream border-tomato-dark'
                : 'bg-surface-elevated hover:bg-surface-card text-cream border-border'
            }`}
          >
            {isPresentationMode ? (
              <>
                <Minimize2 size={13} />
                <span>Exit Presentation</span>
              </>
            ) : (
              <>
                <Maximize2 size={13} />
                <span>Presentation Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Controls Bar: Select Sample Endpoint & Trigger Request */}
      <div className="p-4 rounded-xl border border-border bg-surface shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Endpoint Selector Chips */}
          <div className="flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cream-muted block mb-2 font-mono">
              Select Real Runtime Workflow to Simulate:
            </span>
            <div className="flex flex-wrap gap-2">
              {REQUEST_SAMPLES.map((req) => (
                <button
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  disabled={isSimulating}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    selectedRequest.id === req.id
                      ? 'bg-basil text-soil-950 font-bold shadow-sm'
                      : 'bg-surface-subtle hover:bg-surface-elevated text-cream-secondary border border-border'
                  }`}
                >
                  <span className={`text-[10px] font-mono px-1 py-0.2 rounded font-bold ${
                    req.method === 'POST' ? 'bg-tomato-soft text-tomato-300' : 'bg-basil-soft text-basil-300'
                  }`}>
                    {req.method}
                  </span>
                  <span>{req.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={executeLiveRequest}
              disabled={isSimulating}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isSimulating
                  ? 'bg-basil-700 text-cream cursor-not-allowed animate-pulse'
                  : 'bg-basil hover:bg-basil-600 text-soil-950 shadow-card active:scale-95'
              }`}
            >
              <Play size={14} className={isSimulating ? 'animate-spin' : 'fill-soil-950'} />
              <span>{isSimulating ? 'Tracing Request Flow...' : '▶ Run Live Request'}</span>
            </button>
          </div>

        </div>

        {/* Live Step Progress Strip */}
        <div className="mt-4 pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-cream-muted">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-basil">Execution Status:</span>
            <span className="font-mono bg-basil-soft text-basil-300 px-2 py-0.5 rounded border border-basil-dark">
              {liveStatus}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-cream-muted font-mono">
            <span>Route: <strong className="text-cream">{selectedRequest.endpoint}</strong></span>
            <span>•</span>
            <span>Service: <strong className="text-cream">{selectedRequest.service}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Visual Architecture Canvas (7 Horizontal Layers) */}
      <div className="relative p-6 rounded-xl border border-border bg-surface shadow-card overflow-x-auto">

        <div className="min-w-[1100px] flex flex-col gap-6">

          {/* Flow Direction Header */}
          <div className="flex items-center justify-between px-2 text-[11px] font-bold uppercase tracking-wider text-cream-muted font-mono">
            <div className="flex items-center gap-2">
              <span>Client Tier</span>
              <ArrowRight size={12} className="text-basil" />
              <span>Network Protocol</span>
              <ArrowRight size={12} className="text-basil" />
              <span>Application Core</span>
              <ArrowRight size={12} className="text-basil" />
              <span>Persistence & Data Lake</span>
            </div>
            <div className="text-cream-muted font-normal">
              Click any node to inspect technology, source file & responsibilities
            </div>
          </div>

          {/* Architecture Blocks Grid */}
          <div className="grid grid-cols-7 gap-3 items-stretch">

            {/* LAYER 1: USER / BROWSER */}
            <div
              onClick={() => setSelectedNode(ARCHITECTURE_NODES.user)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                isNodeActive('user')
                  ? 'ring-2 ring-basil bg-basil-soft border-basil shadow-card scale-[1.02]'
                  : 'bg-surface-subtle hover:bg-surface-elevated border-border shadow-card'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cream-muted font-mono">Layer 1</span>
                  <div className="w-2 h-2 rounded-full bg-basil"></div>
                </div>
                <div className="flex items-center gap-2 text-basil mb-1">
                  <Globe size={18} />
                  <h3 className="text-xs font-bold text-cream-heading">
                    User / Browser
                  </h3>
                </div>
                <p className="text-[11px] text-cream-muted mt-1 line-clamp-2">
                  Client browser session handling user gestures & queries.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border text-[10px] space-y-1 font-mono text-cream-muted">
                <div className="text-basil font-semibold">User Actions</div>
                <div className="truncate">Sliders, Matrix, Views</div>
              </div>
            </div>

            {/* LAYER 2: FRONTEND (REACT 19 + VITE) */}
            <div
              onClick={() => setSelectedNode(ARCHITECTURE_NODES.frontend)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                isNodeActive('frontend')
                  ? 'ring-2 ring-basil bg-basil-soft border-basil shadow-card scale-[1.02]'
                  : 'bg-surface-subtle hover:bg-surface-elevated border-border shadow-card'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cream-muted font-mono">Layer 2</span>
                  <span className="text-[9px] bg-basil-soft text-basil-300 font-semibold px-1.5 py-0.2 rounded font-mono">:5173</span>
                </div>
                <div className="flex items-center gap-2 text-basil mb-1">
                  <Code2 size={18} />
                  <h3 className="text-xs font-bold text-cream-heading">
                    React + Vite
                  </h3>
                </div>
                <p className="text-[11px] text-cream-muted mt-1 line-clamp-2">
                  React 19 SPA, Tailwind CSS, Framer Motion, api.ts client.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border text-[10px] space-y-1 font-mono text-cream-muted">
                <div className="text-cream font-medium">11 Analytics Views</div>
                <div className="truncate">api.ts • fetchJson()</div>
              </div>
            </div>

            {/* LAYER 3: API GATEWAY (FASTAPI) */}
            <div
              onClick={() => setSelectedNode(ARCHITECTURE_NODES.api)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                isNodeActive('api')
                  ? 'ring-2 ring-basil bg-basil-soft border-basil shadow-card scale-[1.02]'
                  : 'bg-surface-subtle hover:bg-surface-elevated border-border shadow-card'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cream-muted font-mono">Layer 3</span>
                  <span className="text-[9px] bg-basil-soft text-basil-300 font-semibold px-1.5 py-0.2 rounded font-mono">:8000</span>
                </div>
                <div className="flex items-center gap-2 text-basil mb-1">
                  <Server size={18} />
                  <h3 className="text-xs font-bold text-cream-heading">
                    FastAPI Gateway
                  </h3>
                </div>
                <p className="text-[11px] text-cream-muted mt-1 line-clamp-2">
                  Async REST Router, CORS middleware, Uvicorn worker.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border text-[10px] space-y-1 font-mono text-cream-muted">
                <div className="text-cream font-medium">backend/main.py</div>
                <div className="truncate">25+ REST Routes</div>
              </div>
            </div>

            {/* LAYER 4: INTELLIGENCE & ANALYTICS */}
            <div
              onClick={() => setSelectedNode(ARCHITECTURE_NODES.intelligence)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                isNodeActive('intelligence')
                  ? 'ring-2 ring-basil bg-basil-soft border-basil shadow-card scale-[1.02]'
                  : 'bg-surface-subtle hover:bg-surface-elevated border-border shadow-card'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cream-muted font-mono">Layer 4</span>
                  <span className="text-[9px] bg-basil-soft text-basil-300 font-semibold px-1.5 py-0.2 rounded font-mono">ML / Stat</span>
                </div>
                <div className="flex items-center gap-2 text-basil mb-1">
                  <Cpu size={18} />
                  <h3 className="text-xs font-bold text-cream-heading">
                    Intelligence Core
                  </h3>
                </div>
                <p className="text-[11px] text-cream-muted mt-1 line-clamp-2">
                  Welch t-test, Cohen d, Logit OR, Random Forest 5-CV.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border text-[10px] space-y-1 font-mono text-cream-muted">
                <div className="text-cream font-medium">careertwin_service.py</div>
                <div className="truncate">4-Tier Matrix Engine</div>
              </div>
            </div>

            {/* LAYER 5: DATA ACCESS (SQLALCHEMY) */}
            <div
              onClick={() => setSelectedNode(ARCHITECTURE_NODES.data_access)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                isNodeActive('data_access')
                  ? 'ring-2 ring-basil bg-basil-soft border-basil shadow-card scale-[1.02]'
                  : 'bg-surface-subtle hover:bg-surface-elevated border-border shadow-card'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cream-muted font-mono">Layer 5</span>
                  <span className="text-[9px] bg-surface text-cream font-semibold px-1.5 py-0.2 rounded font-mono">ORM</span>
                </div>
                <div className="flex items-center gap-2 text-basil mb-1">
                  <Layers size={18} />
                  <h3 className="text-xs font-bold text-cream-heading">
                    Data Access
                  </h3>
                </div>
                <p className="text-[11px] text-cream-muted mt-1 line-clamp-2">
                  SQLAlchemy SessionLocal & 26 mapped entity models.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border text-[10px] space-y-1 font-mono text-cream-muted">
                <div className="text-cream font-medium">database.py & models.py</div>
                <div className="truncate">Thread-safe Sessions</div>
              </div>
            </div>

            {/* LAYER 6: DATABASE (SQLITE) */}
            <div
              onClick={() => setSelectedNode(ARCHITECTURE_NODES.database)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                isNodeActive('database')
                  ? 'ring-2 ring-basil bg-basil-soft border-basil shadow-card scale-[1.02]'
                  : 'bg-surface-subtle hover:bg-surface-elevated border-border shadow-card'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cream-muted font-mono">Layer 6</span>
                  <span className="text-[9px] bg-basil-soft text-basil-300 font-semibold px-1.5 py-0.2 rounded font-mono">SQLite</span>
                </div>
                <div className="flex items-center gap-2 text-basil mb-1">
                  <Database size={18} />
                  <h3 className="text-xs font-bold text-cream-heading">
                    careertwin.db
                  </h3>
                </div>
                <p className="text-[11px] text-cream-muted mt-1 line-clamp-2">
                  Normalized storage for market jobs & career trajectories.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border text-[10px] space-y-1 font-mono text-cream-muted">
                <div className="text-basil font-semibold">17,743 Rows</div>
                <div className="truncate">26 Normalized Tables</div>
              </div>
            </div>

            {/* LAYER 7: REAL DATASETS */}
            <div
              onClick={() => setSelectedNode(ARCHITECTURE_NODES.raw_data)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                isNodeActive('raw_data')
                  ? 'ring-2 ring-basil bg-basil-soft border-basil shadow-card scale-[1.02]'
                  : 'bg-surface-subtle hover:bg-surface-elevated border-border shadow-card'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cream-muted font-mono">Layer 7</span>
                  <span className="text-[9px] bg-surface text-cream font-semibold px-1.5 py-0.2 rounded font-mono">Raw</span>
                </div>
                <div className="flex items-center gap-2 text-basil mb-1">
                  <FileSpreadsheet size={18} />
                  <h3 className="text-xs font-bold text-cream-heading">
                    Data Sources
                  </h3>
                </div>
                <p className="text-[11px] text-cream-muted mt-1 line-clamp-2">
                  Authentic CSV/XLSX hackathon input files.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border text-[10px] space-y-1 font-mono text-cream-muted">
                <div className="text-cream font-medium">4 Real Datasets</div>
                <div className="truncate">Analytics, DS, JDS, SDS</div>
              </div>
            </div>

          </div>

          {/* Dynamic Flow Indicator Wire */}
          <div className="relative py-2">
            <div className="h-1.5 w-full rounded-full bg-surface-subtle">
              <div
                className="h-full rounded-full bg-basil transition-all duration-500"
                style={{
                  width: animatingStep === 0 ? '100%' : `${(animatingStep / 7) * 100}%`,
                  opacity: animatingStep === 0 ? 0.3 : 1
                }}
              />
            </div>
            
            {/* Step Milestones */}
            <div className="flex justify-between items-center text-[10px] font-mono text-cream-muted mt-2 px-1">
              <span>Step 1: User</span>
              <span>Step 2: React</span>
              <span>Step 3: FastAPI</span>
              <span>Step 4: ML Core</span>
              <span>Step 5: Database</span>
              <span>Step 6: JSON Return</span>
              <span>Step 7: UI Sync</span>
            </div>
          </div>

        </div>

      </div>

      {/* SAS + Python Dual Validation Architecture Banner */}
      <div className="p-5 rounded-xl border border-border bg-surface shadow-card space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-basil-soft border border-basil-dark text-basil">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-cream-heading">
                Dual-Engine Architecture: Python Runtime Pipeline + SAS Enterprise Validation Layer
              </h3>
              <p className="text-xs text-cream-muted mt-0.5">
                Python powers the live application and dynamic analytics. SAS provides an independent statistical validation suite.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedNode(ARCHITECTURE_NODES.sas_validation)}
            className="text-xs text-basil hover:underline font-mono font-semibold self-start sm:self-auto"
          >
            Inspect SAS Architecture Node →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-surface-subtle border border-border space-y-1.5">
            <div className="flex items-center justify-between">
              <strong className="text-cream block font-bold">1. Python Application & ML Engine</strong>
              <span className="text-[10px] font-mono bg-basil-soft text-basil-300 px-1.5 py-0.5 rounded border border-basil-dark">RUNTIME ACTIVE</span>
            </div>
            <p className="text-cream-secondary text-[11px] leading-relaxed">
              FastAPI asynchronous server, Pandas data manipulation, SciPy Welch t-tests, Statsmodels Benjamini-Hochberg FDR, and Scikit-learn Logistic Regression / Random Forest classifiers.
            </p>
            <div className="text-[10px] font-mono text-cream-muted pt-1">
              Active Files: backend/main.py • careertwin_service.py • simulator.py
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-surface-subtle border border-border space-y-1.5">
            <div className="flex items-center justify-between">
              <strong className="text-cream block font-bold">2. SAS Statistical Validation Layer</strong>
              <span className="text-[10px] font-mono bg-surface-elevated text-cream px-1.5 py-0.5 rounded border border-border">VALIDATION PROTOCOL</span>
            </div>
            <p className="text-cream-secondary text-[11px] leading-relaxed">
              Independent batch validation suite executing PROC TTEST, PROC NPAR1WAY (Mann-Whitney U), PROC MULTTEST (FDR q-values), and PROC LOGISTIC (Odds ratios and Hosmer-Lemeshow fit) to verify mathematical consistency.
            </p>
            <div className="text-[10px] font-mono text-cream-muted pt-1">
              Validation Suite: backend/careertwin_sas_validation.sas
            </div>
          </div>
        </div>
      </div>

      {/* Live Response & Telemetry Output Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Live Execution Console */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-border bg-surface shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-basil" />
              <h3 className="text-xs font-bold text-cream-heading">
                Runtime HTTP Telemetry Output
              </h3>
            </div>
            {measuredLatency !== null && (
              <span className="text-[11px] font-mono bg-basil-soft text-basil-300 px-2 py-0.5 rounded font-semibold border border-basil-dark">
                Roundtrip: {measuredLatency}ms
              </span>
            )}
          </div>

          {liveResponse ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <span className={`px-2 py-0.5 rounded font-bold ${
                  liveResponse.status === 200 ? 'bg-basil-soft text-basil-300 border border-basil-dark' : 'bg-tomato-soft text-tomato-300 border border-tomato-dark'
                }`}>
                  HTTP {liveResponse.status} {liveResponse.statusText}
                </span>
                <span className="text-cream-muted">
                  Target: <strong>http://127.0.0.1:8000{selectedRequest.endpoint}</strong>
                </span>
              </div>

              {/* JSON preview */}
              <div className="relative">
                <pre className="p-4 rounded-xl text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed border bg-soil-950 text-basil border-border">
                  {JSON.stringify(liveResponse.preview || liveResponse.error, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-cream-muted">
              <Sparkles size={24} className="mx-auto text-basil mb-2 opacity-60" />
              <p className="font-medium text-cream">Click "▶ Run Live Request" to trace an actual HTTP call</p>
              <p className="text-[11px] text-cream-muted mt-0.5">The trace will physically query the FastAPI backend and display measured roundtrip latency</p>
            </div>
          )}
        </div>

        {/* Selected Component Deep-Dive Inspector */}
        <div className="p-5 rounded-xl border border-border bg-surface shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
            <div className="flex items-center gap-2">
              <HardDrive size={16} className="text-basil" />
              <h3 className="text-xs font-bold text-cream-heading">
                Node Inspector
              </h3>
            </div>
            <span className="text-[10px] text-cream-muted font-mono">
              {selectedNode ? selectedNode.layer : 'Click a layer'}
            </span>
          </div>

          {selectedNode ? (
            <div className="space-y-3 text-xs">
              <div>
                <h4 className="font-bold text-sm text-basil mb-0.5">{selectedNode.name}</h4>
                <p className="text-[11px] text-cream-muted">{selectedNode.responsibility}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-subtle border border-border space-y-1.5 font-mono text-[11px]">
                <div className="text-cream font-semibold flex items-center justify-between">
                  <span>Technology:</span>
                  <span className="text-basil font-normal">{selectedNode.technology}</span>
                </div>
                {selectedNode.metrics && (
                  <div className="text-cream font-semibold flex items-center justify-between">
                    <span>Runtime:</span>
                    <span className="text-basil font-normal">{selectedNode.metrics}</span>
                  </div>
                )}
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cream-muted block mb-1">
                  Associated Project Source Files:
                </span>
                <ul className="space-y-1 font-mono text-[11px] text-cream-secondary">
                  {selectedNode.files.map((f, i) => (
                    <li key={i} className="p-1 rounded bg-surface-subtle border border-border truncate">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border text-[11px]">
                <div>
                  <span className="text-[10px] text-cream-muted block font-semibold">Input</span>
                  <p className="text-cream truncate">{selectedNode.input}</p>
                </div>
                <div>
                  <span className="text-[10px] text-cream-muted block font-semibold">Output</span>
                  <p className="text-cream truncate">{selectedNode.output}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-cream-muted">
              <p>Click on any of the 7 architecture blocks above to inspect internal implementation details, files, and contracts.</p>
            </div>
          )}
        </div>

      </div>

      {/* Presentation Mode Help Footer */}
      {isPresentationMode && (
        <div className="p-4 rounded-xl bg-basil-soft border border-basil-dark text-xs text-cream flex items-center justify-between shadow-sheet">
          <div className="flex items-center gap-2">
            <Zap size={15} className="text-basil" />
            <span>
              <strong>Judge Presentation View Active:</strong> Enlarged layout optimized for projection. Click "▶ Run Live Request" to demonstrate live runtime data propagation.
            </span>
          </div>
          <button
            onClick={() => setIsPresentationMode(false)}
            className="px-3 py-1 rounded bg-basil text-soil-950 font-bold hover:bg-basil-600 transition-colors"
          >
            Exit Presentation
          </button>
        </div>
      )}

    </div>
  );
};
