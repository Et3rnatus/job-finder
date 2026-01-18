export default function JobSkeleton() {
  return (
    <div className="border border-slate-200 rounded-xl p-5 animate-pulse bg-white">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-3/4 bg-slate-200 rounded" />
          <div className="h-3 w-1/2 bg-slate-200 rounded" />
        </div>
      </div>

      {/* BODY */}
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full bg-slate-200 rounded" />
        <div className="h-3 w-5/6 bg-slate-200 rounded" />
      </div>

      {/* TAGS */}
      <div className="flex gap-2 mb-4">
        <div className="h-5 w-14 bg-slate-200 rounded-full" />
        <div className="h-5 w-16 bg-slate-200 rounded-full" />
        <div className="h-5 w-12 bg-slate-200 rounded-full" />
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center">
        <div className="h-3 w-20 bg-slate-200 rounded" />
        <div className="h-8 w-20 bg-slate-200 rounded-lg" />
      </div>
    </div>
  );
}
