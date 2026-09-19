export const JOB_POLLING_STATUSES = [
  'queued',
  'waiting',
  'active',
  'delayed',
] as const;

export type JobPollingStatus = (typeof JOB_POLLING_STATUSES)[number];

export const JOB_POLL_INTERVAL_MS = 1500;
export const MAX_JOB_POLL_ATTEMPTS = 120;

export function isJobPollingStatus(
  status: string | undefined | null
): status is JobPollingStatus {
  if (!status) return false;
  return (JOB_POLLING_STATUSES as readonly string[]).includes(status);
}

export function jobPollInterval(
  status: string | undefined | null
): number | false {
  if (!status || isJobPollingStatus(status)) {
    return JOB_POLL_INTERVAL_MS;
  }
  return false;
}
