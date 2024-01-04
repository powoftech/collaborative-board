import { Container, Nav, Navbar } from "react-bootstrap";
import { User } from "../models/user";
import NavBarAuthenticatedView from "./NavBarAuthenticatedView";
import NavBarUnauthenticatedUser from "./NavBarUnauthenticatedUser";

interface NavBarProps {
  authenticatedUser: User | null;
  onSignUpClicked: () => void;
  onSignInClicked: () => void;
  onSignOutSuccessful: () => void;
}

const NavBar = ({
  authenticatedUser,
  onSignUpClicked,
  onSignInClicked,
  onSignOutSuccessful,
}: NavBarProps) => {
  return (
    <Navbar bg="primary" variant="dark" expand="md" sticky="top">
      <Container>
        <Navbar.Brand href="/">Cool Notes App</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto">
            {authenticatedUser ? (
              <NavBarAuthenticatedView
                user={authenticatedUser}
                onSignOutSuccessful={onSignOutSuccessful}
              />
            ) : (
              <NavBarUnauthenticatedUser
                onSignUpClicked={onSignUpClicked}
                onSignInClicked={onSignInClicked}
              />
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
