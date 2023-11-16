import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "./App.css";
import logo from "./logo.svg";
import { Note } from "./model/note";

function App() {
	const [clickCount, setClickCount] = useState(0);
	const [notes, setNotes] = useState<Note[]>([]);

	useEffect(() => {
		async function loadNotes() {
			try {
				const response = await fetch("/api/notes", {
					method: "GET",
				});
				const notes = await response.json();
				setNotes(notes);
			} catch (error) {
				console.error(error);
				alert(error);
			}
		}
		loadNotes();
	}, []);

	return <div className="App">{JSON.stringify(notes)}</div>;
}

export default App;
