export function openLink(input) {
  switch (input) {
    case "1":
      window.open("https://bridge.canto.io", "_self");
      // alert();
      break;
    case "2":
      window.open("https://convert.canto.io", "_self");
      // alert();
      break;
    case "3":
      window.open("https://staking.canto.io", "_self");
      // alert();
      break;
    case "4":
      window.open("https://lp.canto.io", "_self");
      // alert();
      break;
    case "5":
      window.open("https://lending.canto.io", "_self");
      // alert();
      break;
    case "6":
      window.open("https://governance.canto.io", "_self");
      // alert();
      break;
    case "7":
      window.open(
        "https://canto.gitbook.io/canto/overview/about-canto",
        "_self"
      );
      break;
    default:
      alert(true);
  }
}
