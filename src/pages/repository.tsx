import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router";

import { CenterPanel } from "../components/centerPanel";
import { getRepositoryDataByName } from "../services/api";
import { ArrowLeftIcon } from "lucide-react";
import { Pagination } from "../components/pagination";

export const Repository = () => {
	const navigate = useNavigate();

	const { repository } = useParams();
	const [searchParams] = useSearchParams();

	const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

	const { data: repoData, isLoading: loadingRepo } = useQuery({
		queryKey: ["repoData"],
		queryFn: () => {
			if (repository) {
				return getRepositoryDataByName(repository);
			}
			throw new Error("Repository is undefined");
		},
	});

	if (loadingRepo) {
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
				<Pagination page={page} />
			</div>
		</CenterPanel>
	);
};
