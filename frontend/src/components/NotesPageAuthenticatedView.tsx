import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { Note as NoteModel } from "../models/note";
import * as NotesApi from "../network/notesApi";
import styles from "../styles/NotesPage.module.css";
import styleUtils from "../styles/utils.module.css";
import AddEditNoteDialog from "./AddEditNoteDialog";
import Note from "./Note";

const NotesPageAuthenticatedView = () => {
	const [notes, setNotes] = useState<NoteModel[]>([]);
	const [notesLoading, setNotesLoading] = useState(true);
	const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);

	const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
	const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);

	useEffect(() => {
		async function loadNotes() {
			try {
				setShowNotesLoadingError(false);
				setNotesLoading(true);
				const notes = await NotesApi.fetchNotes();
				setNotes(notes);
			} catch (error) {
				console.error(error);
				setShowNotesLoadingError(true);
			} finally {
				setNotesLoading(false);
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
	const notesGrid = (
		<Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
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
	);

	return (
		<>
			<Button
				onClick={() => setShowAddEditNoteDialog(true)}
				className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
			>
				<FaPlus />
				Add new note
			</Button>

			{notesLoading && <Spinner animation="border" variant="primary" />}

			{showNotesLoadingError && (
				<p>
					Something went wrong. <br />
					Please refresh the page.
				</p>
			)}

			{!notesLoading && !showNotesLoadingError && (
				<>
					{notes.length > 0 ? notesGrid : <p>You don't have any notes yet.</p>}
				</>
			)}

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
								existingNote._id === updatedNote._id
									? updatedNote
									: existingNote
							)
						);
						setNoteToEdit(null);
					}}
				/>
			)}
		</>
	);
};

export default NotesPageAuthenticatedView;
