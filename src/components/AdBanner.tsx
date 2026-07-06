import React from 'react';

export default function AdBanner() {
  return (
    <div className="hidden lg:block w-full bg-white flex justify-center items-center py-2 border-b border-slate-200" style={{ minHeight: 90 }}>
      <img
        src="https://www.nestle.com/sites/default/files/styles/brand_carousel_large/public/2022-09/Nescafe%20Red%20Mug%20Brand%20Page%20Banner.jpg?itok=2QwQwQwQ"
        alt="Nescafe Ad"
        className="h-20 object-contain"
        style={{ maxWidth: '100%', maxHeight: 90 }}
      />
    </div>
  );
}
