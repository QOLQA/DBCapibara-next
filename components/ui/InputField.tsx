interface InputFieldProps {
	label: string;
	name: string;
	value?: string | number;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	type?: string;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	min?: string;
	max?: string;
	step?: string;
	className?: string;
	defaultValue?: string | number;
}

export default function InputField({
	label,
	name,
	value,
	onChange,
	type = 'text',
	placeholder,
	required = false,
	disabled = false,
	min,
	max,
	step,
	className = '',
	defaultValue
}: InputFieldProps) {
	return (
		<div className={`flex flex-col gap-2 ${className}`}>
			<label className="text-foreground text-sm font-medium">
				{label} {required && <span className="text-red-500">*</span>}
			</label>
			<input
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				defaultValue={defaultValue}
				required={required}
				disabled={disabled}
				placeholder={placeholder}
				min={min}
				max={max}
				step={step}
				className={`form-input flex w-full resize-none overflow-hidden rounded-xl text-foreground focus:outline-0 focus:ring-0 border border-surface-secondary bg-surface focus:border-surface-tertiary h-14 placeholder:text-text-secondary p-[15px] text-base font-normal leading-normal ${disabled ? 'opacity-50 cursor-not-allowed bg-surface-secondary' : ''}`}
			/>
		</div>
	);
}
