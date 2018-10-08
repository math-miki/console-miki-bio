var initsentense = "now you are at console.miki.bio";
var pastConsoleSentenses = "";
var tmpSentense = "";
var currentPath = "/root";

window.onload = function() {
  // define
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
      console.log(expectedList);
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
    /*
      TODO: now, i can use tab-prediction with all commands.
            prepare list of directories with which tab-prediction can use.
            ex) [ls, cd, cat, ]
            opps, i have the opportunity in all commands...
     */
    if (!commands[0]) {
      goNewLine();
      return;
    }
    switch(commands[0]) {
      case 'pwd':
        pwd();
        break;
      case 'ls':
        ls(commands.slice(1)); /* TODO: commands.slice(1) -> add option -a */
        break;
      case 'cd':
        cd(commands.slice(1)); /* TODO: change to commands[1]. only use directory name( or path and name) */
        break;
      case 'cat':
        cat(commands.slice(1)); /* TODO: change to commands[1]. only use context name( or path and name) */
        break;
      case 'mkdir':
        mkdir(commands[1]); // only new directory name( or path and name)
        break;
      case 'touch':
        touch(commands[1]); // only new file name( or path and name)
        break;
      case 'echo':
        echo(commands.slice(1).join(" "));
        break;
      case 'rm':
        mkdir(commands.slice(1));
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
  - mkdir
  - touch

  + echo
  + rm
  */
  function pwd() { goNewLine(currentPath); }
  function ls(options) {
    // const options = optionArr.split(" ").filter(option => option!=='');
    /* TODO:
      -a option to show secret files.
     */

     // if()
     const tmpPath = getTmpPath(options[0]);
     const currentCDir = getCurrentChildDirs(tmpPath);
     const currentCFile = getCurrentChildFiles(tmpPath);
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
  function cd(options) {
    // const options = optionArr.filter(option => option!=='');
    // 'cd miki.bio': jump to miki.bio

    /*
    TODO: cd ../ in root, ex-lines displayed
     */
    if (options.length===0) {/* TODO:空の処理 */
      goNewLine();
      return;
    }
    if (options[0]=='miki.bio') {
      window.location.href = 'http://miki.bio';
      return;
    }
    const tmpPath = getTmpPath(options[0]);
    /* tmpPath is the absolute path expressing option's path */
    const currentCDir = getCurrentChildDirs(tmpPath);
    // const currentCFile = getCurrentChildFiles(tmpPath);
    /* TODO:
      error handling*/
    if(currentCDir===null /* && currentCFile===null */) {
      var message = "> no such context or directory: " + options[0];
      goNewLine(message);
      return;
    } else {
      changeDirectoryTo(tmpPath);
    }
  }
  function cat(options) {
    /* TODO: is options[0] included in currentAvailableContext ?
    */
    if(options.length===0){
      const msg = "";
      goNewLine(msg);
      return;
    }
    const pathChain = options[0].split("/");
    let path = currentPath;
    let file = ""
    if (pathChain.length>1) {
      path = getTmpPath(pathChain.slice(0,-1).join("/"));
      file = pathChain[pathChain.length-1];
    } else {
      file = pathChain[0];
    }
    if(getCurrentChildFiles(path).includes(file)) {
      goNewLine("> show " + file + " on the right field");
      const head = '<h2 class="output_title">about '+file+'</h2>';
      const context = FILE_CONTEXT[file];
      updateOutputConcole(head + context);
    } else {
      goNewLine('> '+options[0]+": No such file or directory");
    }
  }
  function mkdir(option) {
    /* TODO: */
    const pathChain = option.split("/").filter(element=> element!=='');
    let path = currentPath;
    let newDirName = option;
    if(pathChain.length>1) {
      path = getTmpPath(pathChain.slice(0,-1).join("/"));
      newDirName = pathChain[pathChain.length-1];
    }
    if(path!=null) {
      const dirs = path.split("/");
      const dir = dirs[dirs.length-1];

      if(!(PDIR_CDIR[dir].includes(newDirName))) {
        PDIR_CDIR[dir].push(newDirName);
        PDIR_CDIR[newDirName] = ["miki.bio"];
        DIR_FILE[newDirName] = ["sns"];
        goNewLine("Added new Directory: " + newDirName);
      } else {
        goNewLine(newDirName + ": Directory of this name already exists");
      }
    }
  }
  function touch(option) {
    /* TODO: */
    const pathChain = option.split("/").filter(element=> element!=='');
    let path = currentPath;
    let newFileName = option;
    if(pathChain.length>1) {
      path = getTmpPath(pathChain.slice(0,-1).join("/"));
      newFileName = pathChain[pathChain.length-1];
    }
    /* TODO: under codes are copied from mkdir. update */
    if(path!=null) {
      const dirs = path.split("/");
      const dir = dirs[dirs.length-1];
      if(!(DIR_FILE[dir].includes(newFileName))) {
        DIR_FILE[dir].push(newFileName);
        FILE_CONTEXT[newFileName] = "";
        goNewLine("Added new file: " + newFileName);
      } else {
        goNewLine(newDirName + ": The file of this name already exists");
      }
    }
  }
  function echo(optionArr) {

    /* TODO: split optionArr
      this option includes redirection?
      > fileName: update context of fileName
      >> fileName: add context to fileName

    */
    // REMARK: don't consider the case context includes >>  or >
    let mainpart = "";
    let redirection = "";
    /*
      set flag
      - 0: default. output context on output_console
      - 1: used >. output context by updating file context
      - 2: used >>. output context by adding context to file.
     */
    let flag = 0;

    if(optionArr.includes(">>")) {
      const options = optionArr.split(">>")
      mainpart=options[0];
      redirection=options[1];
      flag = 2;
    } else if(optionArr.includes(">")) {
      const options = optionArr.split(">")
      mainpart=options[0];
      redirection=options[1];
      flag = 1;
    } else {
      mainpart = optionArr;
    }

    /* TODO: code!!!!!*/
    context = "こんてき~"
    if(redirection==="") {
      updateOutputConcole(mainpart);
    } else {
      /* judge outputfile exists */
      // if(not) { touch(outputFile) };
      if(redirection.split("/").length>1) {
        // get tmp path する
      } else {
        if(getCurrentChildFiles("").includes(redirection)) {

        }
      }
      const pathChain = redirection.split("/");
      const redirectionName = pathChain[pathChain.length-1];
      FILE_CONTEXT[redirectionName] += context;

    }
  }
  function rm() {
    /* TODO: */
    havePermittion();
  }
  function expectWord(seed) {
    const pathChain = seed.split("/");
    let passibleDirs = [];
    let passibleFiles = [];
    let file = seed;
    path = currentPath
    console.log(seed);
    console.log(pathChain.slice(0,-1).join("/"));
    if(pathChain.length>1){
      const path = getTmpPath(pathChain.slice(0,-1).join("/"));
      file = pathChain[pathChain.length-1];
    }
    console.log(path);
    console.log(file);
    passibleDirs = getCurrentChildDirs(path);
    passibleFiles = getCurrentChildFiles(path);
    const expectedList = [];
    for (index in passibleDirs) {
      const dir = passibleDirs[index];
      const judge = dir.slice(0,file.length);
      if(judge.toLowerCase() === file.toLowerCase()&&!(expectedList.includes(dir))) {
        expectedList.push(dir);
      }
    }
    console.log(passibleFiles);
    for (i in passibleFiles) {
      const fileName = passibleFiles[i];
      const judge = fileName.slice(0,file.length);
      if(judge.toLowerCase() === file.toLowerCase()&&!(expectedList.includes(fileName))) {
        expectedList.push(fileName);
      }
    }
    return expectedList;
  }
  /* ステータス取得 */
  function getCurrentChildDirs(tmpPath) {
  /* TODO: */

    const _absPath = "";
    if(tmpPath==="") {
      _absPaths = currentPath.split("/");
    } else {
      _absPaths = tmpPath.split("/"); // this path must be Correct
    }
    const check = _absPaths[_absPaths.length - 1];
    return PDIR_CDIR[check];
  }

  function getCurrentChildFiles(tmpPath) {
  /* TODO: */
    const _absPath = "";
    if(tmpPath==="") {
      _absPaths = currentPath.split("/");
    } else {
      _absPaths = tmpPath.split("/"); // this path must be Correct
    }
    const check = _absPaths[_absPaths.length - 1];
    return DIR_FILE[check];
  }

  function getTmpPath(path) {
    /* TODO: */
      if (!(path)) {
        return currentPath
      }
      let tmpPath = currentPath;
      if(path[0]==="/") {
        tmpPath = "/root";
      }
      const dirs = path.split("/").filter(element=> element!=='');
      for(let i=0; i<dirs.length; i++){
        const dir = dirs[i];
        if(getCurrentChildDirs(tmpPath).includes(dir)) {
          tmpPath += "/"+dir;
        } else if(dir === ".") {
        } else if(dir === "..") {
          if(tmpPath==="/root") {
            goNewLine("> You cannot go up over the /root");
            return "/root";
          }
          tmpPath = tmpPath.split("/").slice(0,-1).join("/");
        } else {
          /* TODO: no such context or directory: dir */
          return null;
        }
      }
      return tmpPath;
  }

  /* テキスト挿入処理 */
  function updateConsoleContext() {
    consoleEl.innerHTML = pastConsoleSentenses+initsentense+currentPath+' $ '+tmpSentense+'<span id="cursor"></span>'
    manageCommandLineFrame();
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
    manageCommandLineFrame();
  }

  /* field style management: height and top */
  function manageCommandLineFrame() {
    const commandLineHeight = consoleEl.clientHeight+82;
    const windowHeight = window.outerHeight;
    console.log(commandLineHeight);
    console.log(windowHeight);

    if(commandLineHeight>windowHeight) {
      console.log("a");
      consoleEl.style.top = windowHeight-commandLineHeight;
    }
  }

  function manageOutputFieldFrame() {

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
  |- Interes
  |- Articles

some files are always available
- sns_accounts
- miki.bio
*/
