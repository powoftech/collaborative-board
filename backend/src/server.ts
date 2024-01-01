import mongoose from "mongoose";
import app from "./app";
import env from "./utils/validateEnv";

const port = env.PORT;

const mongo_connection_string = env.MONGO_CONNECTION_STRING;

mongoose
	.connect(mongo_connection_string)
	.then(() => {
		console.log("Mongoose connected!");

		app.listen(port, () => {
			console.log("Server running on port: " + port);
		});
	})
	.catch(console.error);
