import { Link, useNavigate } from "react-router-dom";

import { Menu } from "~/components/ui/menu";
import { redirect, json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { getSession } from "~/utils/session.server";
import { useLoaderData, Outlet } from "@remix-run/react";

import { useState } from "react";
import { User } from "~/utils/authentication";

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
		date: "2024-08-10", // Pago realizado
		status: "paid",
	},
	{
		id: 2,
		amount: 150,
		date: "2024-09-05", // Pago realizado
		status: "paid",
	},
	{
		id: 3,
		amount: 180,
		date: "2024-09-15", // Pago realizado
		status: "paid",
	},
	{
		id: 4,
		amount: 220,
		date: "2024-09-20", // Pago pendiente
		status: "pending",
	},
	{
		id: 5,
		amount: 210,
		date: "2024-09-25", // Pago pendiente
		status: "pending",
	},
	{
		id: 6,
		amount: 195,
		date: "2024-10-01", // Pago pendiente
		status: "pending",
	},
	{
		id: 7,
		amount: 230,
		date: "2024-10-10", // Pago pendiente
		status: "pending",
	},
	{
		id: 8,
		amount: 175,
		date: "2024-10-15", // Pago pendiente
		status: "pending",
	},
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get("Cookie"));
	const user = session.get("user") as User;

	if (!user) {
		throw redirect("/login");
	}

	const url = new URL(request.url);
	const startDate = url.searchParams.get("startDate") || "";
	const endDate = url.searchParams.get("endDate") || "";

	// Filtrar pagos según las fechas
	const filteredPayments = payments.filter((payment) => {
		const paymentDate = new Date(payment.date);
		const start = startDate ? new Date(startDate) : null;
		const end = endDate ? new Date(endDate) : null;

		return (!start || paymentDate >= start) && (!end || paymentDate <= end);
	});

	return json({
		user,
		payments: filteredPayments,
	});
};

export default function Dashboard() {
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>("");
	const { payments } = useLoaderData<typeof loader>();

	return (
		<div className="min-h-screen flex flex-col relative">
			<Navbar />
			<div className="flex flex-1">
				<Sidebar
					startDate={startDate}
					setStartDate={setStartDate}
					endDate={endDate}
					setEndDate={setEndDate}
				/>
				<div className="overflow-auto w-full flex-1 p-6 bg-white ml-72">
					<Outlet context={payments} />
				</div>
			</div>
		</div>
	);
}

function Navbar() {
	const { user } = useLoaderData<typeof loader>();
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
		<nav className="bg-indigo-600 p-4 text-white flex justify-between items-center fixed w-full">
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
	const navigate = useNavigate();

	const applyFilters = () => {
		const params = new URLSearchParams();
		if (startDate) params.set("startDate", startDate);
		if (endDate) params.set("endDate", endDate);
		navigate(`?${params.toString()}`);
	};

	const clearFilters = () => {
		setStartDate("");
		setEndDate("");
		navigate("?");
	};

	return (
		<div className="flex w-64 bg-gray-100 p-6 border-r border-gray-200 flex-col fixed h-full top-16">
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
				onClick={applyFilters}
				className="w-full px-3 py-2 mt-4 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md"
			>
				Aplicar Filtros
			</button>
			<button
				onClick={clearFilters}
				className="w-full px-3 py-2 mt-4 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md"
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
