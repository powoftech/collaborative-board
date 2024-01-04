import { Container } from "react-bootstrap";
import NotesPageAuthenticatedView from "../components/NotesPageAuthenticatedView";
import NotesPageUnauthenticatedView from "../components/NotesPageUnauthenticatedView";
import { User } from "../models/user";
import styles from "../styles/NotesPage.module.css";

interface NotesPageProps {
  authenticatedUser: User | null;
}

const NotesPage = ({ authenticatedUser }: NotesPageProps) => {
  return (
    <Container className={styles.notesPage}>
      <>
        {authenticatedUser ? (
          <NotesPageAuthenticatedView />
        ) : (
          <NotesPageUnauthenticatedView />
        )}
      </>
    </Container>
  );
};

export default NotesPage;
