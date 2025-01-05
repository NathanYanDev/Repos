export const getRepositorieDataByName = async (repositorieName: string) => {
	try {
		const response = await fetch(
			`https://api.github.com/repos/${repositorieName}`,
		);
		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
	}
};
