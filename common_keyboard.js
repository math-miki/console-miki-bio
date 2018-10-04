var initsentense = "now you are at console.miki.bio";
var pastConsoleSentenses = "";
var tmpSentense = "";
var currentPath = "/root";
var currentChild = ["miki.bio", "Profiles"]
var currentAvailableContext = []
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
  /*
  - command analysis
  - textprocessing
  */
  function analysisCommand() {
    // emmit first spaces
    var commands = tmpSentense.split(" ").filter(element=> element!=='');
    // reaching here means something which can be commands typed
    // commands[0] means typed commands
    // commands[1:] means options of commands
    switch(commands[0]) {
      case 'pwd':
        pwd();
        break;
      case 'ls':
        /* TODO:ls */
        ls(commands.slice(1));
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
        goNewLine("> unexpected command: "+commands[0]);
        break;
    }

  }

  /* command functons
  - pwd
  - ls
  - cd
  - cat
  */
  function pwd() { goNewLine(currentPath); }
  function ls(optionArr) {
    const options = optionArr.filter(option => option!=='');
    /* TODO: show currentChild and currentAvailableContext using goNewLine and updateConsoleContext
      msg =
       currentChildDirectories: Profiles Hobies Articles <br>
       currentAvailableContext: sns_accounts
     */
     var output = ""
     if(currentChild.length>0) {
       output += "> currentChildDirectories: " + currentChild.join(" ");
     }
     if(currentAvailableContext.length>0) {
       if(output.length>0) {
         output+="<br>"
       }
       output +="> currentAvailableContext" + currentAvailableContext.join(" ");
     }
     goNewLine(output);
  }
  function cd(optionArr) {
    const options = optionArr.filter(option => option!=='');
    // 'cd miki.bio': jump to miki.bio
    if (options.length===0) {/* TODO:空の処理 */}
    if (options[0]=='miki.bio') {
      window.location.href = 'http://miki.bio';
    }
    if(currentChild.includes(options[0])) {
      changeDirectoryTo(currentPath+"/"+options[0]);
    } else if(options[0]==='./'){
      goNewLine();
    } else if(options[0]==='../') {
      const paths = currentPath.split("/");
      if(paths.length===2 && paths[0]==='') {
        goNewLine("> Here is the root.");
      } else {
        changeDirectoryTo(paths.slice(0,-1).join('/'));
      }
    } else {
      var message = "> no such context or directory: " + options[0];
      goNewLine(message);
      return;
    }
  }
  function cat(optionArr) {
    const options = optionArr.filter(option => option!=='');
    /* TODO: is options[0] included in currentAvailableContext ?
     */
  }

  function updateConsoleContext() {
    consoleEl.innerHTML = pastConsoleSentenses+initsentense+currentPath+' $ '+tmpSentense+'<span id="cursor"></span>'
  }
  function goNewLine(msg) {
    var message='';
    if(msg) {
      message = msg + '<br>';
    }
    pastConsoleSentenses+=initsentense+currentPath+' $ '+tmpSentense+'<br>'+message
    tmpSentense=""
    updateConsoleContext()
  }
  function changeDirectoryTo(newDirectory) {
    pastConsoleSentenses+=initsentense+currentPath+' $ '+tmpSentense+'<br>'
    tmpSentense=""
    currentPath = newDirectory;
    updateConsoleContext()
  }
  function updateCurrentNodeStatus(newDirectory) {
    /* TODO:
      necessary update currentChild and currentAvailableContext
      > hey, first of all, disice structure.
      oh, that's true, my god...
    */

  }
  function updateNodeStatus() {
    /*TODO:
    when changing directory, update current child after these definisiongo
     */
  }
}
/* file-structure

-root
  |- Profiles
      |- basic
      |- as_programmer
  |- Hobies
      |- Coffee
      |- Camera
      |- Tennis
  |- Interst
  |- Articles

some files are always available
- sns_accounts
- miki.bio
*/
