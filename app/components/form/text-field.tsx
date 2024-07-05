import * as ReactAria from "react-aria-components";
import { cx } from "~/utils/cva.config";
import type { ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";
import FieldLabel from "./label";
import {
	type FieldPath,
	type FieldValues,
	type UseControllerProps,
	useController,
} from "react-hook-form";

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
		isRequired = true,
		type = "text",
		...props
	}: BasicTextFieldProps,
	ref: ForwardedRef<HTMLInputElement>
) {
	return (
		<ReactAria.TextField {...props} isRequired={isRequired}>
			{label ? <FieldLabel isRequired={isRequired}>{label}</FieldLabel> : null}
			<ReactAria.Input
				ref={ref}
				placeholder={placeholder}
				className={className}
				type={type}
			/>
		</ReactAria.TextField>
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
