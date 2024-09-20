import { useRouteLoaderData } from "@remix-run/react";
import { Payment } from "./dashboard/route";

export default function PendingPayments() {
	const { payments } = useRouteLoaderData("routes/dashboard") as {
		payments: Payment[];
	};

	const pendingPayments = payments.filter(
		(payment) => payment.status === "pending"
	);

	return (
		<div className="mt-12">
			<h2 className="text-xl font-semibold text-gray-700 mb-2">
				Pagos Pendientes
			</h2>

			{pendingPayments.length > 0 ? (
				<ul>
					{pendingPayments.map((payment) => (
						<li
							key={payment.id}
							className="p-4 bg-yellow-50 border border-yellow-400 rounded-md mb-4"
						>
							<p>Monto: ${payment.amount}</p>
							<p>Fecha: {payment.date}</p>
						</li>
					))}
				</ul>
			) : (
				<p>No tienes pagos pendientes.</p>
			)}
		</div>
	);
}
