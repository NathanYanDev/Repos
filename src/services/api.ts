export type Repository = {
	owner: {
		avatar: string;
		name: string;
	};
	name: string;
	full_name: string;
	description: string;
};

interface Label {
	id: number;
	name: string;
}

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

export const getIssuesFromRepository = async (repositoryName: string) => {
	try {
		const response = await fetch(
			`https://api.github.com/repos/${repositoryName}/issues?${new URLSearchParams(
				{
					per_page: "5",
					state: "open",
				},
			).toString()}`,
		);

		const data = await response.json();

		if (data.message === "Not Found") {
			throw new Error("Not Found");
		}

		const issues: Issues[] = data.map((issue) => ({
			id: issue.id,
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
