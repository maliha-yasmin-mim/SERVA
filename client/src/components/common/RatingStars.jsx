import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 5.0, count, size = 'sm', showNumeric = true }) => {
  const stars = [1, 2, 3, 4, 5];
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div className="inline-flex items-center gap-1.5 text-xs text-[#64716D]">
      <div className="flex items-center text-amber-400">
        {stars.map((s) => (
          <Star
            key={s}
            className={`${starSize} ${
              s <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      {showNumeric && (
        <span className="font-semibold text-[#17211F]">
          {Number(rating).toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-[#64716D]">({count})</span>
      )}
    </div>
  );
};

export default RatingStars;
