import { useCallback, useEffect, useState } from "react";

import { Github } from "../components/icons/github";
import { BtnLoading } from "../components/ui/btnLoading";
import { BtnAdd } from "../components/ui/btnAdd";

import { getRepositorieDataByName } from "../services/api";
import { RepoList } from "../components/repoList";

export const Home = () => {
	const [newRepository, setNewRepository] = useState("");
	const [repositories, setRepositories] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const repositoriesStorage = localStorage.getItem("repos");

		if (repositoriesStorage) {
			setRepositories(JSON.parse(repositoriesStorage));
		}
	}, []);

	useEffect(() => {
		if (repositories.length > 0) {
			const repositoriesToString = JSON.stringify(repositories);

			localStorage.setItem("repos", repositoriesToString);
		}
	}, [repositories]);

	const handleSubmit = useCallback(
		async (ev: React.FormEvent) => {
			ev.preventDefault();
			setLoading(true);

			try {
				if (!newRepository) {
					throw new Error("Você precisa digitar um repositório");
				}

				const data = await getRepositorieDataByName(newRepository);
				const checkIfIsDuplicated = repositories.find(
					(repo) => repo === newRepository,
				);

				if (data.message === "Not Found") {
					throw new Error(
						"O repositório não foi encontrado, verifique se digitou corretamente",
					);
				}

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

	const handleDelete = (repository: string) => {
		const newList = repositories.filter((r) => r !== repository);

		setRepositories(newList);
	};

	const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
		setNewRepository(ev.target.value);
	};

	return (
		<div className="max-w-3xl mx-auto rounded-md p-5 bg-white">
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
		</div>
	);
};
