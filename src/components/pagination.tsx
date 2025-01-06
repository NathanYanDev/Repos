// Importing hooks
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router";
import { useState } from "react";

// Importing request function and type State from api
import { getIssuesFromRepository } from "../services/api";
import type { State } from "../services/api";

// Importing icons from Lucide
import { ArrowBigLeftIcon, ArrowBigRightIcon } from "lucide-react";

// Defines a type for pagination props with a single property 'page' representing the current page number.
type PaginationProps = {
	page: number;
};

// Defines a type for a filter object with state, label, active style, and default style properties.
type Filters = {
	state: State;
	label: string;
	onActiveStyle: string;
	defaultStyle: string;
};

export const Pagination = ({ page }: PaginationProps) => {
	// Extracts the 'repository' parameter from the URL using the useParams hook.
	const { repository } = useParams();

	// Destructures and initializes the setSearchParams function to modify the query parameters in the URL.
	const [, setSearchParams] = useSearchParams();

	// Creates the state for manipulete issues
	const [state, setState] = useState<State>("all");

	// Creates state filters
	const [filters] = useState<Filters[]>([
		{
			state: "all",
			label: "Todas",
			onActiveStyle:
				"bg-white text-slate-950 border border-slate-950 rounded px-3 py-1",
			defaultStyle:
				"bg-slate-950 text-white border border-slate-200 rounded px-3 py-1",
		},
		{
			state: "open",
			label: "Abertas",
			onActiveStyle:
				"text-emerald-700 bg-white border border-emerald-700 rounded px-3 py-1",
			defaultStyle:
				"bg-emerald-700 text-white border border-slate-200 rounded px-3 py-1",
		},
		{
			state: "closed",
			label: "Fechadas",
			onActiveStyle:
				"text-red-700 bg-white border border-red-700 rounded px-3 py-1",
			defaultStyle:
				"bg-red-700 text-white border border-slate-200 rounded px-3 py-1",
		},
	]);

	// Uses the useQuery hook to fetch issues data from a repository based on page and state, with a fallback error if the repository is undefined and placeholder data to keep previous results while loading.
	const { data: issuesData, isLoading: loadingIssues } = useQuery({
		queryKey: ["issuesData", page, state],
		queryFn: () => {
			if (repository) {
				return getIssuesFromRepository(repository, page, state);
			}
			throw new Error("Repository is undefined");
		},
		placeholderData: keepPreviousData,
	});

	// Defines a function to navigate to the previous page by updating the query parameter 'page', ensuring the page number does not go below 1.
	const previousPage = () => {
		if (page - 1 <= 0) {
			return;
		}

		setSearchParams({ page: String(page - 1) });
	};

	// Defines a function to navigate to the next page by updating the query parameter 'page', ensuring the page number does not exceed the total number of issues.
	const nextPage = () => {
		if (!issuesData || page + 1 > issuesData.length) {
			return;
		}

		setSearchParams({ page: String(page + 1) });
	};

	// Waiting for loading all issues
	if (loadingIssues) {
		return null;
	}

	return (
		<div>
			<div className="flex items-center gap-1 mt-3">
				{filters.map((filter) => (
					<button
						className={
							state === filter.state
								? filter.onActiveStyle
								: filter.defaultStyle
						}
						type="button"
						key={filter.label}
						onClick={() => setState(filter.state)}
					>
						{filter.label}
					</button>
				))}
			</div>
			<ul className="list-none mt-3 pt-3 border-t border-slate-400">
				{issuesData?.length === 0 && (
					<li className="py-[15px] px-[10px] mb-3 text-center text-2xl">
						Sem issues para este repositório
					</li>
				)}
				{issuesData?.map((issue) => (
					<li
						key={issue.id}
						className="py-[15px] px-[10px] mb-3 flex gap-3 items-center"
					>
						<img
							src={issue.user.avatar}
							alt={issue.user.name}
							className="w-[45px] h-[45px] rounded-[50%] border-2 border-slate-950"
						/>
						<div className="flex-1">
							<a
								href={issue.linkTo}
								target="_blank"
								className="underline font-bold text-lg text-slate-900 hover:text-emerald-700"
								rel="noreferrer"
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
				<button
					type="button"
					onClick={previousPage}
					disabled={page < 2}
					className="disabled:cursor-not-allowed disabled:opacity-10"
				>
					<ArrowBigLeftIcon />
				</button>

				<button
					type="button"
					onClick={nextPage}
					disabled={page + 1 > (issuesData?.length ?? 0)}
					className="disabled:cursor-not-allowed disabled:opacity-10"
				>
					<ArrowBigRightIcon />
				</button>
			</div>
		</div>
	);
};
