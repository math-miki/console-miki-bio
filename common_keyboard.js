var initsentense = "now you are at console.miki.bio";
var tmpSentense = "";
var nowPath = "/root";
window.onload = function() {
  // define
  document.onkeydown = keydown;
  var consoleEl = document.getElementById("command_line_context");

  // 制御関数
  function keydown(e) {
    if(e.key === 'Enter') {

    } else if(e.key === 'Backspace') {
      tmpSentense = tmpSentense.slice(0,-1);
      updateConsoleContext();
    } else if(e.key.length === 1) {
      tmpSentense += e.key;
      updateConsoleContext();
    }

  }
  // 処理関数
  function updateConsoleContext() {
    consoleEl.innerHTML = initsentense+nowPath+' $ '+tmpSentense+'<span id="cursor"></span>'
  }
  function generateNewSentense(past, nextPath) {
    return past + "<br>" + nextPath + '<span id="cursor"></span>'
  }
}
