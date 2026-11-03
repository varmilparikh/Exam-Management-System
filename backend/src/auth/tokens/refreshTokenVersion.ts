export function isRefreshTokenVersionCurrent(
  tokenVersion: number | undefined,
  currentVersion: number,
): boolean {
  return (tokenVersion ?? 0) === currentVersion;
}
