import { Save } from "@/components/icons/HeaderIcons";
import { transformVersionToBackend } from "@/lib/canvaConversion";
import { saveCanvas, saveSolution } from "@/lib/saveCanvas";
import { useCanvasStore } from "@/state/canvaStore";
import { getNodesBounds, getViewportForBounds } from "@xyflow/react";
import { toPng } from "html-to-image";
import { uploadImage } from "@/lib/imageService";
import { toast } from "sonner";

const imageWidth = 1024;
const imageHeight = 768;

export const ButtonSave = () => {
	const Id = useCanvasStore((state) => state.id);
	const versionId = useCanvasStore((state) => state.selectedVersionId);
	const versions = useCanvasStore((state) => state.versions);
	const nodes = useCanvasStore((state) => state.nodes);
	const edges = useCanvasStore((state) => state.edges);
	const queries = useCanvasStore((state) => state.queries);

	const handleSave = async () => {
		try {
			const versionActual = versions.filter(
				(version) => version._id === versionId
			);
			const diagram = transformVersionToBackend(versionActual[0], nodes, edges);

			let secureUrl: string;
			try {
				secureUrl = await generateImage();
			} catch (imageError) {
				console.error("Error generating image:", imageError);
				// Si falla la subida de imagen, usar una URL placeholder o la existente
				secureUrl = ""; // O podrías usar la URL existente del modelo
			}

			// Guardar solución y canvas en paralelo
			await Promise.all([
				secureUrl ? saveSolution(Id, queries, secureUrl) : Promise.resolve(),
				saveCanvas(Id, versionId, diagram),
			]);

			toast.success("Canvas saved successfully");
		} catch (error) {
			console.error("Error saving:", error);
			toast.error("Error saving canvas");
		}
	};

	const generateImage = async () => {
		const nodesBounds = getNodesBounds(nodes);

		// Agregar padding alrededor de los nodos para que no choquen con los bordes
		// El padding es un porcentaje del tamaño de la imagen (15% en cada lado)
		const paddingX = imageWidth * 0.15; // 15% de padding horizontal
		const paddingY = imageHeight * 0.15; // 15% de padding vertical

		// Expandir los bounds con el padding
		const paddedBounds = {
			x: nodesBounds.x - paddingX,
			y: nodesBounds.y - paddingY,
			width: nodesBounds.width + paddingX * 2,
			height: nodesBounds.height + paddingY * 2,
		};

		const viewport = getViewportForBounds(
			paddedBounds,
			imageWidth,
			imageHeight,
			0.8,
			1.2,
			200
		);

		const pngString = await toPng(
			document.querySelector(".react-flow__viewport") as HTMLElement,
			{
				// backgroundColor: "#171717",
				width: imageWidth,
				height: imageHeight,
				pixelRatio: 3,
				style: {
					width: `${imageWidth}px`,
					height: `${imageHeight}px`,
					transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
					aspectRatio: `${imageWidth} / ${imageHeight}`,
				},
				skipFonts: true,
			}
		);

		const imageUrl = await uploadImage(pngString, Id);
		return imageUrl;
	};

	return (
		<button type="button" className="group cursor-pointer" onClick={handleSave}>
			<Save className="text-lighter-gray cursor-pointer group-hover:text-white group-hover:ease-in-out group-hover:duration-300" />
		</button>
	);
};
