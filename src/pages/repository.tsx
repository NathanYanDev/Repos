import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";

import { CenterPanel } from "../components/centerPanel";
import {
	getIssuesFromRepository,
	getRepositoryDataByName,
} from "../services/api";
import {
	ArrowBigLeftIcon,
	ArrowBigRightIcon,
	ArrowLeftIcon,
} from "lucide-react";
import { useState } from "react";

export const Repository = () => {
	const navigate = useNavigate();
	const { repository } = useParams();

	const [page, setPage] = useState(1);

	const { data: repoData, isLoading: loadingRepo } = useQuery({
		queryKey: ["repoData"],
		queryFn: () => {
			if (repository) {
				return getRepositoryDataByName(repository);
			}
			throw new Error("Repository is undefined");
		},
	});

	const { data: issuesData, isLoading: loadingIssues } = useQuery({
		queryKey: ["issuesData"],
		queryFn: () => {
			if (repository) {
				return getIssuesFromRepository(repository);
			}
			throw new Error("Repository is undefined");
		},
	});

	const handlePage = (currentPage: string) => {
		switch (currentPage) {
			case "previous":
				if (page === 1) {
					break;
				}
				setPage(page - 1);
				break;
			case "next":
				setPage(page + 1);
				break;
			default:
				break;
		}
	};

	if (loadingIssues || loadingRepo) {
		return null;
	}

	return (
		<CenterPanel>
			<button type="button" onClick={() => navigate("/")}>
				<ArrowLeftIcon />
			</button>
			<header className="flex flex-col items-center">
				<img
					src={repoData?.owner.avatar}
					alt="Avatar"
					className="rounded-[20%] w-[150px]"
				/>
				<h1 className="text-3xl font-bold mb-2">{repoData?.name}</h1>
				<p className="text-lg">{repoData?.description}</p>
			</header>
			<div>
				<ul className="list-none mt-3 pt-3 border-t border-slate-400">
					{issuesData?.map((issue) => (
						<li
							key={issue.id}
							className="py-[15px] px-[10px] mb-3 flex gap-3 items-center"
						>
							<div>
								<img
									src={issue.user.avatar}
									alt={issue.user.name}
									className="w-[45px] h-[45px] rounded-[50%] border-2 border-slate-950"
								/>
							</div>
							<div>
								<a
									href={issue.linkTo}
									className="underline font-bold text-lg text-slate-900 hover:text-emerald-700"
								>
									{issue.title}
								</a>

								{issue.labels.map((label) => (
									<span
										key={label.id}
										className="text-white bg-[#222] rounded text-xs py-1 px-2 ml-2"
									>
										{label.name}
									</span>
								))}

								<p className="mt-2 text-xs text-black">{issue.user.name}</p>
							</div>
						</li>
					))}
				</ul>

				<div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-400">
					<button type="button" onClick={() => handlePage("previous")}>
						<ArrowBigLeftIcon />
					</button>

					<button type="button" onClick={() => handlePage("next")}>
						<ArrowBigRightIcon />
					</button>
				</div>
			</div>
		</CenterPanel>
	);
};
