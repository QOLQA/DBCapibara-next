import { useSolutionStore } from "@fsd/entities/solution";
import { duplicateVersion, saveCanvas } from "../../lib";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "@fsd/shared/i18n/use-translation";

const DuplicateIcon = ({ className }: { className?: string }) => {
	return (
		<svg
			width="28"
			height="28"
			viewBox="0 0 28 28"
			fill="currentColor"
			className={className}
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Duplicate Icon</title>
			<path
				d="M7 3.5C5.067 3.5 3.5 5.067 3.5 7V18.375C3.5 20.308 5.067 21.875 7 21.875H10.5V24.5C10.5 26.433 12.067 28 14 28H21C22.933 28 24.5 26.433 24.5 24.5V13.125C24.5 11.192 22.933 9.625 21 9.625H17.5V7C17.5 5.067 15.933 3.5 14 3.5H7ZM7 5.25H14C14.6213 5.25 15.125 5.75368 15.125 6.375V9.625H14C12.067 9.625 10.5 11.192 10.5 13.125V14.875H7C6.37868 14.875 5.875 14.3713 5.875 13.75V7C5.875 6.37868 6.37868 5.875 7 5.875V5.25ZM12.25 13.125H21C21.6213 13.125 22.125 13.6287 22.125 14.25V24.5C22.125 25.1213 21.6213 25.625 21 25.625H14C13.3787 25.625 12.875 25.1213 12.875 24.5V14.25C12.875 13.6287 13.3787 13.125 14 13.125H12.25Z"
				fill="currentColor"
			/>
		</svg>
	);
};

export const ButtonDuplicateVersion = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const Id = useSolutionStore((state) => state.id);
	const versionId = useSolutionStore((state) => state.selectedVersionId);
	const versions = useSolutionStore((state) => state.versions);

	const handleDuplicate = async () => {
		if (!Id || !versionId) {
			toast.error(
				t("toasts.errorDuplicatingVersion") || "Error: No version selected"
			);
			return;
		}

		try {
			try {
				await saveCanvas(Id, versionId, undefined, false);
			} catch (error) {
				console.error("Error saving before duplicating:", error);
			}

			const newVersion = await duplicateVersion(Id, versionId);

			useSolutionStore.getState().setSelectedVersionId(newVersion._id);

			router.refresh();

			toast.success(
				t("toasts.versionDuplicated") || "Version duplicated successfully"
			);
		} catch (error) {
			console.error("Error duplicating version:", error);
			toast.error(
				t("toasts.errorDuplicatingVersion") || "Error duplicating version"
			);
		}
	};

	return (
		<button
			type="button"
			className="group cursor-pointer"
			onClick={handleDuplicate}
			title={t("header.duplicateVersion") || "Duplicate version"}
		>
			<DuplicateIcon className="text-lighter-gray cursor-pointer group-hover:text-white group-hover:ease-in-out group-hover:duration-300" />
		</button>
	);
};
