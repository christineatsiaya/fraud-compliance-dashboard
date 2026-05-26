import toast from "react-hot-toast";
import {
  buildExecutiveReport,
  buildExecutiveReportHtml,
  buildReportFilename,
} from "../utils/reporting";

function ReportExportButton({ states, activeRole, filters }) {
  const handleExportReport = () => {
    const report = buildExecutiveReport({ states, activeRole, filters });
    const html = buildExecutiveReportHtml(report);
    const blob = new Blob([html], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = buildReportFilename();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success("Executive report exported");
  };

  return (
    <button
      type="button"
      onClick={handleExportReport}
      className="flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-700"
    >
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 17v-6h6v6m-8 4h10a2 2 0 002-2V9.5a2 2 0 00-.586-1.414l-4.5-4.5A2 2 0 0012.5 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
      Export Report
    </button>
  );
}

export default ReportExportButton;
