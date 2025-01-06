// Importing hooks
import { useCallback, useEffect, useState } from "react";

// Importing components
import { BtnAdd } from "../components/ui/btnAdd";
import { BtnLoading } from "../components/ui/btnLoading";
import { Github } from "../components/icons/github";
import { RepoList } from "../components/repoList";
import { CenterPanel } from "../components/centerPanel";

// Importing function from the api service to fetch data for a repository by its name.
import { getRepositoryDataByName } from "../services/api";

export const Home = () => {
	// Creating states
	const [newRepository, setNewRepository] = useState("");
	const [repositories, setRepositories] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// Uses `useEffect` to retrieve and parse the stored repositories from `localStorage` when the component mounts, then sets the repositories state.
	useEffect(() => {
		const repositoriesStorage = localStorage.getItem("repos");

		if (repositoriesStorage) {
			setRepositories(JSON.parse(repositoriesStorage));
		}
	}, []);

	// Uses `useEffect` to store the `repositories` array in `localStorage` whenever the `repositories` state changes.
	useEffect(() => {
		if (repositories.length > 0) {
			const repositoriesToString = JSON.stringify(repositories);

			localStorage.setItem("repos", repositoriesToString);
		}
	}, [repositories]);

	// Defines a `handleSubmit` function using `useCallback` to manage form submission.
	// Validates the repository input and throws an error if empty.
	// Fetches repository data using `getRepositoryDataByName`.
	// Checks if the repository is already in the list to prevent duplicates.
	// Updates the repository list and clears input and error states.
	// Handles errors and loading state during the process.
	const handleSubmit = useCallback(
		async (ev: React.FormEvent) => {
			ev.preventDefault();
			setLoading(true);

			try {
				if (!newRepository) {
					throw new Error("Você precisa digitar um repositório");
				}

				const data = await getRepositoryDataByName(newRepository);

				const checkIfIsDuplicated = repositories.find(
					(repo) => repo === newRepository,
				);

				if (checkIfIsDuplicated) {
					throw new Error("Esse repositório já está na sua lista");
				}

				setRepositories([...repositories, data.full_name]);

				setNewRepository("");
				setError("");
			} catch (error) {
				if (error instanceof Error) {
					setError(error.message);
				}
			} finally {
				setLoading(false);
			}
		},
		[newRepository, repositories],
	);

	// Defines a `handleDelete` function to remove a specified repository from the `repositories` list and update the state.
	const handleDelete = (repository: string) => {
		const newList = repositories.filter((r) => r !== repository);

		setRepositories(newList);
	};

	// Defines a `handleInputChange` function to update the `newRepository` state with the value entered in the input field.
	const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
		setNewRepository(ev.target.value);
	};

	return (
		<CenterPanel>
			<div className="flex items-center gap-2 mb-5">
				<Github className="w-8" />
				<span className="text-xl font-bold">Meus repositórios</span>
			</div>

			<form
				onSubmit={(ev) => handleSubmit(ev)}
				className="flex justify-between items-center gap-2 w-full"
			>
				<input
					type="text"
					placeholder="Adicionar repositórios"
					className={
						error
							? "w-full p-2 rounded-md border border-red-600"
							: "w-full p-2 rounded-md border border-gray-300"
					}
					value={newRepository}
					onChange={(ev) => handleInputChange(ev)}
				/>
				{loading ? <BtnLoading /> : <BtnAdd />}
			</form>

			{error && <span className="text-red-600 font-bold">Erro: {error}</span>}

			<RepoList repositories={repositories} handleDelete={handleDelete} />
		</CenterPanel>
	);
};
