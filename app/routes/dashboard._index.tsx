import { useRouteLoaderData } from "@remix-run/react";
import { Payment } from "./dashboard/route";

export default function MainContent() {
	const { payments } = useRouteLoaderData("routes/dashboard") as {
		payments: Payment[];
	};

	const pendingPayments = payments
		.filter((payment) => payment.status === "pending")
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	const nextPayment = pendingPayments.shift();
	const paidPayments = payments.filter((payment) => payment.status === "paid");

	return (
		<div className="flex-1 p-6 bg-white">
			<h1 className="text-2xl font-bold text-gray-900 mb-6">Mis Pagos</h1>

			<div className="mb-6">
				<h2 className="text-xl font-semibold text-gray-700 mb-2">
					Próximo pago
				</h2>
				{nextPayment ? (
					<div className="p-4 bg-yellow-50 border border-yellow-400 rounded-md">
						<p className="text-lg text-gray-800">
							Monto: ${nextPayment?.amount}
						</p>
						<p className="text-gray-600">Fecha: {nextPayment?.date}</p>
					</div>
				) : (
					<p className="text-gray-600">No tienes pagos pendientes.</p>
				)}
			</div>

			{/* Mostrar todos los pagos pendientes */}
			<div className="mb-6">
				<h2 className="text-xl font-semibold text-gray-700 mb-2">
					Pagos pendientes
				</h2>
				{pendingPayments.length > 0 ? (
					<ul className="space-y-4">
						{pendingPayments.map((payment) => (
							<li
								key={payment.id}
								className="p-4 bg-yellow-50 border border-yellow-400 rounded-md"
							>
								<p className="text-lg text-gray-800">
									Monto: ${payment.amount}
								</p>
								<p className="text-gray-600">Fecha: {payment.date}</p>
							</li>
						))}
					</ul>
				) : (
					<p className="text-gray-600">No tienes pagos pendientes.</p>
				)}
			</div>

			{/* Mostrar todos los pagos realizados */}
			<div>
				<h2 className="text-xl font-semibold text-gray-700 mb-2">
					Pagos realizados
				</h2>
				<ul className="space-y-4">
					{paidPayments.map((payment) => (
						<li
							key={payment.id}
							className="p-4 bg-green-50 border border-green-400 rounded-md"
						>
							<p className="text-lg text-gray-800">Monto: ${payment.amount}</p>
							<p className="text-gray-600">Fecha: {payment.date}</p>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
