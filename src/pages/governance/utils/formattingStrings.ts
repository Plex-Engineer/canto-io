export function convertDateToString(dateString: string) {
  return (
    new Date(dateString).toLocaleDateString().replaceAll("/", ".") +
    " : " +
    new Date(dateString).toLocaleTimeString()
  );
}

export function convertToVoteNumber(option: string): number {
  switch (option) {
    case "yes":
      return 1;
    case "abstain":
      return 2;
    case "no":
      return 3;
    case "veto":
      return 4;
    default:
      return 0;
  }
}
