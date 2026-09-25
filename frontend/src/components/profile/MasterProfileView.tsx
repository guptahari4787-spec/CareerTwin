import React, { useState } from 'react';
import { User, UploadSimple, Check, FloppyDisk, CheckCircle, WarningCircle } from '@phosphor-icons/react';
import { StudentProfile } from '../../types';
import { api } from '../../services/api';

interface MasterProfileViewProps {
  profile: StudentProfile | null;
  onProfileUpdated: () => void;
}

export const MasterProfileView: React.FC<MasterProfileViewProps> = ({
  profile,
  onProfileUpdated
}) => {
  const [fullName, setFullName] = useState(profile?.full_name || "Hariom Gupta");
  const [university, setUniversity] = useState(profile?.university || "Chandigarh University");
  const [degree, setDegree] = useState(profile?.degree || "B.E. Computer Science Engineering");
  const [bio, setBio] = useState(profile?.bio || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Resume upload review state
  const [uploading, setUploading] = useState(false);
  const [extractionResult, setExtractionResult] = useState<any | null>(null);
  const [approvedSkills, setApprovedSkills] = useState<string[]>([]);
  const [commitMessage, setCommitMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (profile) {
      setFullName(profile.full_name);
      setUniversity(profile.university);
      setDegree(profile.degree);
      setBio(profile.bio);
    }
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await api.updateProfile({
        full_name: fullName,
        university,
        degree,
        bio
      });
      setSaveSuccess(true);
      onProfileUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setExtractionResult(null);
    setCommitMessage(null);
    try {
      const data = await api.uploadResume(file);
      setExtractionResult(data);
      setApprovedSkills(data.extracted_skills.map((s: any) => s.skill_id));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const toggleApproveSkill = (skillId: string) => {
    setApprovedSkills((prev) => 
      prev.includes(skillId) ? prev.filter(s => s !== skillId) : [...prev, skillId]
    );
  };

  const handleCommitExtraction = async () => {
    if (!approvedSkills.length) return;
    try {
      for (const s of approvedSkills) {
        await api.addUserSkill(s, "Intermediate");
      }
      setCommitMessage(`Successfully committed ${approvedSkills.length} reviewed skills to Master Profile.`);
      setExtractionResult(null);
      onProfileUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-1">
            <User size={16} />
            <span>Master Profile Source of Truth</span>
          </div>
          <h1 className="text-2xl font-bold text-charcoal">
            Student Master Profile
          </h1>
          <p className="text-xs text-muted mt-1 max-w-2xl leading-relaxed">
            All career-specific resumes and simulation deltas reference this single source of truth. Manage your authentic education, verified skills, and project history.
          </p>
        </div>

        {/* Profile Status Badge */}
        <div className="px-3.5 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-charcoal font-semibold shrink-0">
          <span>Student ID: CU-2022-CSE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Master Form (7 cols) */}
        <div className="lg:col-span-7 bg-surface rounded-xl border border-border p-6 shadow-subtle">
          <h3 className="text-sm font-bold text-charcoal mb-4">
            Candidate Information
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-charcoal mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-surface-subtle border border-border rounded-lg p-2.5 text-xs text-charcoal focus:outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-charcoal mb-1">University</label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full bg-surface-subtle border border-border rounded-lg p-2.5 text-xs text-charcoal focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Degree & Major</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full bg-surface-subtle border border-border rounded-lg p-2.5 text-xs text-charcoal focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-charcoal mb-1">Professional Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-surface-subtle border border-border rounded-lg p-2.5 text-xs text-charcoal focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {saveSuccess && (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle size={14} weight="fill" /> Master Profile updated successfully.
                </span>
              )}
              <button
                type="submit"
                disabled={isSaving}
                className="ml-auto px-4 py-2 bg-charcoal hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <FloppyDisk size={14} />
                <span>{isSaving ? "Saving..." : "Save Master Profile"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Resume Upload & Extraction Review (5 cols) */}
        <div className="lg:col-span-5 bg-surface rounded-xl border border-border p-6 shadow-subtle space-y-4">
          <div>
            <h3 className="text-sm font-bold text-charcoal">
              Resume Ingestion & Extraction
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Upload your existing PDF or Markdown resume. Extracted competencies will be queued for your manual review before being committed.
            </p>
          </div>

          {/* Upload Drop Area */}
          <label className="border-2 border-dashed border-border hover:border-accent rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-surface-subtle transition-colors text-center">
            <UploadSimple size={24} className="text-slate-400 mb-2" />
            <span className="text-xs font-semibold text-charcoal">
              {uploading ? "Parsing Document..." : "Click to upload resume (PDF / TXT)"}
            </span>
            <span className="text-[10px] text-muted mt-1">
              Supports ATS-formatted documents
            </span>
            <input 
              type="file" 
              accept=".pdf,.txt,.md,.doc,.docx" 
              onChange={handleFileUpload}
              className="hidden" 
            />
          </label>

          {commitMessage && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle size={15} weight="fill" />
              <span>{commitMessage}</span>
            </div>
          )}

          {/* EXTRACTION REVIEW MODAL / ACCORDION */}
          {extractionResult && (
            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-charcoal">
                  Extraction Review: {extractionResult.filename}
                </span>
                <span className="text-[10px] text-accent font-semibold">
                  Review & Approve
                </span>
              </div>

              <p className="text-[11px] text-muted">
                Uncheck any items that were incorrectly parsed:
              </p>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {extractionResult.extracted_skills.map((s: any) => {
                  const isChecked = approvedSkills.includes(s.skill_id);
                  return (
                    <label 
                      key={s.skill_id}
                      className="flex items-center justify-between p-2 rounded bg-white border border-border text-xs cursor-pointer"
                    >
                      <span className="font-medium text-charcoal">{s.name}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleApproveSkill(s.skill_id)}
                        className="rounded text-accent"
                      />
                    </label>
                  );
                })}
              </div>

              <button
                onClick={handleCommitExtraction}
                className="w-full py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Check size={14} weight="bold" />
                <span>Confirm & Commit ({approvedSkills.length}) to Master Profile</span>
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
