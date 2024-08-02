import {
	Button,
	Menu as _Menu,
	MenuItem,
	MenuTrigger,
	Popover,
} from "react-aria-components";

type OptionConfig = {
	label: string;
	action: () => void;
};

export function Menu({
	buttonName,
	options,
	buttonClassName,
}: {
	buttonName: string;
	options: Array<OptionConfig>;
	buttonClassName: string;
}) {
	return (
		<MenuTrigger>
			<Button aria-label="Menu" className={buttonClassName}>
				{buttonName}
			</Button>
			<Popover
				className="mt-2 bg-white shadow-lg rounded-md py-2"
				style={{ minWidth: "10rem" }}
			>
				<_Menu className="focus:outline-none">
					{options.map((option) => (
						<MenuItem
							key={option.label}
							onAction={() => option.action()}
							className="px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer hover:outline-none"
						>
							{option.label}
						</MenuItem>
					))}
				</_Menu>
			</Popover>
		</MenuTrigger>
	);
}
