import { Button, Navbar } from "react-bootstrap";
import { User } from "../models/user";
import * as NotesApi from "../network/notesApi";

interface NavBarAuthenticatedViewProps {
	user: User;
	onSignOutSuccessful: () => void;
}

const NavBarAuthenticatedView = ({
	user,
	onSignOutSuccessful,
}: NavBarAuthenticatedViewProps) => {
	async function signOut() {
		try {
			await NotesApi.signOut();
			onSignOutSuccessful();
		} catch (error) {
			console.error(error);
			alert(error);
		}
	}

	return (
		<>
			<Navbar.Text className="me-2">Signed in as: {user.username}</Navbar.Text>
			<Button onClick={signOut}>Sign out</Button>
		</>
	);
};

export default NavBarAuthenticatedView;
