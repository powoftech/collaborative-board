import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import NavBar from "./components/NavBar";
import NotesPageAuthenticatedView from "./components/NotesPageAuthenticatedView";
import NotesPageUnauthenticatedView from "./components/NotesPageUnauthenticatedView";
import SignInModal from "./components/SignInModal";
import SignUpModal from "./components/SignUpModal";
import { User } from "./models/user";
import * as NotesApi from "./network/notesApi";
import styles from "./styles/NotesPage.module.css";

function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);

  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  useEffect(() => {
    async function fetchAuthenticatedUser() {
      try {
        const user = await NotesApi.getAuthenticatedUser();
        setAuthenticatedUser(user);
      } catch (error) {
        console.error(error);
      }
    }
    fetchAuthenticatedUser();
  }, []);

  return (
    <div>
      <NavBar
        authenticatedUser={authenticatedUser}
        onSignUpClicked={() => setShowSignUpModal(true)}
        onSignInClicked={() => setShowSignInModal(true)}
        onSignOutSuccessful={() => setAuthenticatedUser(null)}
      />
      <Container className={styles.notesPage}>
        <>
          {authenticatedUser ? (
            <NotesPageAuthenticatedView />
          ) : (
            <NotesPageUnauthenticatedView />
          )}
        </>

        {showSignUpModal && (
          <SignUpModal
            onDismiss={() => setShowSignUpModal(false)}
            onSignUpSuccessful={(user) => {
              setAuthenticatedUser(user);
              setShowSignUpModal(false);
            }}
          />
        )}
        {showSignInModal && (
          <SignInModal
            onDismiss={() => setShowSignInModal(false)}
            onSignInSuccessful={(user) => {
              setAuthenticatedUser(user);
              setShowSignInModal(false);
            }}
          />
        )}
      </Container>
    </div>
  );
}

export default App;
