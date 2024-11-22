import * as ReactAria from "react-aria-components";

import type { ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";
import FieldLabel from "./label";
import {
	type FieldPath,
	type FieldValues,
	type UseControllerProps,
	useController,
} from "react-hook-form";

// eslint-disable-next-line import/namespace
export interface BaseTextFieldProps extends ReactAria.TextFieldProps {}

interface BasicTextFieldProps extends BaseTextFieldProps {
	label?: string;
	errorMessage?: string;
	placeholder?: string;
	helpMessage?: ReactNode;
}

export const BasicTextField = forwardRef(function BasicTextField(
	{
		className,
		placeholder,
		label,
		errorMessage,
		isInvalid = false,
		isRequired = true,
		type = "text",
		...props
	}: BasicTextFieldProps,
	ref: ForwardedRef<HTMLInputElement>
) {
	return (
		<div>
			<ReactAria.TextField {...props} isRequired={isRequired}>
				{label ? (
					<FieldLabel isRequired={isRequired}>{label}</FieldLabel>
				) : null}
				<ReactAria.Input
					ref={ref}
					placeholder={placeholder}
					className={`${className} ${
						isInvalid
							? "border-red-500 focus:ring-red-500"
							: "border-gray-300 focus:ring-indigo-500"
					} appearance-none block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm`}
					type={type}
				/>
			</ReactAria.TextField>
			{errorMessage && (
				<p className="text-red-500 text-sm mt-0.5 mb-1.5">{errorMessage}</p>
			)}
		</div>
	);
});

interface TextFieldProps<T extends FieldValues, U extends FieldPath<T>>
	extends Omit<BasicTextFieldProps, "defaultValue">,
		UseControllerProps<T, U> {
	name: UseControllerProps<T, U>["name"];
	control: UseControllerProps<T, U>["control"];
	type: React.HTMLInputTypeAttribute;
}

export function TextField<
	FormValues extends FieldValues,
	Name extends FieldPath<FormValues>
>({ name, control, type, ...props }: TextFieldProps<FormValues, Name>) {
	const { field, fieldState } = useController({ name, control });

	return (
		<BasicTextField
			{...props}
			ref={field.ref}
			name={field.name}
			onChange={(value) => field.onChange(value)}
			value={field.value}
			onBlur={field.onBlur}
			validationBehavior="aria"
			isInvalid={fieldState.invalid}
			errorMessage={fieldState?.error?.message}
			type={type}
		/>
	);
}
