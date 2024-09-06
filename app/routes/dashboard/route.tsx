import { Link, useNavigate } from "react-router-dom";

import { Menu } from "~/components/ui/menu";
import { LoaderFunction, redirect } from "@remix-run/node";
import { getSession } from "~/utils/session.server";
import { useLoaderData, json, Outlet } from "@remix-run/react";
import { useState } from "react";

export type Payment = {
	id: number;
	amount: number;
	date: string;
	status: "paid" | "pending";
};

const payments: Array<Payment> = [
	{
		id: 1,
		amount: 200,
		date: "2024-07-30",
		status: "paid",
	},
	{
		id: 2,
		amount: 150,
		date: "2024-08-15",
		status: "pending",
	},
	{
		id: 3,
		amount: 180,
		date: "2024-09-10",
		status: "pending",
	},
	{
		id: 4,
		amount: 220,
		date: "2024-09-15",
		status: "pending",
	},
	{
		id: 5,
		amount: 210,
		date: "2024-04-18",
		status: "paid",
	},
	{
		id: 6,
		amount: 195,
		date: "2024-03-15",
		status: "paid",
	},
	{
		id: 7,
		amount: 230,
		date: "2024-09-20",
		status: "pending",
	},
	{
		id: 8,
		amount: 175,
		date: "2024-09-25",
		status: "pending",
	},
];

export const loader: LoaderFunction = async ({ request }) => {
	const session = await getSession(request.headers.get("Cookie"));
	const user = session.get("user");

	if (!user) {
		return redirect("/login");
	}

	return json({
		user,
		payments,
	});
};

export default function Dashboard() {
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>("");

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<div className="flex flex-1">
				<Sidebar
					startDate={startDate}
					setStartDate={setStartDate}
					endDate={endDate}
					setEndDate={setEndDate}
				/>
				<Outlet />
			</div>
		</div>
	);
}

function Navbar() {
	const { user } = useLoaderData();

	const navigate = useNavigate();
	const menuOptions = [
		{
			label: "Mi cuenta",
			action: () => navigate("/account"),
		},
		{
			label: "Cerrar sesión",
			action: () => {
				fetch("/logout", {
					method: "POST",
				}).then(() => {
					navigate("/login");
				});
			},
		},
	];

	return (
		<nav className="bg-indigo-600 p-4 text-white flex justify-between items-center">
			<Link to="/dashboard" className="text-lg font-semibold">
				Dashboard
			</Link>
			<Menu
				buttonName={user?.name}
				options={menuOptions}
				buttonClassName="focus:outline-none"
			/>
		</nav>
	);
}

interface SidebarProps {
	startDate: string;
	setStartDate: (date: string) => void;
	endDate: string;
	setEndDate: (date: string) => void;
}

function Sidebar({
	startDate,
	setStartDate,
	endDate,
	setEndDate,
}: SidebarProps) {
	const clearFilters = () => {
		setStartDate("");
		setEndDate("");
	};

	return (
		<div className="flex w-64 bg-gray-100 p-6 border-r border-gray-200 flex-col">
			<h2 className="text-xl font-semibold text-gray-900 mb-4">Filtros</h2>
			<div className="mb-4">
				<label htmlFor="start-date" className="block text-gray-700 mb-1">
					Fecha Inicial
				</label>
				<input
					type="date"
					id="start-date"
					value={startDate}
					onChange={(e) => setStartDate(e.target.value)}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
				/>
			</div>
			<div className="mb-4">
				<label htmlFor="end-date" className="block text-gray-700 mb-1">
					Fecha Final
				</label>
				<input
					type="date"
					id="end-date"
					value={endDate}
					onChange={(e) => setEndDate(e.target.value)}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
				/>
			</div>
			<button
				onClick={clearFilters}
				className="w-full px-3 py-2 mt-4 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
			>
				Borrar Filtros
			</button>
			<Link
				to="/dashboard/pending-payments"
				className="text-center w-full px-3 py-2 mt-4 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
			>
				Ver pagos pendientes
			</Link>
		</div>
	);
}
