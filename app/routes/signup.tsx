import { Link, Form, redirect, json } from "@remix-run/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ActionFunctionArgs } from "@remix-run/node";
import { useRemixForm, getValidatedFormData } from "remix-hook-form";
import { TextField } from "~/components/form/text-field";
import { getSession, commitSession } from "../utils/session.server";

import { signup } from "~/utils/authentication";

const SignupSchema = z
	.object({
		name: z
			.string()
			.min(1, { message: "El nombre es requerido." })
			.min(5, { message: "Debe tener al menos 5 caracteres." }),
		email: z
			.string()
			.min(1, { message: "El correo electrónico es requerido." })
			.email({ message: "Debe ser un correo válido." }),
		password: z
			.string()
			.min(1, { message: "La contraseña es requerida." })
			.min(8, { message: "Debe tener al menos 8 caracteres." }),
		confirmPassword: z.string().min(1, {
			message: "Confirmar contraseña es requerida.",
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Las contraseñas no coinciden.",
		path: ["confirmPassword"],
	});

type FormData = z.infer<typeof SignupSchema>;

const resolver = zodResolver(SignupSchema);

export async function action({ request }: ActionFunctionArgs) {
	const { data: formData } = await getValidatedFormData<FormData>(
		request,
		resolver
	);

	const {
		email = "",
		password = "",
		name = "",
		confirmPassword = "",
	} = formData || {};
	const response = signup({ name, email, password, confirmPassword });
	const session = await getSession(request.headers.get("Cookie"));
	session.set("user", response);

	if (!response) {
		return json({ error: "Failed to sign up" }, { status: 401 });
	} else {
		return redirect("/dashboard", {
			headers: { "Set-Cookie": await commitSession(session) },
		});
	}
}

export default function Signup() {
	const { handleSubmit, control } = useRemixForm<FormData>({
		mode: "onSubmit",
		resolver,
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Crear una cuenta
					</h2>
				</div>
				<Form className="mt-8 space-y-6" onSubmit={handleSubmit} method="POST">
					<div className="rounded-md shadow-sm -space-y-px">
						<TextField
							aria-label="Nombre"
							name="name"
							type="text"
							className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Nombre"
							control={control}
						/>
						<TextField
							aria-label="Correo Electrónico"
							name="email"
							type="email"
							className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Correo Electrónico"
							control={control}
						/>
						<TextField
							aria-label="Contraseña"
							name="password"
							type="password"
							className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Contraseña"
							control={control}
						/>
						<TextField
							aria-label="Confirmar contraseña"
							name="confirmPassword"
							type="password"
							className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Confirmar contraseña"
							control={control}
						/>
					</div>

					<div className="text-sm flex items-center justify-center">
						<Link
							to="/login"
							className="font-medium text-indigo-600 hover:text-indigo-500"
						>
							¿Ya tienes una cuenta? Inicia Sesión
						</Link>
					</div>

					<div>
						<button
							type="submit"
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							Registrarse
						</button>
					</div>
				</Form>
			</div>
		</div>
	);
}
