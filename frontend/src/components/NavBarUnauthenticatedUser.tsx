import { Button } from "react-bootstrap";

interface NavBarUnauthenticatedUserProps {
	onSignUpClicked: () => void;
	onSignInClicked: () => void;
}

const NavBarUnauthenticatedUser = ({
	onSignUpClicked,
	onSignInClicked,
}: NavBarUnauthenticatedUserProps) => {
	return (
		<>
			<Button onClick={onSignUpClicked}>Sign up</Button>
			<Button onClick={onSignInClicked}>Sign in</Button>
		</>
	);
};

export default NavBarUnauthenticatedUser;
