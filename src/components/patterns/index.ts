// Pattern barrel export - importing these files registers them automatically
import "./metric-card";
import "./info-card";
import "./action-confirm";
import "./status-tracker";
import "./comparison-table";
import "./form-wizard";

// Re-export for direct imports if needed
export { MetricCard, metricCardSchema } from "./metric-card";
export { InfoCard, infoCardSchema } from "./info-card";
export { ActionConfirm, actionConfirmSchema } from "./action-confirm";
export { StatusTracker, statusTrackerSchema } from "./status-tracker";
export { ComparisonTable, comparisonTableSchema } from "./comparison-table";
export { FormWizard, formWizardSchema } from "./form-wizard";
