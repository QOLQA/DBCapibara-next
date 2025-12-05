import { Save } from "@/components/icons/HeaderIcons";
import { transformVersionToBackend } from "@/lib/canvaConversion";
import { saveCanvas, saveSolution } from "@/lib/saveCanvas";
import { useCanvasStore } from "@/state/canvaStore";
import { getNodesBounds, getViewportForBounds } from "@xyflow/react";
import { toJpeg } from "html-to-image";
import { uploadImage } from "@/lib/imageService";

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
		const versionActual = versions.filter(
			(version) => version._id === versionId,
		);
		const diagram = transformVersionToBackend(
			versionActual[0],
			nodes,
			edges,
		);

		const secureUrl = await generateImage();
		saveSolution(Id, queries, secureUrl);
		saveCanvas(Id, versionId, diagram);

	};

	const generateImage = async () => {
		const nodesBounds = getNodesBounds(nodes)
		const viewport = getViewportForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2, 0)

		const pngString = await toJpeg(document.querySelector('.react-flow__viewport') as HTMLElement, {
			backgroundColor: '#171717',
			width: imageWidth,
			height: imageHeight,
			style: {
				width: `${imageWidth}px`,
				height: `${imageHeight}px`,
				transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
				aspectRatio: `${imageWidth} / ${imageHeight}`,
			},
			skipFonts: true
		})

		const imageUrl = await uploadImage(pngString, Id);
		return imageUrl;
	}

	return (
		<button type="button" className="group cursor-pointer" onClick={handleSave}>
			<Save className="text-lighter-gray cursor-pointer group-hover:text-white group-hover:ease-in-out group-hover:duration-300" />
		</button>
	);
};
