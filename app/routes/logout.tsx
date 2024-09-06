import { redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/utils/session.server";

export const action = async ({ request }: { request: Request }) => {
	console.log("logout");
	const session = await getSession(request.headers.get("Cookie"));
	return redirect("/login", {
		headers: {
			"Set-Cookie": await destroySession(session),
		},
	});
};
