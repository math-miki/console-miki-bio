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
      analysisCommand();
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
  function analysisCommand() {
    // emmit first spaces
    var commands = tmpSentense.split(" ").filter(element=> element!=='');
    // reaching here means something which can be commands typed
    // commands[0] means typed commands
    // commands[1:] means options of commands
    switch(commands[0]) {
      case 'ls':
        /* TODO:ls */
        break;
      case 'cd':
        /* TODO:cd */
        cd(commands.slice(1));
        break;
      case 'cat':
        /* TODO:cat */
        break;
      default:
        // command didn't make any sense
        /* TODO:byebye */
        break;
    }


  }
  function generateNewSentense(past, nextPath) {
    return past + "<br>" + nextPath + '<span id="cursor"></span>'
  }
  /* command functons
  - ls
  - cd
  - cat
  */
  function ls(optionArr) {
    const options = optionArr.filter(option => option!=='');

  }
  function cd(optionArr) {
    const options = optionArr.filter(option => option!=='');
    // 'cd miki.bio': jump to miki.bio
    if (options.length===0) {/* TODO:空の処理 */}
    if (options[0]=='miki.bio') {
      window.location.href = 'http://miki.bio';
    }
  }
  function cat(optionArr) {
    const options = optionArr.filter(option => option!=='');

  }
}
