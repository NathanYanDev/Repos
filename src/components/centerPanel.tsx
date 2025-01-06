import type { ReactNode } from "react";

export const CenterPanel = ({ children }: { children: ReactNode }) => {
	return (
		<div className="max-w-3xl mx-auto rounded-md p-5 bg-white shadow">
			{children}
		</div>
	);
};
