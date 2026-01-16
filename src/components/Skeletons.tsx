'use client';

export function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-slate-700 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-slate-700" />
        <div className="w-5 h-5 rounded bg-gray-200 dark:bg-slate-700" />
      </div>
      <div className="h-8 w-32 rounded bg-gray-200 dark:bg-slate-700 mb-2" />
      <div className="h-4 w-48 rounded bg-gray-200 dark:bg-slate-700" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg animate-pulse">
      <div className="h-6 w-48 rounded bg-gray-200 dark:bg-slate-700 mb-4" />
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-4 rounded bg-gray-200 dark:bg-slate-700" style={{ width: `${90 - i * 10}%` }} />
        ))}
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 animate-pulse flex items-center gap-4">
      <div className="w-6 h-6 rounded bg-gray-200 dark:bg-slate-700" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 rounded bg-gray-200 dark:bg-slate-700" />
        <div className="h-3 w-48 rounded bg-gray-200 dark:bg-slate-700" />
      </div>
      <div className="space-x-2 flex">
        <div className="w-10 h-10 rounded bg-gray-200 dark:bg-slate-700" />
        <div className="w-10 h-10 rounded bg-gray-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}

export function ProgressBarSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-4 w-32 rounded bg-gray-200 dark:bg-slate-700" />
      <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-slate-700" />
    </div>
  );
}

export function DocumentCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border-2 border-gray-200 dark:border-slate-700 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-slate-700" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded bg-gray-200 dark:bg-slate-700" />
            <div className="h-3 w-48 rounded bg-gray-200 dark:bg-slate-700" />
          </div>
        </div>
        <div className="w-20 h-6 rounded-full bg-gray-200 dark:bg-slate-700" />
      </div>
      <div className="space-y-2 mb-3">
        <div className="h-3 w-full rounded bg-gray-200 dark:bg-slate-700" />
        <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg animate-pulse">
      <div className="h-6 w-48 rounded bg-gray-200 dark:bg-slate-700 mb-8" />
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-16 h-4 rounded bg-gray-200 dark:bg-slate-700" />
            <div className="flex-1 h-8 rounded bg-gray-200 dark:bg-slate-700" style={{ width: `${Math.random() * 60 + 20}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}
