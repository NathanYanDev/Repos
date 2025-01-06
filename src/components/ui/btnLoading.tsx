import { LoaderCircleIcon } from "lucide-react";

export const BtnLoading = () => {
	return (
		<button type="submit" disabled className="cursor-not-allowed opacity-10">
			<LoaderCircleIcon strokeWidth={1.5} size={32} className="animate-spin" />
		</button>
	);
};
