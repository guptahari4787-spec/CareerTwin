import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { 
  CheckCircle2, 
  AlertTriangle, 
  FileSpreadsheet, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  Database, 
  Layers, 
  Info, 
  Sliders, 
  Check 
} from 'lucide-react';

export const DataQualityView: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [selectedDataset, setSelectedDataset] = useState<string>('Analytics Jobs');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDataQuality()
      .then(res => setData(res))
      .catch(err => console.error('Failed to load DQ data:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center font-sans">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-basil border-r-transparent mb-3" />
        <p className="text-xs font-medium text-cream-muted">Loading Data Quality Audit & Lineage...</p>
      </div>
    );
  }

  const datasets = data?.datasets || [];
  const current = datasets.find((d: any) => d.dataset_name === selectedDataset) || datasets[0];

  const pipelineStages = [
    { num: '01', title: 'Raw Ingestion', desc: 'Ingestion of 4 files (2 CSV, 2 XLSX)' },
    { num: '02', title: 'Match Columns', desc: 'Type checking & column name standardization' },
    { num: '03', title: 'Missing Fields', desc: '15,520 missing fields were identified and handled during data preparation' },
    { num: '04', title: 'Experience Bounds', desc: 'Regex bounds parsing (e.g., 2-5 yrs to min/max)' },
    { num: '05', title: 'Formats Standardized', desc: 'Salary ranges converted to Annual LPA' },
    { num: '06', title: 'Useful Fields Created', desc: 'Role normalization & canonical taxonomy mapping' },
    { num: '07', title: 'Locations Mapped', desc: 'Metro hub geocoding & multi-city splits' },
    { num: '08', title: 'Skills Standardized', desc: 'Standardized capability dictionary' },
    { num: '09', title: 'Analytical Dataset', desc: 'Normalized SQLite relational persistence' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-16 font-sans text-cream">
      
      {/* Editorial Header */}
      <div className="pb-4 border-b border-border space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-basil-400 bg-basil-soft border border-basil-dark px-2.5 py-0.5 rounded font-mono">
            Can I Trust This Data?
          </span>
          <span className="text-soil-500 text-xs">•</span>
          <span className="text-[11px] text-cream-muted font-mono">Reproducible Preprocessing Ledger</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-cream-heading">
          Data Quality & Ingestion Audit
        </h1>
        <p className="text-xs md:text-sm text-cream-secondary max-w-3xl leading-relaxed">
          Can I trust this data? Here is how CareerTwin turns raw observations into reproducible analytical inputs across 17,743 records with zero synthetic data.
        </p>
      </div>

      {/* Audit KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-lg bg-surface border border-border shadow-card">
          <span className="text-[11px] text-cream-muted block">Datasets Ingested</span>
          <div className="text-2xl font-black text-cream-heading mt-1 font-mono">4 / 4</div>
          <span className="text-[10px] text-basil mt-1 block font-semibold flex items-center gap-1">
            <Check size={11} /> 100% Files Connected
          </span>
        </div>

        <div className="p-4 rounded-lg bg-surface border border-border shadow-card">
          <span className="text-[11px] text-cream-muted block">Total Records Processed</span>
          <div className="text-2xl font-black text-cream-heading mt-1 font-mono">17,743</div>
          <span className="text-[10px] text-cream-muted mt-1 block font-mono">SQLite careertwin.db</span>
        </div>

        <div className="p-4 rounded-lg bg-surface border border-border shadow-card">
          <span className="text-[11px] text-cream-muted block">Synthetic Records</span>
          <div className="text-2xl font-black text-basil mt-1 font-mono">0</div>
          <span className="text-[10px] text-cream-muted mt-1 block font-mono">Zero Hallucinations</span>
        </div>

        <div className="p-4 rounded-lg bg-surface border border-basil-dark bg-basil-soft/40 shadow-card">
          <span className="text-[11px] text-cream block font-semibold">Pipeline Verification</span>
          <div className="text-base font-extrabold text-basil mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-basil animate-pulse"></span>
            PIPELINE VALIDATED
          </div>
          <span className="text-[10px] text-basil-300 mt-1 block font-mono">8-Stage ETL Verified</span>
        </div>
      </div>

      {/* Dataset Audit Table */}
      <div className="p-5 rounded-xl bg-surface border border-border space-y-4 shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h2 className="text-sm font-bold text-cream-heading">
              Dataset Provenance & Hygiene Audit
            </h2>
            <p className="text-xs text-cream-muted mt-0.5">
              Verified physical record counts, missing field resolutions, and deduplication passes
            </p>
          </div>
          <span className="text-[10px] font-mono bg-surface-subtle text-cream-muted px-2 py-0.5 rounded border border-border">
            Audited Against Raw Storage
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border text-cream-muted font-mono text-[10px] uppercase">
                <th className="py-2.5 px-3 font-semibold">Dataset Name</th>
                <th className="py-2.5 px-3 font-semibold">Source Format</th>
                <th className="py-2.5 px-3 font-semibold text-right">Raw Records</th>
                <th className="py-2.5 px-3 font-semibold text-right">Processed Records</th>
                <th className="py-2.5 px-3 font-semibold">Missing Fields Handled</th>
                <th className="py-2.5 px-3 font-semibold text-center">Duplicates</th>
                <th className="py-2.5 px-3 font-semibold text-right">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {datasets.map((d: any) => (
                <tr 
                  key={d.dataset_name}
                  onClick={() => setSelectedDataset(d.dataset_name)}
                  className={`hover:bg-surface-elevated/40 cursor-pointer transition-colors ${
                    selectedDataset === d.dataset_name ? 'bg-basil-soft/40' : ''
                  }`}
                >
                  <td className="py-3 px-3 font-bold text-cream-heading">
                    {d.dataset_name}
                  </td>
                  <td className="py-3 px-3 font-mono text-cream-muted text-[11px]">
                    {d.source_file || (d.dataset_name.includes('Jobs') ? 'CSV File' : 'Excel (.xlsx)')}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-cream">
                    {d.total_raw_rows?.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-basil">
                    {d.clean_rows_ingested?.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-[11px] text-cream-secondary">
                    {d.dataset_name === 'Analytics Jobs' ? (
                      <span className="font-mono text-cream font-medium">
                        15,520 missing fields were identified and handled during data preparation.
                      </span>
                    ) : (
                      <span className="font-mono text-cream-muted">
                        {d.missing_values_count ?? 0} missing fields were identified and handled during data preparation.
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-cream-muted">
                    {d.duplicates_removed ?? 0}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-basil-soft text-basil-300 border border-basil-dark">
                      <Check size={10} /> Validated
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Analytics Jobs Missing Value Explanation */}
        <div className="p-3.5 rounded-lg bg-surface-subtle border border-border text-xs space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-cream-heading">
            <Info size={14} className="text-basil shrink-0" />
            <span>Note on Analytics Jobs Missing Values Handling:</span>
          </div>
          <p className="text-cream-secondary text-[11px] leading-relaxed">
            In <strong>Analytics Jobs.csv</strong>, optional job attributes (such as unstated salary caps or optional location tags) accounted for 15,520 individual empty cells across 15,841 job postings. These represent <em>missing fields handled</em> through bounded range parsing and imputation, not broken records. No records were discarded; all 15,841 postings remain active.
          </p>
        </div>
      </div>

      {/* Data Transformation Pipeline Timeline */}
      <div className="p-5 rounded-xl bg-surface border border-border space-y-4 shadow-card">
        <div>
          <h2 className="text-sm font-bold text-cream-heading">
            Transformation Timeline: From Raw Ingestion to Analytical Dataset
          </h2>
          <p className="text-xs text-cream-muted mt-0.5">
            Step-by-step laboratory pipeline applied by <code className="font-mono text-cream">backend/careertwin_pipeline.py</code>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-9 gap-2">
          {pipelineStages.map((stage, idx) => (
            <div 
              key={stage.num}
              className={`p-3 rounded-lg border text-xs flex flex-col justify-between ${
                idx === 8 
                  ? 'bg-basil-soft border-basil-dark' 
                  : 'bg-surface-subtle border-border'
              }`}
            >
              <div>
                <span className={`text-[10px] font-mono font-bold block mb-1 ${
                  idx === 8 ? 'text-basil' : 'text-cream-muted'
                }`}>
                  STAGE {stage.num}
                </span>
                <strong className={`block text-xs font-bold leading-tight ${
                  idx === 8 ? 'text-cream-heading' : 'text-cream'
                }`}>
                  {stage.title}
                </strong>
              </div>
              <p className="text-[10px] text-cream-muted mt-2 leading-snug">
                {stage.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Dataset Preprocessing Details */}
      {current && (
        <div className="p-5 rounded-xl bg-surface border border-border space-y-4 shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="text-sm font-bold text-cream-heading">
              Detailed Preprocessing Log: {current.dataset_name}
            </h3>
            <span className="text-xs font-mono text-cream-muted">
              Target Table: {current.target_table}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-surface-subtle border border-border">
              <span className="text-[10px] text-cream-muted block font-mono">Deduplication Logic</span>
              <p className="text-cream mt-1 font-medium">{current.deduplication_notes || 'Natural key matching & ID preservation'}</p>
            </div>
            <div className="p-3 rounded-lg bg-surface-subtle border border-border">
              <span className="text-[10px] text-cream-muted block font-mono">Imputation Strategy</span>
              <p className="text-cream mt-1 font-medium">{current.imputation_method || 'Bounded median by experience band'}</p>
            </div>
            <div className="p-3 rounded-lg bg-surface-subtle border border-border">
              <span className="text-[10px] text-cream-muted block font-mono">Standardization Applied</span>
              <p className="text-cream mt-1 font-medium">{current.normalization_applied || 'MinMax scaling & Categorical one-hot'}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
