import { useCallback, useState } from "react";

export const useDocumentModal = () => {
	const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
	const [documentTargetTableId, setDocumentTargetTableId] = useState<
		string | null
	>(null);

	const openDocumentModal = useCallback((tableId: string) => {
		setDocumentTargetTableId(tableId);
		setIsDocumentModalOpen(true);
	}, []);

	const closeDocumentModal = useCallback(() => {
		setIsDocumentModalOpen(false);
	}, []);

	return {
		isDocumentModalOpen,
		documentTargetTableId,
		openDocumentModal,
		closeDocumentModal,
	};
};
