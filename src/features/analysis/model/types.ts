export interface MetricChartRow {
	schema: string;
	redundancy: number;
	recovery_cost: number;
	access_pattern: number;
	submodels?: MetricChartRow[];
	submodelIndex?: number;
}

export interface CompletudeChartRow {
	schema: string;
	completude: number;
	submodels?: CompletudeChartRow[];
	submodelIndex?: number;
}
