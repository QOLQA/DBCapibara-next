"use client";

import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@fsd/shared/ui/button";
import {
	useDatabaseDiagram,
	edgeTypes,
	ModalAddCollection,
} from "@fsd/features/modeling-solution";
import { nodeTypes } from "./TableNode";

const DatabaseDiagram = () => {
	const {
		t,
		isChangingVersion,
		isAddCollectionModalOpen,
		setAddCollectionModalOpen,
		openAddCollectionModal,
		handleAddCollection,
		reactFlowProps,
	} = useDatabaseDiagram();

	return (
		<div className="w-full h-full relative pb-[16px] pl-[5px] pr-[16px] pt-[2px] bg-secondary-gray">
			{isChangingVersion && (
				<div className="absolute inset-0 bg-terciary-gray/80 backdrop-blur-sm z-9999 flex items-center justify-center rounded-xl">
					<div className="flex flex-col items-center gap-4">
						<div className="w-12 h-12 border-4 border-blue border-t-transparent rounded-full animate-spin" />
						<p className="text-white text-lg font-medium">
							{t("databaseDiagram.changingVersion")}
						</p>
					</div>
				</div>
			)}

			<Button
				type="button"
				onClick={openAddCollectionModal}
				className="absolute top-5 right-10 bg-green text-white hover:bg-green-dark z-10 cursor-pointer"
			>
				<span className="text-xl">+</span> {t("databaseDiagram.newCollection")}
			</Button>

			<ModalAddCollection
				open={isAddCollectionModalOpen}
				setOpen={setAddCollectionModalOpen}
				onSubmit={handleAddCollection}
			/>

			<ReactFlow
				{...reactFlowProps}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
			>
				<Background className="!bg-terciary-gray rounded-xl" />
				<Controls className="text-white controls-with-buttons " />
				<MiniMap nodeClassName="!fill-gray" className="!bg-secondary-gray" />
			</ReactFlow>
		</div>
	);
};

export default DatabaseDiagram;
export { DatabaseDiagram as DataBaseDiagram };
