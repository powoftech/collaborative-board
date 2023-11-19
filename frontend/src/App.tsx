import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import AddNoteDialog from "./components/AddNoteDialog";
import Note from "./components/Note";
import { Note as NoteModel } from "./model/note";
import * as NotesApi from "./network/notesApi";
import styles from "./styles/NotesPage.module.css";
import styleUtils from "./styles/utils.module.css";

function App() {
	const [notes, setNotes] = useState<NoteModel[]>([]);

	const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);

	useEffect(() => {
		async function loadNotes() {
			try {
				const notes = await NotesApi.fetchNotes();
				setNotes(notes);
			} catch (error) {
				console.error(error);
				alert(error);
			}
		}
		loadNotes();
	}, []);

	return (
		<Container>
			<Button
				onClick={() => setShowAddNoteDialog(true)}
				className={`mb-4 ${styleUtils.blockCenter}`}
			>
				Add new note
			</Button>
			<Row xs={1} md={2} xl={3} className="g-4">
				{notes.map((note) => (
					<Col key={note._id}>
						<Note note={note} className={styles.note} />
					</Col>
				))}
			</Row>
			{showAddNoteDialog &&
				<AddNoteDialog
					onDismiss={() => setShowAddNoteDialog(false)}
					onNoteSaved={(newNote) => {
						setNotes([...notes, newNote]);
						setShowAddNoteDialog(false);
					}}
				/>
			}
		</Container>
	);
}

export default App;
