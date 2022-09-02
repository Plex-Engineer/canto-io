const userInput = document.querySelector("#inputData");
const userClickRoute = document.querySelector("#routes")
let showingCursor = false;
function blinkAnimation() {
  setTimeout(function () {
    showingCursor = !showingCursor;
    let input = userInput.value.toString().replace("█", "");
    userInput.value = input + (showingCursor ? "█" : "");
    if (true) {
      blinkAnimation();
    }
  }, 400);
}

// userInput.addEventListener("keypress",function(){
//     console.log(this.value)
//     let input = userInput.value.toString().replace("█","");

//     userInput.value =  input + "█";
// })

userClickRoute.addEventListener("click", function (event) {
  openLink(event.path[1].id);
})

userInput.addEventListener("change", function () {
  let input = userInput.value.toString().replace("█", "");
  openLink(input);
});
// blinkAnimation();
function alert(val) {
  userInput.value = "";

  document.querySelector(val ? "#error" : "#warning").style.display = "block";
  setTimeout(() => {
    document.querySelector(val ? "#error" : "#warning").style.display = "none";
  }, 3000);
}
const typing = document.querySelector(".typing");
const text = typing.innerHTML;
let i = 1;
function typer() {
  setTimeout(function () {
    if (window.screen.width < 600)
      typing.innerHTML =
        `<span >${text.substring(0, i)}</span>_` +
        `<span style="color:#494949; text-shadow : none">${text.substring(
          i,
          text.length
        )}</span>`;
    else {
      typing.innerHTML =
        `<span >${text.substring(0, i)}</span>_` +
        `<span style="color:transparent; text-shadow : none">${text.substring(
          i,
          text.length
        )}</span>`;
    }
    i++;
    if (i < text.length) {
      typer();
    }
  }, 50);
}
typer();

function openLink(input) {
  switch (input) {
    case "1":
      window.open("https://bridge.canto.io","_self");
      // alert();
      break;
    case "2":
      window.open("https://convert.canto.io","_self");
      // alert();
      break;
    case "3":
      window.open("https://staking.canto.io","_self");
      // alert();
      break;
    case "4":
      window.open("https://lp.canto.io","_self");
      // alert();
      break;
    case "5":
      window.open("https://lending.canto.io","_self");
      // alert();
      break;
    case "6":
      window.open("https://governance.canto.io","_self");
      // alert();
      break;
    case "7":
      window.open("https://canto.gitbook.io/canto/overview/about-canto","_self");
      break;
    default:
      alert(true);
  }
}
