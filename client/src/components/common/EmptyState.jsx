import React from 'react';
import Button from './Button';
import { PackageOpen } from 'lucide-react';

const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'Try adjusting your search criteria or filters to see more results.',
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 px-4 rounded-2xl bg-white border border-[#E3EAE7] shadow-soft max-w-md mx-auto ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-[#E6F4F2] text-[#0F766E] flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-base font-bold text-[#17211F] font-display">{title}</h4>
      <p className="text-sm text-[#64716D] mt-1.5 mb-6 max-w-xs mx-auto leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
