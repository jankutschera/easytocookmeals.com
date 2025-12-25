interface AdminStatsProps {
  stats: {
    total: number;
    published: number;
    drafts: number;
    archived: number;
  };
}

export function AdminStats({ stats }: AdminStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
        <div className="text-sm text-gray-500 mt-1">Total Recipes</div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-green-200">
        <div className="text-3xl font-bold text-green-600">{stats.published}</div>
        <div className="text-sm text-gray-500 mt-1">Published</div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-yellow-200">
        <div className="text-3xl font-bold text-yellow-600">{stats.drafts}</div>
        <div className="text-sm text-gray-500 mt-1">Drafts</div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="text-3xl font-bold text-gray-400">{stats.archived}</div>
        <div className="text-sm text-gray-500 mt-1">Archived</div>
      </div>
    </div>
  );
}
