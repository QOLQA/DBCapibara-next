"use client";

import { useCallback, useEffect, useState } from "react";
import type { MetricChartRow } from "./types";

export function useSchemaMetricsSelection(
	metricsChartData: MetricChartRow[],
	onSelectionChange?: (selectedSchemas: string[]) => void,
) {
	const [selectedSchemas, setSelectedSchemas] = useState<Set<string>>(() => {
		return new Set(metricsChartData.map((metric) => metric.schema));
	});

	useEffect(() => {
		const currentSchemas = new Set(
			metricsChartData.map((metric) => metric.schema),
		);
		if (metricsChartData.length === 0) {
			setSelectedSchemas(new Set());
			return;
		}
		setSelectedSchemas((prev) => {
			const updated = new Set(prev);
			currentSchemas.forEach((schema) => updated.add(schema));
			Array.from(updated).forEach((schema) => {
				if (!currentSchemas.has(schema)) {
					updated.delete(schema);
				}
			});
			return updated;
		});
	}, [metricsChartData]);

	useEffect(() => {
		onSelectionChange?.(Array.from(selectedSchemas));
	}, [selectedSchemas, onSelectionChange]);

	const allSelected =
		metricsChartData.length > 0 &&
		selectedSchemas.size === metricsChartData.length &&
		metricsChartData.every((metric) => selectedSchemas.has(metric.schema));

	const handleSelectAll = useCallback(
		(checked: boolean) => {
			if (checked) {
				setSelectedSchemas(
					new Set(metricsChartData.map((metric) => metric.schema)),
				);
			} else {
				setSelectedSchemas(new Set());
			}
		},
		[metricsChartData],
	);

	const handleToggleSchema = useCallback((schema: string) => {
		setSelectedSchemas((prev) => {
			const next = new Set(prev);
			if (next.has(schema)) {
				next.delete(schema);
			} else {
				next.add(schema);
			}
			return next;
		});
	}, []);

	return {
		selectedSchemas,
		allSelected,
		handleSelectAll,
		handleToggleSchema,
	};
}
