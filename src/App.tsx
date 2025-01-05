import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router";

import { Home } from "./pages/home";
import { Repository } from "./pages/repository";

function App() {
	return (
		<div className="h-screen w-screen bg-slate-950 pt-20">
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
