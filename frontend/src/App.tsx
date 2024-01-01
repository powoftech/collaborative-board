import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import AddEditNoteDialog from "./components/AddEditNoteDialog";
import Note from "./components/Note";
import { Note as NoteModel } from "./model/note";
import * as NotesApi from "./network/notesApi";
import styles from "./styles/NotesPage.module.css";
import styleUtils from "./styles/utils.module.css";

function App() {
	const [notes, setNotes] = useState<NoteModel[]>([]);

	const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
	const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);

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

	async function deleteNote(note: NoteModel) {
		try {
			await NotesApi.deleteNote(note._id);
			setNotes(notes.filter((existingNote) => existingNote._id !== note._id));
		} catch (error) {
			console.error(error);
			alert(error);
		}
	}

	return (
		<Container>
			<Button
				onClick={() => setShowAddEditNoteDialog(true)}
				className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
			>
				<FaPlus />
				Add new note
			</Button>
			<Row xs={1} md={2} xl={3} className="g-4">
				{notes.map((note) => (
					<Col key={note._id}>
						<Note
							note={note}
							onNoteClicked={(note) => setNoteToEdit(note)}
							onDeleteNoteClicked={deleteNote}
							className={styles.note}
						/>
					</Col>
				))}
			</Row>
			{showAddEditNoteDialog && (
				<AddEditNoteDialog
					onDismiss={() => setShowAddEditNoteDialog(false)}
					onNoteSaved={(newNote) => {
						setNotes([...notes, newNote]);
						setShowAddEditNoteDialog(false);
					}}
				/>
			)}
			{noteToEdit && (
				<AddEditNoteDialog
					noteToEdit={noteToEdit}
					onDismiss={() => setNoteToEdit(null)}
					onNoteSaved={(updatedNote) => {
						setNotes(
							notes.map((existingNote) =>
								existingNote._id === updatedNote._id ? updatedNote : existingNote
							)
						);
						setNoteToEdit(null);
					}}
				/>
			)}
		</Container>
	);
}

export default App;
