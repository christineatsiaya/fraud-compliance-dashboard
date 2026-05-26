import { getRoleView, roleViewOptions } from "../utils/roleViews";

function RoleViewSwitcher({ activeRole, onRoleChange }) {
  const activeRoleView = getRoleView(activeRole);

  return (
    <section className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">
            Role-based dashboard
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">
            {activeRoleView.label}
          </h2>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          {activeRoleView.summary}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {roleViewOptions.map((roleView) => {
          const isActive = roleView.id === activeRoleView.id;

          return (
            <button
              key={roleView.id}
              type="button"
              onClick={() => onRoleChange(roleView.id)}
              className={`rounded-lg border p-4 text-left transition ${
                isActive
                  ? "border-blue-500 bg-blue-50 shadow-sm"
                  : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-white"
              }`}
            >
              <span
                className={`text-sm font-semibold ${
                  isActive ? "text-blue-800" : "text-slate-950"
                }`}
              >
                {roleView.shortLabel}
              </span>
              <span className="mt-2 block text-sm leading-6 text-slate-600">
                {roleView.summary}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default RoleViewSwitcher;
