import { useMemo } from 'react';

const PRIORITY_WEIGHT = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

export function useFilteredReports(
  reports,
  { search = '', category = 'All', priority = 'All', status = 'All', syncStatus = 'All', sortBy = 'newest' }
) {
  return useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = reports.filter((r) => {
      if (category !== 'All' && r.category !== category) return false;
      if (priority !== 'All' && r.priority !== priority) return false;
      if (status !== 'All' && r.status !== status) return false;
      if (syncStatus !== 'All' && r.syncStatus !== syncStatus) return false;

      if (query) {
        const matches =
          r.title?.toLowerCase().includes(query) ||
          r.description?.toLowerCase().includes(query) ||
          r.category?.toLowerCase().includes(query) ||
          r.location?.name?.toLowerCase().includes(query) ||
          r.clientId?.toLowerCase().includes(query) ||
          (r.serverId && r.serverId.toLowerCase().includes(query));
        if (!matches) return false;
      }

      return true;
    });

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime();
      }
      if (sortBy === 'priority') {
        const diff = (PRIORITY_WEIGHT[b.priority] || 0) - (PRIORITY_WEIGHT[a.priority] || 0);
        if (diff !== 0) return diff;
      }
      if (sortBy === 'updated') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
    });

    return sorted;
  }, [reports, search, category, priority, status, syncStatus, sortBy]);
}
