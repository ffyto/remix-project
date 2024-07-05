import type { MetaFunction } from "@remix-run/node";
import { useLoaderData, json } from "@remix-run/react";

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

import { LoaderFunction } from "@remix-run/node";
import { getSession } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
	const session = await getSession(request.headers.get("Cookie"));
	const userEmail = session.get("userEmail");

	return json({ userEmail });
};

export default function Index() {
	const { userEmail } = useLoaderData();
	return (
		<div>
			<h1 className="flex text-red-500">Welcome to Remix {userEmail}</h1>
			<p></p>
		</div>
	);
}
