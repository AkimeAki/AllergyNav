import { ForbiddenError, NotFoundError, TooManyRequestError, ValidationError } from "@/definition";

export const getStatus = (e: unknown): number => {
	let status = 500;

	if (e instanceof NotFoundError) {
		status = 404;
	} else if (e instanceof ValidationError) {
		status = 422;
	} else if (e instanceof ForbiddenError) {
		status = 403;
	} else if (e instanceof TooManyRequestError) {
		status = 429;
	}

	return status;
};
