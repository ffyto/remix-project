import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { payments } from "./dashboard.pending-payments";

export const loader: LoaderFunction = async ({ params }) => {
	const payment = payments.find((p) => p.id === parseInt(params.id));
	if (!payment) {
		throw new Response("Pago no encontrado", { status: 404 });
	}

	return json({ payment });
};

export default function PaymentDetail() {
	const { payment } = useLoaderData();

	return (
		<div>
			<h2 className="text-2xl font-bold">Detalle del Pago</h2>
			<p>Monto: ${payment.amount}</p>
			<p>Fecha: {payment.date}</p>
			<p>Estado: {payment.status === "paid" ? "Pagado" : "Pendiente"}</p>
		</div>
	);
}
