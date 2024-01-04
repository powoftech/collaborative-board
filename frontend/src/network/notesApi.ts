import { Note } from "../models/note";
import { User } from "../models/user";

async function fetchData(input: RequestInfo, init?: RequestInit) {
	const response = await fetch(input, init);

	if (response.ok) {
		return response;
	} else {
		const errorBody = await response.json();
		const errorMessage = errorBody.error;
		throw Error(errorMessage);
	}
}

export async function getAuthenticatedUser(): Promise<User> {
	const response = await fetchData("/api/users", { method: "GET" });
	return response.json();
}

export interface SignUpInput {
	username: string;
	email: string;
	password: string;
}

export async function signUp(signUpBody: SignUpInput): Promise<User> {
	const response = await fetchData("/api/users/signup", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(signUpBody),
	});
	return response.json();
}

export interface SignInInput {
	username: string;
	password: string;
}

export async function signIn(signInBody: SignInInput): Promise<User> {
	const response = await fetchData("/api/users/signin", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(signInBody),
	});
	return response.json();
}

export async function signOut() {
	await fetchData("/api/users/signout", { method: "POST" });
}

export async function fetchNotes(): Promise<Note[]> {
	const response = await fetchData("/api/notes", { method: "GET" });
	return response.json();
}

export interface NoteInput {
	title: string;
	text?: string;
}

export async function createNote(noteBody: NoteInput): Promise<Note> {
	const response = await fetchData("/api/notes", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(noteBody),
	});
	return response.json();
}

export async function updateNote(
	noteId: string,
	noteBody: NoteInput
): Promise<Note> {
	const response = await fetchData("/api/notes/" + noteId, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(noteBody),
	});
	return response.json();
}

export async function deleteNote(noteId: string) {
	await fetchData("/api/notes/" + noteId, { method: "DELETE" });
}
