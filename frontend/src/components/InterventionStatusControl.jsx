import { getStatusLabel, workflowStatuses } from "../utils/operations";

function InterventionStatusControl({ status, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">
        Workflow Status:
      </label>
      <select
        value={status}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {workflowStatuses.map((workflowStatus) => (
          <option key={workflowStatus} value={workflowStatus}>
            {getStatusLabel(workflowStatus)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default InterventionStatusControl;
