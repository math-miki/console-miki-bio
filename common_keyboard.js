var initsentense = "now you are at console.miki.bio";
var pastConsoleSentenses = "";
var tmpSentense = "";
var currentPath = "/root";
window.onload = function() {
  // define
  console.log(PDIR_CDIR);
  document.onkeydown = keydown;
  var consoleEl = document.getElementById("command_line_context");
  var outputField = document.getElementById("output_console_context");
  // 制御関数
  function keydown(e) {
    if(e.key === 'Enter') {
      analysisCommand();
    } else if(e.key === 'Tab') {
      // disable Tab's default action
      event.preventDefault();
      const commands = tmpSentense.split(" ");
      const predictWord = commands[commands.length-1];
      if(predictWord==='') { return; }
      const expectedList = expectWord(predictWord);
      const expectedPatternCount = expectedList.length;

      if(expectedPatternCount===0) {
        goNewLine("cannot predict from your last command");
      } else if(expectedPatternCount===1) {
        tmpSentense = commands.slice(0,-1).join(" ")+" "+expectedList[0];
        updateConsoleContext();
      } else {

      }
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
    if (!commands[0]) {
      goNewLine();
      return;
    }
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
        cat(commands.slice(1));
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
    /* TODO:
      -a option to show secret files.
     */

     const currentCDir = getCurrentChildDirs();
     const currentCFile = getCurrentChildFiles();
     var output = ""
     if(currentCDir.length>0) {
       output += "> currentChildDirectories: " + currentCDir.join(" ");
     }
     if(currentCFile.length>0) {
       if(output.length>0) {
         output+="<br>"
       }
       output +="> currentAvailableContext: " + currentCFile.join(" ");
     }
     goNewLine(output);
  }
  function cd(optionArr) {
    const options = optionArr.filter(option => option!=='');
    // 'cd miki.bio': jump to miki.bio
    if (options.length===0) {/* TODO:空の処理 */}
    if (options[0]=='miki.bio') {
      window.location.href = 'http://miki.bio';
      return;
    }
    const tmpPath = getTmpPath(options);
    /* tmpPath is the absolute path expressing option's path */
    // const currentCDir = getCurrentChildDirs(tmpPath);
    // const currentCFile = getCurrentChildFiles(tmpPath);
    /* TODO:
      error handling
      if(currentCDir===null && currentCFile===null) {
        var message = "> no such context or directory: " + options[0];
        goNewLine(message);
        return;
      } else {

      }
     */
    const currentCDir = getCurrentChildDirs();
    const currentCFile = getCurrentChildFiles();

    if(currentCDir.includes(options[0])) {
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
    if(getCurrentChildFiles().includes(options[0])) {
      goNewLine("> show " + options[0] + " on the right field");
      const head = '<h2 class="output_title">about '+options[0]+'</h2>';
      const context = FILE_CONTEXT[options[0]];
      console.log(context);
      updateOutputConcole(head + context);
    } else {
      goNewLine('> '+options[0]+": No such file or directory");
    }
  }
  function expectWord(seed) {
    const expectedList = [];
    for (index in Object.keys(PDIR_CDIR)) {
      const dir = Object.keys(PDIR_CDIR)[index];
      console.log(seed);
      const judge = dir.slice(0,seed.length);
      if(judge.toLowerCase() === seed.toLowerCase()&&!(expectedList.includes(dir))&&getCurrentChildDirs().includes(dir)) {
        expectedList.push(dir);
      }
    }
    for (i in Object.values(DIR_FILE)) {
      const fileList = Object.values(DIR_FILE)[i];
      for (j in fileList) {
        file = fileList[j];
        const judge = file.slice(0,seed.length);
        if(judge.toLowerCase() === seed.toLowerCase()&&!(expectedList.includes(file))&&getCurrentChildFiles().includes(file)) {
          expectedList.push(file);
        }
      }
    }
    return expectedList;
  }
  /* ステータス取得 */
  function getCurrentChildDirs() {
  // function getCurrentChildDirs(tmpPath) {
  /* TODO: get tmp child directories from tmpPath */
    const paths = currentPath.split("/");
    const path = paths[paths.length - 1];
    return PDIR_CDIR[path];
  }
  function getCurrentChildFiles() {
  // function getCurrentChildFiles(tmpPath) {
  /* TODO: get tmp child files from tmpPath */
    const paths = currentPath.split("/");
    const path = paths[paths.length - 1];
    return DIR_FILE[path];
  }
  function getTmpPath(option) {
    /* TODO: get absolute path from option(relative path from currentPath) */
      let tmpPath = currentPath;
      if(option[0]==="/") {
        tmpPath = "/root";
      }
      const dirs = option.split("/").filter(element=> element!=='');
      for(let i=0; i<dirs.length; i++){
        const dir = dirs[i];
        if(getCurrentChildDirs(tmpPath).includes(dir)) {
          tmpPath += "/"+dir;
        } else if(dir === "./") {
        } else if(dir === "../") {
          if(tmpPath==="/root") {
            goNewLine("> You cannot go up over the /root");
            return "/root";
          }
        } else {
          /* TODO: no such context or directory: dir */
        }
      }
  }
  /* テキスト挿入処理 */
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
  function updateOutputConcole(outputHTML) {
    current_output = outputField.innerHTML;
    current_output += outputHTML + '<br>';
    outputField.innerHTML = current_output;
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
  |- Interest
  |- Articles

some files are always available
- sns_accounts
- miki.bio
*/
