import React from "react";

const DashboardSkeleton = () => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-zinc-900/70 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 animate-pulse"
        >
          {/* Title */}
          <div className="h-5 w-3/4 bg-zinc-800 rounded-md mb-4" />

          {/* Description lines */}
          <div className="space-y-2 mb-6">
            <div className="h-3 bg-zinc-800 rounded-md w-full" />
            <div className="h-3 bg-zinc-800 rounded-md w-5/6" />
            <div className="h-3 bg-zinc-800 rounded-md w-4/6" />
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full bg-zinc-800 rounded-full mb-4" />

          {/* Button */}
          <div className="h-10 w-28 bg-zinc-800 rounded-xl" />
        </div>
      ))}
    </div>
  );
};

export default DashboardSkeleton;