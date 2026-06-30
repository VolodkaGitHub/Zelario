export interface DailyLoginStatus {
  eligible: boolean;
  lastClaimDate: string | null;
  rewardAmount: number;
}

export interface ClaimResult {
  rewardAmount: number;
  claimDate: string;
}
