import { VotingOption } from "../config/interfaces";

export function convertDateToString(dateString: string) {
  const date = new Date(dateString);
  return (
    date.toLocaleDateString().replace(/[/]/g, ".") +
    " : " +
    date.toLocaleTimeString()
  );
}

export function convertToVoteNumber(option: VotingOption): number {
  switch (option) {
    case VotingOption.YES:
      return 1;
    case VotingOption.ABSTAIN:
      return 2;
    case VotingOption.NO:
      return 3;
    case VotingOption.VETO:
      return 4;
    default:
      return 0;
  }
}

export function convertVoteNumberToString(option: VotingOption): string {
  switch (option) {
    case VotingOption.YES:
      return "yes";
    case VotingOption.ABSTAIN:
      return "abstain";
    case VotingOption.NO:
      return "no";
    case VotingOption.VETO:
      return "veto";
    default:
      return "none";
  }
}
