import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { CheckCircle2, Circle, Plus, UserCheck } from 'lucide-react';

const ChecklistManager = ({ checklist = [], onToggleItem, onAddItem, canEdit = true }) => {
  const [newItemTitle, setNewItemTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;
    setIsAdding(true);
    try {
      await onAddItem({ title: newItemTitle.trim(), isRequired: true });
      setNewItemTitle('');
    } finally {
      setIsAdding(false);
    }
  };

  const completedCount = checklist.filter(item => item.isCompleted).length;
  const progressPercent = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-[#E3EAE7] p-6 shadow-soft space-y-5">
      {/* Header and Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="font-bold text-base text-[#17211F] font-display">
              Audited Task Checklist
            </h4>
            <p className="text-xs text-[#64716D]">
              Verified milestone checkpoints required for this job
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm font-extrabold text-[#0F766E] font-display">
              {completedCount} / {checklist.length}
            </span>
            <span className="text-xs text-[#64716D] block">({progressPercent}% complete)</span>
          </div>
        </div>

        {/* Visual Progress Track */}
        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-[#0F766E] h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist items list */}
      <div className="space-y-2.5">
        {checklist.map((item, index) => {
          const isDone = item.isCompleted;
          return (
            <div
              key={item._id || index}
              onClick={() => canEdit && onToggleItem(item._id, !isDone)}
              className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                canEdit ? 'cursor-pointer hover:border-[#0F766E]' : ''
              } ${
                isDone
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-[#F7F9F8] border-[#E3EAE7]'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold leading-snug ${
                    isDone ? 'line-through text-gray-500' : 'text-[#17211F]'
                  }`}
                >
                  {item.title}
                </p>
                {item.description && (
                  <p className="text-xs text-[#64716D] mt-0.5">{item.description}</p>
                )}
                {isDone && item.completedAt && (
                  <div className="flex items-center gap-1 text-[10px] text-emerald-700 mt-1">
                    <UserCheck className="w-3 h-3" />
                    <span>Completed on {new Date(item.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                )}
              </div>

              {item.isRequired && (
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider self-center">
                  Required
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Add new checklist item form */}
      {canEdit && (
        <form onSubmit={handleAdd} className="flex items-center gap-2 pt-2 border-t border-[#E3EAE7]">
          <input
            type="text"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            placeholder="Add a new checklist task (e.g. Wipe interior kitchen cabinets)..."
            className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
          />
          <Button type="submit" variant="outline" size="sm" isLoading={isAdding}>
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        </form>
      )}
    </div>
  );
};

export default ChecklistManager;
