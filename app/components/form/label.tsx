import * as ReactAria from "react-aria-components";

interface FieldLabelProps extends ReactAria.LabelProps {
	isRequired?: boolean;
}

export default function FieldLabel({
	isRequired,
	children,
	...props
}: FieldLabelProps) {
	return (
		<ReactAria.Label {...props} className="cursor-default">
			{children}
			{isRequired ? <span className="text-error ml-[0.0625rem]">*</span> : null}
		</ReactAria.Label>
	);
}
