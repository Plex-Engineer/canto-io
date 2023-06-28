import {
  truncateNumber,
  removeLeadingZeros,
  convertFromScientificNotation,
} from "global/utils/formattingNumbers";

describe("Testing Truncation Helpers", () => {
  it("should remove leading zeros correctly", () => {
    const testCases = [
      { number: "000000000000", expected: "0" },
      { number: "0000000000.10101203", expected: "0.10101203" },
      { number: "01", expected: "1" },
      { number: "0000012.12", expected: "12.12" },
    ];
    const testRemovalOfZeros = testCases.map((testCase) =>
      removeLeadingZeros(testCase.number)
    );
    for (let i = 0; i < testCases.length; i++) {
      expect(testRemovalOfZeros[i]).toBe(testCases[i].expected);
    }
  });

  it("should convert negative scientific notation to regular string", () => {
    const testCases = [
      { number: "5e-5", expected: "0.00005" },
      { number: "1.98727E-9", expected: "0.00000000198727" },
      { number: "9.00001e-3", expected: "0.00900001" },
      { number: "1.0008e-1", expected: "0.10008" },
    ];
    const testSciNotation = testCases.map((testCase) =>
      convertFromScientificNotation(testCase.number)
    );
    for (let i = 0; i < testCases.length; i++) {
      expect(testSciNotation[i]).toBe(testCases[i].expected);
    }
  });

  it("should convert positive scientific notation to regular string", () => {
    const testCases = [
      { number: "5e5", expected: "500000." },
      { number: "1.98727E9", expected: "1987270000." },
      { number: "9.00001e3", expected: "9000.01" },
      { number: "1.0008e1", expected: "10.008" },
    ];

    const testSciNotation = testCases.map((testCase) =>
      convertFromScientificNotation(testCase.number)
    );
    for (let i = 0; i < testCases.length; i++) {
      expect(testSciNotation[i]).toBe(testCases[i].expected);
    }
  });
});
describe("Testing Truncation", () => {
  it("should truncate numbers to expected decimals", () => {
    const testCases = [
      "10.0000002",
      "0000000000009",
      "1.0000000000000000001",
      "18988990.1234567890123456789999",
      "0.0000000000000",
      "1.12345678901234567890123456E18",
      "1E-18",
    ];
    const expectedTruncationTo18 = [
      "10.0000002",
      "9",
      "1.000000000000000000",
      "18988990.123456789012345678",
      "0",
      "1123456789012345678.90123456",
      "0.000000000000000001",
    ];
    const expectedTruncationTo6 = [
      "10.000000",
      "9",
      "1.000000",
      "18988990.123456",
      "0",
      "1123456789012345678.901234",
      "0.000000",
    ];
    const testTruncationTo18 = testCases.map((testCase) =>
      truncateNumber(testCase, 18)
    );
    const testTruncationTo6 = testCases.map((testCase) =>
      truncateNumber(testCase, 6)
    );
    for (let i = 0; i < testCases.length; i++) {
      expect(testTruncationTo18[i]).toBe(expectedTruncationTo18[i]);
      expect(testTruncationTo6[i]).toBe(expectedTruncationTo6[i]);
    }
  });

  it("should truncate numbers to 2 decimals after the first non-zero value (or show zero if too many decimals)", () => {
    const testCases = [
      "10.0000001",
      "0.00000000091234321",
      "0.1",
      "0000.5129",
      "0005.999E-2",
    ];
    const expectedTruncation = ["10.00", "0.00", "0.1", "0.512", "0.0599"];
    const testTruncationToZeros = testCases.map((testCase) =>
      truncateNumber(testCase)
    );
    for (let i = 0; i < testCases.length; i++) {
      expect(testTruncationToZeros[i]).toBe(expectedTruncation[i]);
    }
  });
});
