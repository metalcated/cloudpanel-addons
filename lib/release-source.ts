// A release binds its updater and provenance policy to its build repository.
// Development retains upstream's fixture identity; a compiled fork cannot be
// redirected back to upstream by a service environment variable.
declare const CLP_ADDONS_REPOSITORY: string | undefined;
export const RELEASE_REPO = typeof CLP_ADDONS_REPOSITORY === "string"
  ? CLP_ADDONS_REPOSITORY
  : "7heMech/cloudpanel-addons";
