import React, { useState, useEffect } from 'react';
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
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [search, setSearch] = useState<string>("");
  const [isAdding, setIsAdding] = useState<boolean>(false);

  useEffect(() => {
    const fetchTaxonomy = async () => {
      try {
        const skills = await api.getTaxonomySkills();
        setTaxonomy(skills);
        const cats = Array.from(new Set(skills.map((s: any) => s.category))) as string[];
        setCategories(["All", ...cats]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTaxonomy();
  }, []);

  const userSkillIds = new Set(userSkills.map(s => s.skill_id));

  const filteredSkills = taxonomy.filter(s => {
    const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
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
      <div className="bg-pigeon-800 border border-pigeon-600 rounded-xl p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-acid-500 text-xs font-bold uppercase tracking-wider mb-1">
            <CheckCircle size={16} />
            <span>Master Profile Verification</span>
          </div>
          <h1 className="text-2xl font-bold text-almond-200">
            My Verified Skills
          </h1>
          <p className="text-xs text-almond-400 mt-1 max-w-2xl leading-relaxed">
            Your single source of truth for technical competencies. Normalized against industry standards to eliminate duplicate aliases (e.g. AWS vs Amazon Web Services).
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-3xl font-extrabold text-almond-200 font-mono">{userSkills.length}</span>
          <span className="block text-[11px] text-almond-600 font-medium">Verified Competencies</span>
        </div>
      </div>

      {/* User Verified Skills Chips */}
      <div className="bg-pigeon-800 rounded-xl border border-pigeon-600 p-6 shadow-subtle">
        <h3 className="text-xs font-bold uppercase tracking-wider text-almond-400 mb-3">
          Currently in Your Master Profile ({userSkills.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {userSkills.map((sk) => (
            <div 
              key={sk.skill_id}
              className="p-3 rounded-lg border border-pigeon-600 bg-pigeon-900 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-almond-200 block">{sk.name}</span>
                <span className="text-[10px] text-almond-400">{sk.category} · {sk.proficiency}</span>
              </div>
              <button
                onClick={() => handleRemoveSkill(sk.skill_id)}
                title="Remove skill"
                className="text-almond-600 hover:text-tomato-400 transition-colors p-1"
              >
                <Trash size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Normalized Taxonomy Explorer */}
      <div className="bg-pigeon-800 rounded-xl border border-pigeon-600 p-6 shadow-subtle space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-almond-200">
              Add Skills from Taxonomy Catalog ({taxonomy.length}+ Normalized Entities)
            </h3>
            <p className="text-xs text-almond-400">
              Select any skill to immediately include it in your Master Profile.
            </p>
          </div>

          <div className="relative w-full md:w-64">
            <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-almond-600" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search taxonomy..."
              className="w-full bg-pigeon-900 border border-pigeon-600 rounded-lg pl-8 pr-3 py-1.5 text-xs text-almond-200 focus:outline-none focus:border-acid-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 border-b border-pigeon-600 pb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-acid-500 text-pigeon-950 font-bold'
                  : 'bg-pigeon-900 text-almond-400 hover:bg-pigeon-700'
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
                className="p-3 rounded-lg border border-pigeon-600 flex items-center justify-between bg-pigeon-900 text-xs hover:border-pigeon-500 transition-all"
              >
                <div>
                  <span className="font-semibold text-almond-200 block">{sk.name}</span>
                  <span className="text-[10px] text-almond-600">{sk.category}</span>
                </div>

                {isOwned ? (
                  <span className="text-[10px] font-semibold text-acid-400 bg-acid-950/60 px-2 py-0.5 rounded border border-acid-600/40">
                    Added
                  </span>
                ) : (
                  <button
                    onClick={() => handleAddSkill(sk.id)}
                    disabled={isAdding}
                    className="flex items-center gap-1 text-[11px] font-bold text-acid-400 bg-pigeon-800 hover:bg-pigeon-700 px-2 py-1 rounded border border-pigeon-600 transition-colors"
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
