import { MenuIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";

// Defines a type for the RepoListProps, which includes a list of repository names and a function to handle the deletion of a repository.
type RepoListProps = {
	repositories: string[];
	handleDelete: (repository: string) => void;
};

export const RepoList = ({ repositories, handleDelete }: RepoListProps) => {
	return (
		<div className="pt-3">
			<ul className="">
				{repositories?.map((repository) => {
					return (
						<li
							key={repository}
							className="flex items-center justify-between gap-2 py-3 "
						>
							<div className="flex items-center gap-2">
								<button type="button" onClick={() => handleDelete(repository)}>
									<Trash2Icon />
								</button>
								<span className="text-lg font-bold">{repository}</span>
							</div>
							<Link to={`/repository/${encodeURIComponent(repository)}?page=1`}>
								<MenuIcon />
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
};
