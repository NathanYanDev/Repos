import "./App.css";

// Importing React Router modules
import { BrowserRouter, Routes, Route } from "react-router";

// Importing pages
import { Home } from "./pages/home";
import { Repository } from "./pages/repository";

function App() {
	return (
		<div className="min-h-screen h-auto w-screen bg-slate-950 pt-20">
			<BrowserRouter>
				<Routes>
					<Route index element={<Home />} />
					<Route path="/repository/:repository" element={<Repository />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
