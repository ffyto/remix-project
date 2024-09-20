import { Link, Form, redirect } from "@remix-run/react";
import { useRemixForm, getValidatedFormData } from "remix-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSession, commitSession } from "../utils/session.server";
import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { TextField } from "~/components/form/text-field";
import { login } from "~/utils/authentication";

const LoginSchema = z.object({
	email: z.string({ required_error: "El correo electrónico es requerido." }),
	password: z.string({ required_error: "La contraseña es requerida." }),
});

type FormData = z.infer<typeof LoginSchema>;

const resolver = zodResolver(LoginSchema);

export async function action({ request }: ActionFunctionArgs) {
	const { data: formData } = await getValidatedFormData<FormData>(
		request,
		resolver
	);

	const { email = "", password = "" } = formData || {};
	const response = login({ email, password });
	const session = await getSession(request.headers.get("Cookie"));

	if (!response) {
		throw json({ error: "Failed to log in" }, { status: 401 });
	} else {
		session.set("user", response);

		return redirect("/dashboard", {
			headers: { "Set-Cookie": await commitSession(session) },
		});
	}
}

export default function Login() {
	const { handleSubmit, control } = useRemixForm<FormData>({
		mode: "onSubmit",
		resolver,
		defaultValues: {
			email: "",
			password: "",
		},
	});

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Iniciar Sesión
					</h2>
				</div>
				<Form className="mt-8 space-y-6" onSubmit={handleSubmit} method="POST">
					<div className="rounded-md shadow-sm -space-y-px">
						<div>
							<TextField
								aria-label="Correo Electrónico"
								name="email"
								type="email"
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="Correo Electrónico"
								control={control}
							/>
						</div>
						<div>
							<TextField
								aria-label="Contraseña"
								name="password"
								type="password"
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="Contraseña"
								control={control}
							/>
						</div>
					</div>

					<div className="text-sm flex items-center justify-center flex-col">
						<Link
							to="/forgot-password"
							className="font-medium text-indigo-600 hover:text-indigo-500"
						>
							¿Olvidaste tu contraseña?
						</Link>
						<Link
							to="/signup"
							className="font-medium text-indigo-600 hover:text-indigo-500"
						>
							¿Aún no tienes una cuenta?
						</Link>
					</div>

					<div>
						<button
							type="submit"
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							Iniciar Sesión
						</button>
					</div>
				</Form>
			</div>
		</div>
	);
}
