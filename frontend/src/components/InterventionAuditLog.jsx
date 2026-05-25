function InterventionAuditLog({ events }) {
  if (events.length === 0) return null;

  const visibleEvents = [...events]
    .sort((a, b) => b.sequence - a.sequence)
    .slice(0, 8);

  return (
    <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">
          Audit log
        </p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950">
          Recent intervention activity
        </h2>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                State
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Action
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Detail
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actor
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {visibleEvents.map((event) => (
              <tr key={event.id}>
                <td className="px-4 py-4 text-sm text-slate-600">
                  {event.timestamp}
                </td>
                <td className="px-4 py-4 text-sm font-semibold text-slate-950">
                  {event.stateCode}
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">
                  {event.action}
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">
                  {event.detail}
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">
                  {event.actor}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default InterventionAuditLog;
