import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NAV = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard", icon: "📊", to: "/dashboard" },
      { label: "Risk Map", icon: "🗺", to: "/risk-map" },
      {
        label: "SAR Analytics",
        icon: "📈",
        to: "/sar-analytics",
        badge: "Live",
        badgeColor: "bg-blue-50 text-blue-700",
      },
    ],
  },
  {
    section: "Compliance",
    items: [
      {
        label: "Interventions",
        icon: "🚨",
        to: "/interventions",
        badgeKey: "interventions",
        badgeColor: "bg-red-50 text-red-700",
      },
      { label: "Reports", icon: "📄", to: "/methodology" },
    ],
  },
  {
    section: "AI Tools",
    items: [{ label: "Copilot", icon: "🤖", to: "/dashboard#copilot" }],
  },
];

export default function DashboardLayout({
  children,
  interventionCount = 0,
  activeRole,
  onRoleChange,
  roleOptions = [],
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (to) => location.pathname === to.split("#")[0];

  const renderSidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-4">
        {!collapsed && (
          <div
            className="flex cursor-pointer items-center gap-3"
            onClick={() => navigate("/")}
            title="Back to home"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#185FA5] text-sm font-bold text-white">
              FG
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">FinCEN Guard</p>
              <p className="text-[11px] text-slate-500">
                Compliance Intelligence
              </p>
            </div>
          </div>
        )}
        {collapsed && (
          <div
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-[#185FA5] text-sm font-bold text-white"
            onClick={() => navigate("/")}
            title="Back to home"
          >
            FG
          </div>
        )}
        <button
          onClick={() => setCollapsed((current) => !current)}
          className="ml-auto flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-200 hover:text-slate-700"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {NAV.map(({ section, items }) => (
          <div key={section} className="px-2 py-1">
            {!collapsed && (
              <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {section}
              </p>
            )}
            {items.map(({ label, icon, to, badge, badgeKey, badgeColor }) => {
              const active = isActive(to);
              const badgeVal =
                badgeKey === "interventions" ? interventionCount : badge;

              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`mt-0.5 flex items-center gap-2 rounded-md px-2 py-2 text-sm transition ${
                    active
                      ? "border border-slate-200 bg-white font-medium text-slate-900"
                      : "text-slate-600 hover:bg-white"
                  }`}
                  title={collapsed ? label : undefined}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[13px] ${
                      active
                        ? "bg-[#185FA5] text-white"
                        : "bg-white text-slate-500"
                    }`}
                  >
                    {icon}
                  </span>
                  {!collapsed && (
                    <>
                      <span className="flex-1">{label}</span>
                      {badgeVal && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeColor}`}
                        >
                          {badgeVal}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {roleOptions.length > 0 && (
        <div className="border-t border-slate-200 p-3">
          {!collapsed ? (
            <div className="space-y-1">
              <p className="px-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                View as
              </p>
              {roleOptions.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => onRoleChange?.(role.id)}
                  className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition ${
                    activeRole === role.id
                      ? "bg-blue-50 font-semibold text-blue-700"
                      : "text-slate-600 hover:bg-white"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      activeRole === role.id ? "bg-blue-500" : "bg-slate-300"
                    }`}
                  />
                  {role.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              {roleOptions.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => onRoleChange?.(role.id)}
                  title={role.label}
                  className={`flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold transition ${
                    activeRole === role.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-slate-400 hover:bg-white"
                  }`}
                >
                  {role.label[0]}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {!collapsed && (
        <div className="border-t border-slate-200 px-4 py-3">
          <a
            href="https://github.com/christineatsiaya/fraud-compliance-dashboard"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-700"
          >
            <span>⬡</span> View on GitHub
          </a>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <button
          onClick={() => setMobileOpen((current) => !current)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600"
        >
          ☰
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#185FA5] text-xs font-bold text-white">
            FG
          </div>
          <span className="text-sm font-semibold text-slate-900">
            FinCEN Guard
          </span>
        </div>
        <div className="w-8" />
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-[220px] bg-slate-50 shadow-xl transition-transform duration-200 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {renderSidebarContent()}
      </div>

      <div className="hidden lg:flex lg:min-h-screen">
        <aside
          className={`shrink-0 border-r border-slate-200 bg-slate-50 transition-all duration-200 ${
            collapsed ? "w-[56px]" : "w-[220px]"
          }`}
        >
          <div className="sticky top-0 h-screen overflow-y-auto">
            {renderSidebarContent()}
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <div className="lg:hidden">{children}</div>
    </div>
  );
}
