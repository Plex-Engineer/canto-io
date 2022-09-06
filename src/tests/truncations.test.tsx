import {
  truncateNumber,
  removeLeadingZeros,
  convertFromScientificNotation,
} from "global/utils/utils";

describe("Testing Truncation Helpers", () => {
  it("should remove leading zeros correctly", () => {
    const testCases = [
      "000000000000",
      "0000000000.10101203",
      "01",
      "0000012.12",
    ];
    const expectedLeadingZerosRemoved = ["0", "0.10101203", "1", "12.12"];
    const testRemovalOfZeros = testCases.map((testCase) =>
      removeLeadingZeros(testCase)
    );
    for (let i = 0; i < testCases.length; i++) {
      expect(testRemovalOfZeros[i]).toBe(expectedLeadingZerosRemoved[i]);
    }
  });

  it("should convert negative scientific notation to regular string", () => {
    const testCases = ["5e-5", "1.98727E-9", "9.00001e-3", "1.0008e-1"];
    const expected = ["0.00005", "0.00000000198727", "0.00900001", "0.10008"];
    const testSciNotation = testCases.map((testCase) =>
      convertFromScientificNotation(testCase)
    );
    for (let i = 0; i < testCases.length; i++) {
      expect(testSciNotation[i]).toBe(expected[i]);
    }
  });

  it("should convert positive scientific notation to regular string", () => {
    const testCases = ["5e5", "1.98727E9", "9.00001e3", "1.0008e1"];
    const expected = ["500000.", "1987270000.", "9000.01", "10.008"];
    const testSciNotation = testCases.map((testCase) =>
      convertFromScientificNotation(testCase)
    );
    for (let i = 0; i < testCases.length; i++) {
      expect(testSciNotation[i]).toBe(expected[i]);
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

  it("should truncate numbers to 2 decimals after the first non-zero value", () => {
    const testCases = [
      "10.0000001",
      "0.00000000091234321",
      "0.1",
      "0000.5129",
      "0005.999E-2",
    ];
    const expectedTruncation = [
      "10.00",
      "0.000000000912",
      "0.1",
      "0.512",
      "0.0599",
    ];
    const testTruncationToZeros = testCases.map((testCase) =>
      truncateNumber(testCase)
    );
    for (let i = 0; i < testCases.length; i++) {
      expect(testTruncationToZeros[i]).toBe(expectedTruncation[i]);
    }
  });
});
