import fs from "fs";

type User = {
	name: string;
	email: string;
	password: string;
};

const usersFilePath = "app/utils/users.js";

export const readUsersFromFile = (): User[] => {
	if (!fs.existsSync(usersFilePath)) {
		fs.writeFileSync(usersFilePath, "[]", "utf8");
	}
	const data = fs.readFileSync(usersFilePath, "utf8");

	try {
		return JSON.parse(data);
	} catch (error) {
		console.error("Error parsing JSON:", error);
		return [];
	}
};

const writeUsersToFile = (users: User[]): void => {
	try {
		fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), "utf8");
	} catch (error) {
		console.error("Error writing to file:", error);
	}
};

export const signup = ({
	name,
	email,
	password,
	confirmPassword,
}: {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}) => {
	if (password !== confirmPassword) {
		return false;
	}

	const users = readUsersFromFile();
	if (users.some((user) => user.email === email)) {
		console.log("Email is already in use.");
		return false;
	}

	const newUser: User = { name, email, password };
	users.push(newUser);
	writeUsersToFile(users);
	console.log("User registered successfully.");

	return newUser;
};

export const login = ({
	email,
	password,
}: {
	email: string;
	password: string;
}) => {
	const users = readUsersFromFile();
	const user = users.find((user) => user.email === email);

	if (!user || user.password !== password) {
		return false;
	}
	return user;
};
