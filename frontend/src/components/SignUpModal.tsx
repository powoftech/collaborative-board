import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { User } from "../models/user";
import * as NotesApi from "../network/notesApi";
import { SignUpInput } from "../network/notesApi";
import styleUtils from "../styles/utils.module.css";
import TextInputField from "./form/TextInputField";
import { useState } from "react";
import { ConflictError, UnauthorizedError } from "../errors/httpError";

interface SignUpModalProps {
	onDismiss: () => void;
	onSignUpSuccessful: (user: User) => void;
}

const SignUpModal = ({ onDismiss, onSignUpSuccessful }: SignUpModalProps) => {
	const [errorText, setErrorText] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignUpInput>();

	async function onSubmit(signUpBody: SignUpInput) {
		try {
			const newUser = await NotesApi.signUp(signUpBody);
			onSignUpSuccessful(newUser);
		} catch (error) {
			if (error instanceof ConflictError) {
				setErrorText(error.message);
			} else {
				alert(error);
			}
			console.error(error);
		}
	}

	return (
		<Modal show onHide={onDismiss}>
			<Modal.Header closeButton>
				<Modal.Title>Sign Up</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				{errorText && <Alert variant="danger">{errorText}</Alert>}

				<Form id="signUpForm" onSubmit={handleSubmit(onSubmit)}>
					<TextInputField
						name="username"
						label="Username"
						type="text"
						placeholder="Username"
						register={register}
						registerOptions={{ required: "Required" }}
						error={errors.username}
					/>
					<TextInputField
						name="email"
						label="Email"
						type="email"
						placeholder="Email"
						register={register}
						registerOptions={{ required: "Required" }}
						error={errors.email}
					/>
					<TextInputField
						name="password"
						label="Password"
						type="password"
						placeholder="Password"
						register={register}
						registerOptions={{ required: "Required" }}
						error={errors.password}
					/>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button
					type="submit"
					form="signUpForm"
					disabled={isSubmitting}
					className={styleUtils.widthFull}
				>
					Submit
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default SignUpModal;
