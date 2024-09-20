import { LoaderFunction, json } from "@remix-run/node";
import {
	useLoaderData,
	isRouteErrorResponse,
	useRouteError,
	useOutletContext,
} from "@remix-run/react";

export const loader: LoaderFunction = async ({ params }) => {
	return json({ params });
};

export default function PaymentDetail() {
	const { params } = useLoaderData();
	const payments = useOutletContext();
	const payment = payments.find((p) => p.id === parseInt(params.id));

	if (!payment) {
		// Lanzar un error 404 si no se encuentra el pago
		throw new Response("Pago no encontrado", { status: 404 });
	}

	return (
		<div className="mt-12">
			<h2 className="text-xl font-semibold text-gray-700 mb-2">
				Detalle del Pago{" "}
			</h2>

			<div className="mb-6">
				<div className="p-4 bg-yellow-50 border border-yellow-400 rounded-md">
					<p className="text-lg text-gray-800">Monto: ${payment?.amount}</p>
					<p className="text-gray-600">Fecha: {payment?.date}</p>
					<p>Estado: {payment.status === "paid" ? "Pagado" : "Pendiente"}</p>
				</div>
			</div>
		</div>
	);
}

export function ErrorBoundary() {
	const error = useRouteError();

	if (isRouteErrorResponse(error)) {
		return (
			<>
				<div className="mt-12">
					<h1 className="text-2xl font-bold text-gray-900 mb-6">
						Ocurrió un error
					</h1>

					<div className="mb-6">
						<div className="p-4 bg-red-50 border border-red-400 rounded-md">
							<p className="text-lg text-gray-800">
								{error.status} {error.statusText}
							</p>
							<p className="text-gray-600">{error.data}</p>
						</div>
					</div>
				</div>
			</>
		);
	} else if (error instanceof Error) {
		return (
			<div className="mt-12">
				<h1 className="text-2xl font-bold text-gray-900 mb-6">
					Ocurrió un error
				</h1>

				<div className="mb-6">
					<div className="p-4 bg-red-50 border border-red-400 rounded-md">
						<p className="text-lg text-gray-800">{error.message}</p>
						<p className="text-gray-600">The stack trace is:</p>
						<pre>{error.stack}</pre>
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<div className="mt-12">
				<h1>Ocurrió un error inesperado</h1>
			</div>
		);
	}
}
