import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Note } from "../models/note";
import * as NotesApi from "../network/notesApi";
import { NoteInput } from "../network/notesApi";
import TextInputField from "./form/TextInputField";

interface AddEditNoteDialogProps {
	noteToEdit?: Note;
	onDismiss: () => void;
	onNoteSaved: (note: Note) => void;
}

const AddEditNoteDialog = ({
	noteToEdit,
	onDismiss,
	onNoteSaved,
}: AddEditNoteDialogProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<NoteInput>({
		defaultValues: {
			title: noteToEdit?.title ?? "",
			text: noteToEdit?.text ?? "",
		},
	});

	async function onSubmit(noteBody: NoteInput) {
		try {
			let noteResponse: Note;
			if (noteToEdit) {
				noteResponse = await NotesApi.updateNote(noteToEdit._id, noteBody);
			} else {
				noteResponse = await NotesApi.createNote(noteBody);
			}
			onNoteSaved(noteResponse);
		} catch (error) {
			console.error(error);
			alert(error);
		}
	}

	return (
		<Modal show onHide={onDismiss}>
			<Modal.Header closeButton>
				<Modal.Title>{noteToEdit ? "Edit Note" : "Add Note"}</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<Form id="addEditNoteForm" onSubmit={handleSubmit(onSubmit)}>
					<TextInputField
						name="title"
						label="Title"
						type="text"
						placeholder="Title"
						register={register}
						registerOptions={{ required: "Required" }}
						error={errors.title}
					/>
					<TextInputField
						name="text"
						label="Text"
						as="textarea"
						rows={5}
						placeholder="Text"
						register={register}
					/>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button type="submit" form="addEditNoteForm" disabled={isSubmitting}>
					Submit
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default AddEditNoteDialog;
