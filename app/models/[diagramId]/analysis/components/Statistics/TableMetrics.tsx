"use client";

import { useState, useEffect } from "react";

interface MetricData {
	schema: string;
	redundancy: number;
	recovery_cost: number;
	access_pattern: number;
}

interface CompletudeData {
	schema: string;
	completude: number;
}

interface TableMetricsProps {
	metricsChartData: MetricData[];
	completudeChartData: CompletudeData[];
	onSelectionChange?: (selectedSchemas: string[]) => void;
}

export function TableMetrics({
	metricsChartData,
	completudeChartData,
	onSelectionChange,
}: TableMetricsProps) {
	// Inicializar todos los schemas como seleccionados
	const [selectedSchemas, setSelectedSchemas] = useState<Set<string>>(() => {
		return new Set(metricsChartData.map((metric) => metric.schema));
	});

	// Checkbox principal (select all)
	const allSelected =
		metricsChartData.length > 0 &&
		selectedSchemas.size === metricsChartData.length &&
		metricsChartData.every((metric) => selectedSchemas.has(metric.schema));

	// Actualizar selección cuando se agregan nuevos schemas (mantener los ya seleccionados)
	useEffect(() => {
		const currentSchemas = new Set(
			metricsChartData.map((metric) => metric.schema)
		);
		// Si no hay datos, inicializar vacío
		if (metricsChartData.length === 0) {
			setSelectedSchemas(new Set());
			return;
		}
		// Agregar nuevos schemas a la selección (mantener los ya seleccionados)
		setSelectedSchemas((prev) => {
			const updated = new Set(prev);
			currentSchemas.forEach((schema) => updated.add(schema));
			// Remover schemas que ya no existen en los datos
			Array.from(updated).forEach((schema) => {
				if (!currentSchemas.has(schema)) {
					updated.delete(schema);
				}
			});
			return updated;
		});
	}, [metricsChartData]);

	// Notificar cambios al padre
	useEffect(() => {
		if (onSelectionChange) {
			onSelectionChange(Array.from(selectedSchemas));
		}
	}, [selectedSchemas, onSelectionChange]);

	const handleSelectAll = (checked: boolean) => {
		if (checked) {
			const allSchemas = new Set(
				metricsChartData.map((metric) => metric.schema)
			);
			setSelectedSchemas(allSchemas);
		} else {
			setSelectedSchemas(new Set());
		}
	};

	const handleToggleSchema = (schema: string) => {
		const newSelection = new Set(selectedSchemas);
		if (newSelection.has(schema)) {
			newSelection.delete(schema);
		} else {
			newSelection.add(schema);
		}
		setSelectedSchemas(newSelection);
	};

	return (
		<div className="flex flex-col w-[70%] h-auto border border-gray rounded-2xl p-6 gap-6 my-16">
			{/* Rotulo */}
			<div className="w-full flex flex-row items-center">
				<div
					className="w-[10%] flex justify-center items-center text-white cursor-pointer"
					onClick={() => handleSelectAll(!allSelected)}
				>
					<div
						className={`size-5 border rounded-md transition-colors ${
							allSelected
								? "border-white bg-white"
								: "border-white bg-transparent"
						}`}
					>
						{allSelected && (
							<svg
								className="w-full h-full text-gray"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={3}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						)}
					</div>
				</div>
				<div className="w-[30%] flex justify-start items-center">
					<h3 className="text-[20px] font-bold ">Solution name</h3>
				</div>
				{/* Metricas */}
				<div className="w-[15%] flex justify-center items-center">
					<h3 className="text-[20px] font-bold ">Access Pattern</h3>
				</div>
				<div className="w-[15%] flex justify-center items-center">
					<h3 className="text-[20px] font-bold">Recovery Cost</h3>
				</div>
				<div className="w-[15%] flex justify-center items-center">
					<h3 className="text-[20px] font-bold ">Redundancy</h3>
				</div>
				<div className="w-[15%] flex justify-center items-center">
					<h3 className="text-[20px] font-bold">Completude</h3>
				</div>
			</div>
			{/* --- */}
			<div className="w-full h-[2px] bg-gray"></div>
			{/* data */}
			{metricsChartData.map((metric) => {
				const isSelected = selectedSchemas.has(metric.schema);
				return (
					<div
						key={metric.schema}
						className="w-full flex flex-row items-center "
					>
						<div
							className="w-[10%] flex justify-center items-center cursor-pointer"
							onClick={() => handleToggleSchema(metric.schema)}
						>
							<div
								className={`size-5 border rounded-md transition-colors ${
									isSelected
										? "border-secondary-white bg-secondary-white"
										: "border-secondary-white bg-transparent"
								}`}
							>
								{isSelected && (
									<svg
										className="w-full h-full text-gray"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={3}
											d="M5 13l4 4L19 7"
										/>
									</svg>
								)}
							</div>
						</div>
						<div className="w-[30%] flex justify-start items-center">
							<h3 className="text-[20px] font-bold text-secondary-white">
								{metric.schema}
							</h3>
						</div>
						<div className="w-[15%] flex justify-center items-center">
							<div className="w-[90px] h-[32px] flex justify-center items-center bg-[#0052CC]/10 rounded-lg">
								<h3 className="text-[20px] font-bold text-[#0052CC]">
									{metric.access_pattern}
								</h3>
							</div>
						</div>
						<div className="w-[15%] flex justify-center items-center">
							<div className="w-[90px] h-[32px] flex justify-center items-center bg-[#00875A]/10 rounded-lg">
								<h3 className="text-[20px] font-bold text-[#00875A]">
									{metric.recovery_cost}
								</h3>
							</div>
						</div>
						<div className="w-[15%] flex justify-center items-center">
							<div className="w-[90px] h-[32px] flex justify-center items-center bg-[#5243AA]/10 rounded-lg">
								<h3 className="text-[20px] font-bold text-[#5243AA]">
									{metric.redundancy}
								</h3>
							</div>
						</div>
						<div className="w-[15%] flex justify-center items-center">
							<div className="w-[90px] h-[32px] flex justify-center items-center bg-[#E93544]/10 rounded-lg">
								<h3 className="text-[20px] font-bold text-[#E93544]">
									{
										completudeChartData.find(
											(completude) => completude.schema === metric.schema
										)?.completude
									}
								</h3>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
