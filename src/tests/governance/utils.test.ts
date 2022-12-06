import { VotingOption } from "pages/governance/config/interfaces";
import {
  convertDateToString,
  convertToVoteNumber,
} from "pages/governance/utils/formattingStrings";

test("formatting dates correctly", () => {
  const testCases = [
    {
      dateString: "8/18/2022 12:53:22 PM",
      expected: "8.18.2022 : 12:53:22 PM",
    },
    // {
    //   dateString: "2022-08-01T16:17:29.164673974Z",
    //   expected: "8.1.2022 : 12:17:29 PM",
    // },
  ];
  const test = testCases.map((testCase) =>
    convertDateToString(testCase.dateString)
  );
  for (let i = 0; i < testCases.length; i++) {
    expect(test[i]).toBe(testCases[i].expected);
  }
});

test("converting votes to numbers", () => {
  const testCases = [
    { vote: VotingOption.YES, expected: 1 },
    { vote: VotingOption.ABSTAIN, expected: 2 },
    { vote: VotingOption.NO, expected: 3 },
    { vote: VotingOption.VETO, expected: 4 },
    { vote: 5, expected: 0 },
    { vote: 10, expected: 0 },
  ];
  const test = testCases.map((testCase) => convertToVoteNumber(testCase.vote));
  for (let i = 0; i < testCases.length; i++) {
    expect(test[i]).toBe(testCases[i].expected);
  }
});
