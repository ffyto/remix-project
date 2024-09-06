import { Payment } from "./dashboard/route";

export const payments: Array<Payment> = [
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

export default function PendingPayments() {
	const pendingPayments = payments.filter(
		(payment) => payment.status === "pending"
	);

	return (
		<div>
			<h2 className="text-xl font-bold mb-4">Pagos Pendientes</h2>
			{pendingPayments.length > 0 ? (
				<ul>
					{pendingPayments.map((payment) => (
						<li
							key={payment.id}
							className="p-4 bg-yellow-50 border border-yellow-400 rounded-md"
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
