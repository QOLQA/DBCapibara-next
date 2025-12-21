"use client";

import { useCallback } from "react";
import { useCanvasStore } from "@/state/canvaStore";
import { api } from "@/lib/api";
import type { Query } from "@/app/models/[diagramId]/canva/types";

/**
 * Hook para manejar operaciones CRUD de queries con optimistic updates
 * Actualiza primero el estado local (para UI fluida) y luego sincroniza con el backend
 */
export const useQueryOperations = () => {
	const {
		addQuery: addQueryToStore,
		editQuery: editQueryInStore,
		removeQuery: removeQueryFromStore,
		id: solutionId,
	} = useCanvasStore();

	/**
	 * Crear nueva query
	 * 1. Actualiza estado local inmediatamente
	 * 2. Envía petición al backend
	 * 3. Actualiza con el ID real del backend si tiene éxito
	 * 4. Revierte si falla
	 */
	const createQuery = useCallback(
		async (queryData: Omit<Query, "_id">, tempId: string) => {
			// Optimistic update - agregar inmediatamente al store
			const optimisticQuery: Query = {
				_id: tempId,
				...queryData,
			};
			addQueryToStore(optimisticQuery);

			try {
				// Sincronizar con backend
				const createData: Omit<Query, "_id"> & { solution_id: string } = {
					...queryData,
					solution_id: solutionId,
				};

				const createdQuery = await api.post<Query>("/queries", createData);

				// Actualizar con el ID real del backend
				editQueryInStore(tempId, createdQuery);

				console.log("✅ Query created successfully");
				return createdQuery;
			} catch (error) {
				// Revertir el optimistic update si falla
				removeQueryFromStore(tempId);
				console.error("❌ Failed to create query:", error);
				throw error;
			}
		},
		[addQueryToStore, editQueryInStore, removeQueryFromStore, solutionId]
	);

	/**
	 * Actualizar query existente
	 * 1. Guarda el estado anterior
	 * 2. Actualiza estado local inmediatamente
	 * 3. Envía petición al backend
	 * 4. Revierte si falla
	 */
	const updateQuery = useCallback(
		async (queryId: string, updates: Partial<Omit<Query, "_id">>) => {
			// Obtener query actual para rollback si falla
			const { queries } = useCanvasStore.getState();
			const originalQuery = queries.find((q) => q._id === queryId);

			if (!originalQuery) {
				console.error("❌ Query not found");
				return;
			}

			// Optimistic update - actualizar inmediatamente en el store
			const updatedQuery: Query = {
				...originalQuery,
				...updates,
			};
			editQueryInStore(queryId, updatedQuery);

			try {
				// Sincronizar con backend
				const backendQuery = await api.patch<Query>(
					`/queries/${queryId}`,
					updates
				);

				// Actualizar con datos del backend por si hay diferencias
				editQueryInStore(queryId, backendQuery);

				console.log("✅ Query updated successfully");
				return backendQuery;
			} catch (error) {
				// Revertir al estado original si falla
				editQueryInStore(queryId, originalQuery);
				console.error("❌ Failed to update query:", error);
				throw error;
			}
		},
		[editQueryInStore]
	);

	/**
	 * Eliminar query
	 * 1. Guarda el estado para rollback
	 * 2. Elimina del estado local inmediatamente
	 * 3. Envía petición al backend
	 * 4. Restaura si falla
	 */
	const deleteQuery = useCallback(
		async (queryId: string) => {
			// Obtener query para rollback si falla
			const { queries } = useCanvasStore.getState();
			const queryToDelete = queries.find((q) => q._id === queryId);

			if (!queryToDelete) {
				console.error("❌ Query not found");
				return;
			}

			// Optimistic update - eliminar inmediatamente del store
			removeQueryFromStore(queryId);

			try {
				// Sincronizar con backend
				await api.delete(`/queries/${queryId}`);

				console.log("✅ Query deleted successfully");
			} catch (error) {
				// Revertir - restaurar la query si falla
				addQueryToStore(queryToDelete);
				console.error("❌ Failed to delete query:", error);
				throw error;
			}
		},
		[removeQueryFromStore, addQueryToStore]
	);

	/**
	 * Sincronizar queries desde el backend
	 * Útil para refrescar después de operaciones batch o al cargar
	 */
	const syncQueries = useCallback(async () => {
		try {
			const queries = await api.get<Query[]>(
				`/queries/solution/${solutionId}`
			);
			useCanvasStore.getState().setQueries(queries);
			return queries;
		} catch (error) {
			console.error("❌ Failed to sync queries:", error);
			throw error;
		}
	}, [solutionId]);

	return {
		createQuery,
		updateQuery,
		deleteQuery,
		syncQueries,
	};
};
