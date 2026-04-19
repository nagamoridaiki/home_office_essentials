export class UnauthenticatedError extends Error {
  readonly code = "unauthenticated" as const;
  constructor(message = "Unauthenticated") {
    super(message);
    this.name = "UnauthenticatedError";
  }
}

export class ForbiddenError extends Error {
  readonly code = "forbidden" as const;
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}
