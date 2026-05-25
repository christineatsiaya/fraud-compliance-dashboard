function OperationalAlertCenter({ alerts }) {
  if (alerts.length === 0) return null;

  return (
    <section className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">
          Operational alert center
        </p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950">
          Intervention workflow signals
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {alerts.map((alert) => (
          <article
            key={alert.title}
            className="rounded-lg border border-slate-200 bg-slate-50 p-4"
          >
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                alert.severity === "critical"
                  ? "bg-red-100 text-red-800"
                  : alert.severity === "warning"
                    ? "bg-yellow-100 text-yellow-800"
                    : alert.severity === "stable"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
              }`}
            >
              {alert.severity}
            </span>
            <h3 className="mt-3 text-base font-semibold text-slate-950">
              {alert.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {alert.detail}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default OperationalAlertCenter;
