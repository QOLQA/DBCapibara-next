import { useCallback, useState } from "react";

export type AttributeModalType = "create" | "update";

export interface TableAttribute {
	id: string;
	name: string;
	type: string;
	ableToEdit: boolean;
}

export const useAttributeModal = () => {
	const [isAtributesModalOpen, setIsAtributesModalOpen] = useState(false);
	const [typeAtributesModal, setTypeAtributesModal] =
		useState<AttributeModalType>("create");
	const [atributesToUpdate, setAtributesToUpdate] = useState<TableAttribute[]>(
		[]
	);
	const [attributeTargetTableId, setAttributeTargetTableId] = useState<
		string | null
	>(null);

	const openCreateAttributesModal = useCallback((tableId: string) => {
		setAttributeTargetTableId(tableId);
		setTypeAtributesModal("create");
		setAtributesToUpdate([]);
		setIsAtributesModalOpen(true);
	}, []);

	const openUpdateAttributesModal = useCallback(
		(tableId: string, attributes: TableAttribute[]) => {
			setAttributeTargetTableId(tableId);
			setTypeAtributesModal("update");
			setAtributesToUpdate(attributes);
			setIsAtributesModalOpen(true);
		},
		[]
	);

	const closeAttributesModal = useCallback(() => {
		setIsAtributesModalOpen(false);
	}, []);

	return {
		isAtributesModalOpen,
		typeAtributesModal,
		atributesToUpdate,
		attributeTargetTableId,
		openCreateAttributesModal,
		openUpdateAttributesModal,
		closeAttributesModal,
	};
};
