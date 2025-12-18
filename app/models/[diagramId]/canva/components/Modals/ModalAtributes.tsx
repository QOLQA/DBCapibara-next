"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
	Select,
	SelectValue,
	SelectItem,
	SelectGroup,
	SelectContent,
	SelectLabel,
	SelectTrigger,
} from "@/components/ui/select";
import { Trash } from "lucide-react";
import React, { useEffect, useCallback, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";

interface TableAttribute {
	id: string;
	name: string;
	type: string;
	ableToEdit: boolean;
}

interface ModalAtributesProps {
	onSubmit: (
		newAtributes: TableAttribute[],
		typeModal: "create" | "update"
	) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
	type?: "create" | "update";
	atributesToUpdate?: TableAttribute[];
}

const types = [
	{ value: "string", label: "string" },
	{ value: "integer", label: "integer" },
	{ value: "double", label: "double" },
	{ value: "boolean", label: "boolean" },
	{ value: "date", label: "date" },
	{ value: "array", label: "array[]" },
];

const ModalAtributes: React.FC<ModalAtributesProps> = React.memo(
	({ onSubmit, open, setOpen, type = "create", atributesToUpdate }) => {
		const { register, control, handleSubmit, reset, watch, setValue } =
			useForm<{
				attributes: TableAttribute[];
			}>({
				defaultValues: {
					attributes:
						type === "update" && atributesToUpdate
							? atributesToUpdate
							: [{ id: "", name: "", type: types[0].value, ableToEdit: true }],
				},
			});

		const { fields, append, remove } = useFieldArray({
			control,
			name: "attributes",
		});

		// Watch the attributes to get current values
		const watchedAttributes = watch("attributes");

		const onSubmitForm = useCallback(
			(data: { attributes: TableAttribute[] }) => {
				onSubmit(data.attributes, type);
				setOpen(false);
			},
			[onSubmit, type, setOpen]
		);

		const handleAppend = useCallback(() => {
			append({
				id: "",
				name: "",
				type: types[0].value,
				ableToEdit: true,
			});
		}, [append]);

		const handleRemove = useCallback(
			(index: number) => {
				remove(index);
			},
			[remove]
		);

		const handleTypeChange = useCallback(
			(value: string, index: number) => {
				setValue(`attributes.${index}.type`, value);
			},
			[setValue]
		);

		const modalTitle = useMemo(
			() => (type === "create" ? "Agregar Atributos" : "Editar Atributos"),
			[type]
		);

		useEffect(() => {
			if (type === "update" && atributesToUpdate) {
				reset({ attributes: atributesToUpdate });
			} else if (type === "create") {
				reset({
					attributes: [
						{ id: "", name: "", type: types[0].value, ableToEdit: true },
					],
				});
			}
		}, [type, atributesToUpdate, reset]);

		return (
			<Modal
				title={modalTitle}
				onSubmit={handleSubmit(onSubmitForm)}
				open={open}
				setOpen={setOpen}
				type={type}
			>
				<div className="flex flex-col gap-2">
					{fields.map((field, index) => {
						if (field.ableToEdit) {
							return (
								<div key={field.id} className="flex items-center gap-6 mb-2">
									<Input
										placeholder="Nombre"
										{...register(`attributes.${index}.name`)}
										className="w-1/2"
									/>

									<Select
										value={watchedAttributes?.[index]?.type || types[0].value}
										onValueChange={(value) => handleTypeChange(value, index)}
									>
										<SelectTrigger className="w-1/2">
											<SelectValue placeholder="Type" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectLabel>Type</SelectLabel>
												{types.map((type) => (
													<SelectItem key={type.value} value={type.value}>
														{type.label}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>

									<button
										type="button"
										className="group cursor-pointer"
										onClick={() => handleRemove(index)}
									>
										<Trash className="text-gray-400 group-hover:text-red-500 transition-colors" />
									</button>
								</div>
							);
						}
					})}
					{type === "create" && (
						<div className="flex justify-center w-full border-dashed border-2 border-gray rounded-lg p-3">
							<Button
								type="button"
								className="cursor-pointer py-[2px] hover:bg-gray bg-transparent rounded-lg text-secondary-white border border-gray"
								onClick={handleAppend}
							>
								nuevo atributo
							</Button>
						</div>
					)}
				</div>
			</Modal>
		);
	}
);

export default ModalAtributes;
