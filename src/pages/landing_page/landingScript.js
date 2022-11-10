export function openLink(input) {
  switch (input) {
    case "0":
      window.open("/bridge", "_self");
      // alert();
      break;
    case "1":
      window.open("/staking", "_self");
      // alert();
      break;
    case "4":
      window.open("/governance", "_self");
      // alert();
      break;
    case "2":
      window.open("/lp", "_self");
      // alert();
      break;
    case "3":
      window.open("/lending", "_self");
      // alert();
      break;
    case "6":
    case "7":
      window.open(
        "https://canto.gitbook.io/canto/overview/about-canto",
        "_self"
      );
      break;
    default:
      document.querySelector("#error").style.display = "block";
      setTimeout(() => {
        document.querySelector("#error").style.display = "none";
      }, 3000);
  }
}
