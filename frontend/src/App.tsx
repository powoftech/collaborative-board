import { Excalidraw } from "@excalidraw/excalidraw";
import "./App.css";

// function App() {
// 	const [notes, setNotes] = useState<Note[]>([]);

// 	useEffect(() => {
// 		async function loadNotes() {
// 			try {
// 				const response = await fetch("/api/notes", {
// 					method: "GET",
// 				});
// 				const notes = await response.json();
// 				setNotes(notes);
// 			} catch (error) {
// 				console.error(error);
// 				alert(error);
// 			}
// 		}
// 		loadNotes();
// 	}, []);

// 	return <div className="App">{JSON.stringify(notes)}</div>;
// }

function App() {
	return (
		<>
			<h1 style={{ textAlign: "center" }}>Excalidraw Example</h1>
			<div style={{ height: "500px" , width: "full"}}>
				<Excalidraw />
			</div>
		</>
	);
}
export default App;
