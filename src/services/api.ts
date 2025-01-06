// Defines a `Repository` type with properties for the repository owner (including avatar and name),
// repository name, full name, and description.
export type Repository = {
	owner: {
		avatar: string;
		name: string;
	};
	name: string;
	full_name: string;
	description: string;
};

// Defines a `Label` type with properties for the label's `id` (number) and `name` (string).
type Label = {
	id: number;
	name: string;
};

// Defines an `Issues` type with properties for the issue's `id`, user information (avatar and name),
// link, title, and an array of labels.
export type Issues = {
	id: string;
	user: {
		avatar: string;
		name: string;
	};
	linkTo: string;
	title: string;
	labels: Label[];
};

// Defines an `IssueGit` type for api return data, with properties for the issue's `id`, user information (avatar URL and login),
// HTML URL, title, and an array of labels.
type IssueGit = {
	id: number;
	user: {
		avatar_url: string;
		login: string;
	};
	html_url: string;
	title: string;
	labels: Label[];
};

// Defines a `State` type that can be one of the following string values: "open", "closed", or "all".
export type State = "open" | "closed" | "all";

// Function to fetch repository data by repository name from GitHub API
export const getRepositoryDataByName = async (
	repositoryName: string,
): Promise<Repository> => {
	try {
		const response = await fetch(
			`https://api.github.com/repos/${repositoryName}`,
		);

		const data = await response.json();

		if (data.message === "Not Found") {
			throw new Error("Not Found");
		}

		const repository: Repository = {
			owner: {
				avatar: data.owner.avatar_url,
				name: data.owner.login,
			},
			name: data.name,
			full_name: data.full_name,
			description: data.description,
		};

		return repository;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
		throw new Error("Unknown error occurred");
	}
};

// Function to fetch repository issues by repository name from GitHub API
export const getIssuesFromRepository = async (
	repositoryName: string,
	page: number,
	state: State,
) => {
	try {
		const response = await fetch(
			`https://api.github.com/repos/${repositoryName}/issues?${new URLSearchParams(
				{
					per_page: "5",
					page: String(page),
					state: state,
				},
			).toString()}`,
		);

		const data = await response.json();

		if (data.message === "Not Found") {
			throw new Error("Not Found");
		}

		const issues: Issues[] = (data as IssueGit[]).map((issue: IssueGit) => ({
			id: String(issue.id),
			user: {
				avatar: issue.user.avatar_url,
				name: issue.user.login,
			},
			linkTo: issue.html_url,
			title: issue.title,
			labels: issue.labels,
		}));

		return issues;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
		throw new Error("Unknown error occurred");
	}
};
