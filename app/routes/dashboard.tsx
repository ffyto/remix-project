import { Link, useNavigate } from "react-router-dom";

import { Menu } from "~/components/ui/menu";
import { LoaderFunction } from "@remix-run/node";
import { getSession } from "~/utils/session.server";
import { useLoaderData, json } from "@remix-run/react";
import { useState } from "react";

type Payment = {
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
		date: "2024-06-25",
		status: "paid",
	},
	{
		id: 4,
		amount: 220,
		date: "2024-05-20",
		status: "paid",
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
];

export const loader: LoaderFunction = async ({ request }) => {
	const session = await getSession(request.headers.get("Cookie"));
	const user = session.get("user");

	return json({ user });
};

export default function Dashboard() {
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>("");

	const recentPendingPayment = payments.find(
		(payment) => payment.status === "pending"
	);

	const filteredPayments = payments.filter((payment) => {
		const paymentDate = new Date(payment.date);
		const start = startDate ? new Date(startDate) : null;
		const end = endDate ? new Date(endDate) : null;

		return (!start || paymentDate >= start) && (!end || paymentDate <= end);
	});

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
				<MainContent
					payments={filteredPayments}
					recentPendingPayment={recentPendingPayment}
				/>
			</div>
		</div>
	);
}

function Navbar() {
	const { user } = useLoaderData();
	console.log("🚀 ~ Navbar ~ user:", user);

	const navigate = useNavigate();
	const menuOptions = [
		{
			label: "Mi cuenta",
			action: () => navigate("/account"),
		},
		{
			label: "Cerrar sesión",
			action: () => navigate("/login"),
		},
	];

	return (
		<nav className="bg-indigo-600 p-4 text-white flex justify-between items-center">
			<Link to="/dashboard" className="text-lg font-semibold">
				Dashboard
			</Link>
			<Menu
				buttonName={user.name}
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
		<div className="w-64 bg-gray-100 p-6 border-r border-gray-200">
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
		</div>
	);
}

interface MainContentProps {
	payments: Array<Payment>;
	recentPendingPayment?: Payment;
}

function MainContent({ payments, recentPendingPayment }: MainContentProps) {
	return (
		<div className="flex-1 p-6 bg-white">
			<h1 className="text-2xl font-bold text-gray-900 mb-6">Mis Pagos</h1>
			<div className="mb-6">
				<h2 className="text-xl font-semibold text-gray-700 mb-2">
					Próximo pago
				</h2>
				{recentPendingPayment ? (
					<div className="p-4 bg-yellow-50 border border-yellow-400 rounded-md">
						<p className="text-lg text-gray-800">
							Monto: ${recentPendingPayment.amount}
						</p>
						<p className="text-gray-600">Fecha: {recentPendingPayment.date}</p>
					</div>
				) : (
					<p className="text-gray-600">No tienes pagos pendientes.</p>
				)}
			</div>
			<div>
				<h2 className="text-xl font-semibold text-gray-700 mb-2">
					Pagos realizados
				</h2>
				<ul className="space-y-4">
					{payments
						.filter((payment) => payment.status === "paid")
						.map((payment) => (
							<li
								key={payment.id}
								className="p-4 bg-green-50 border border-green-400 rounded-md"
							>
								<p className="text-lg text-gray-800">
									Monto: ${payment.amount}
								</p>
								<p className="text-gray-600">Fecha: {payment.date}</p>
							</li>
						))}
				</ul>
			</div>
		</div>
	);
}
