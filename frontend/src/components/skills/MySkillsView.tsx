import React, { useState } from 'react';
import { CheckCircle, Plus, Trash, MagnifyingGlass } from '@phosphor-icons/react';
import { UserSkill } from '../../types';
import { api } from '../../services/api';

interface MySkillsViewProps {
  userSkills: UserSkill[];
  onSkillsUpdated: () => void;
}

export const MySkillsView: React.FC<MySkillsViewProps> = ({
  userSkills,
  onSkillsUpdated
}) => {
  const [taxonomy, setTaxonomy] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  React.useEffect(() => {
    api.getSkills().then(setTaxonomy).catch(console.error);
  }, []);

  const categories = ["All", "Languages", "Frontend", "Backend", "Cloud", "DevOps", "AI/ML", "Data", "Security", "Core CS"];

  const userSkillIds = new Set(userSkills.map(s => s.skill_id));

  const filteredSkills = taxonomy.filter(s => {
    const matchCat = selectedCategory === "All" || s.category === selectedCategory;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
      (s.aliases && s.aliases.some((a: string) => a.toLowerCase().includes(search.toLowerCase())));
    return matchCat && matchSearch;
  });

  const handleAddSkill = async (skillId: string) => {
    setIsAdding(true);
    try {
      await api.addUserSkill(skillId, "Intermediate");
      onSkillsUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    try {
      await api.removeUserSkill(skillId);
      onSkillsUpdated();
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
            <CheckCircle size={16} />
            <span>Master Profile Verification</span>
          </div>
          <h1 className="text-2xl font-bold text-charcoal">
            My Verified Skills
          </h1>
          <p className="text-xs text-muted mt-1 max-w-2xl leading-relaxed">
            Your single source of truth for technical competencies. Normalized against industry standards to eliminate duplicate aliases (e.g. AWS vs Amazon Web Services).
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-3xl font-extrabold text-charcoal font-mono">{userSkills.length}</span>
          <span className="block text-[11px] text-muted font-medium">Verified Competencies</span>
        </div>
      </div>

      {/* User Verified Skills Chips */}
      <div className="bg-surface rounded-xl border border-border p-6 shadow-subtle">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
          Currently in Your Master Profile ({userSkills.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {userSkills.map((sk) => (
            <div 
              key={sk.skill_id}
              className="p-3 rounded-lg border border-border bg-surface-subtle flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-charcoal block">{sk.name}</span>
                <span className="text-[10px] text-muted">{sk.category} · {sk.proficiency}</span>
              </div>
              <button
                onClick={() => handleRemoveSkill(sk.skill_id)}
                title="Remove skill"
                className="text-slate-400 hover:text-rose-600 transition-colors p-1"
              >
                <Trash size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Normalized Taxonomy Explorer */}
      <div className="bg-surface rounded-xl border border-border p-6 shadow-subtle space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-charcoal">
              Add Skills from Taxonomy Catalog ({taxonomy.length}+ Normalized Entities)
            </h3>
            <p className="text-xs text-muted">
              Select any skill to immediately include it in your Master Profile.
            </p>
          </div>

          <div className="relative w-full md:w-64">
            <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search taxonomy..."
              className="w-full bg-surface-subtle border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-charcoal focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 border-b border-border pb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-charcoal text-white font-semibold'
                  : 'bg-surface-subtle text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Available Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
          {filteredSkills.map((sk) => {
            const isOwned = userSkillIds.has(sk.id);
            return (
              <div
                key={sk.id}
                className="p-3 rounded-lg border border-border flex items-center justify-between bg-white text-xs hover:border-slate-300 transition-all"
              >
                <div>
                  <span className="font-semibold text-charcoal block">{sk.name}</span>
                  <span className="text-[10px] text-muted">{sk.category}</span>
                </div>

                {isOwned ? (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Added
                  </span>
                ) : (
                  <button
                    onClick={() => handleAddSkill(sk.id)}
                    disabled={isAdding}
                    className="flex items-center gap-1 text-[11px] font-bold text-accent bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors"
                  >
                    <Plus size={12} weight="bold" />
                    <span>Add</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
