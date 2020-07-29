let template = {
  name: "Gender",
  catA: {
    label: "Genius",
    datalabel: "G",
    itemtype: "img",
    items: [
      "g1.jpg",
      "g2.jpg",
      "g3.jpg",
      "g4.jpg",
      "g5.jpg",
    ],
  },
  cat1: {
    label: "Male",
    datalabel: "M",
    itemtype: "img",
    items: [
      "m1.jpg",
      "m2.jpg",
      "m3.jpg",
      "m4.jpg",
      "m5.jpg",
      "m6.jpg",
      "m7.jpg",
      "m8.jpg",
    ],
  },
  cat2: {
    label: "Female",
    datalabel: "F",
    itemtype: "img",
    items: [
      "f1.jpg",
      "f2.jpg",
      "f3.jpg",
      "f4.jpg",
      "f5.jpg",
      "f6.jpg",
      "f7.jpg",
      "f8.jpg",
    ],
},
};

//Generate subject ID
function randomString(length) {
  var chars = "123456789";
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars.charAt(Math.floor(Math.random() * (chars.length - 1)));
  return result;
}

//Initialize program
function initialize() {
  document.title = "SCGENAdult2_exp";
  $.get("core/instruct0.html", function (data) {
    $("#instructions").html(data);
    var subjID = randomString(10);
    $("#subID").val(subjID);
  });
}

//Instruction pages
function loadInstructions(stage) {
  switch (stage) {
    case "one":
      sub = $("#subID").val();
      if (sub.search("/[^a-zA-Z0-9]/g") == -1) {
        $.get("core/instruct1.html", function (data) {
          $("#instructions").html(data);
        });
      } else {
        alert("Please enter a valid subject ID");
      }
      break;
    case "two":
      $.get("core/instruct2.html", function (data) {
        $("#instructions").html(data);
      });
      break;
    case "IAT":
      $.get("core/IAT.html", function (data) {
        $("body").html(data);
        document.onkeypress = keyHandler;
        startIAT();
      });
      break;
  }
}

// Initialize variables, build page & data object, display instructions
function startIAT() {
  currentState = "instruction";
  session = 0;
  roundnum = 0;

  // make the target or association words green
  open1 = "";
    close1 = "";
    openA = "";
    closeA = "";
  buildPage();
  roundArray = initRounds();
  instructionPage();
}

// Adds all images to page (initially hidden) so they are pre-loaded for IAT
function buildPage() {
  if (template.catA.itemtype == "img") {
    for (i in template.catA.items) {
      var itemstr =
        '<img id="' +
        template.catA.datalabel +
        i +
        '" class="IATitem" src="templates/' +
        template.name +
        "/img/" +
        template.catA.items[i] +
        '">';
      $("#exp_instruct").after(itemstr);
    }
  }
  if (template.cat1.itemtype == "img") {
    for (i in template.cat1.items) {
      var itemstr =
        '<img id="' +
        template.cat1.datalabel +
        i +
        '" class="IATitem" src="templates/' +
        template.name +
        "/img/" +
        template.cat1.items[i] +
        '">';
      $("#exp_instruct").after(itemstr);
    }
  }
  if (template.cat2.itemtype == "img") {
    for (i in template.cat2.items) {
      var itemstr =
        '<img id="' +
        template.cat2.datalabel +
        i +
        '" class="IATitem" src="templates/' +
        template.name +
        "/img/" +
        template.cat2.items[i] +
        '">';
      $("#exp_instruct").after(itemstr);
    }
  }
}

// Round object
function IATround() {
  this.starttime = 0;
  this.endtime = 0;
  this.itemtype = "none";
  this.category = "none";
  this.catIndex = 0;
  this.correct = 0;
  this.errors = 0;
}

// Create array for each session & round, with pre-randomized ordering of images
function initRounds() {
  var roundArray = [];
  // for each session
  for (var i = 0; i < 4; i++) {
    roundArray[i] = [];
    switch (i) {
      case 0:
        stype = "ic";
        numrounds = 24;
        break;
      case 1:
        stype = "ic";
        numrounds = 72;
        break;
      case 2:
        stype = "ci";
        numrounds = 24;
        break;
      case 3:
        stype = "ci";
        numrounds = 72;
        break;
    }

    let imgItemA = [];
    let imgItem1 = [];
    let imgItem2 = [];

    let geniusCount = 0;
    let maleCount = 0;
    let femaleCount = 0;

    //Init rounds
    for (var j = 0; j < numrounds; j++) {
      var round = new IATround();
      let picker = Math.floor(Math.random() * 3);

      //Change count number based on number of rounds
      let roundType = { eight: 8};
      if (numrounds == 72) {
        roundType = { eight: 24};
      }

      //Congruent-first
      if (stype == "ci") {
        //Pick genius
        if (picker == 0) {
          if (geniusCount < roundType.eight) {
            round.category = template.catA.datalabel;
            geniusCount++;
          } else if (femaleCount < roundType.eight) {
            round.category = template.cat2.datalabel;
            femaleCount++;
          } else {
            round.category = template.cat1.datalabel;
            maleCount++;
          }
        }
        //Pick female
        else if (picker == 1){
          if (femaleCount < roundType.eight) {
            round.category = template.cat2.datalabel;
            femaleCount++;
          } else if (geniusCount < roundType.eight) {
            round.category = template.catA.datalabel;
            geniusCount++;
          } else {
            round.category = template.cat1.datalabel;
            maleCount++;
          }
        }
        //Pick male
        else  {
          if (maleCount < roundType.eight) {
            round.category = template.cat1.datalabel;
            maleCount++;
          } else if (geniusCount < roundType.eight) {
            round.category = template.catA.datalabel;
            geniusCount++;
          } else {
            round.category = template.cat2.datalabel;
            femaleCount++;
          }
        }
      }
      //Incongruent-first
      if (stype == "ic") {
        //Pick genius
        if (picker == 0) {
          if (geniusCount < roundType.eight) {
            round.category = template.catA.datalabel;
            geniusCount++;
          } else if (maleCount < roundType.eight) {
            round.category = template.cat1.datalabel;
            maleCount++;
          } else {
            round.category = template.cat2.datalabel;
            femaleCount++;
          }
        }
        //Pick male
        else if (picker == 1){
          if (maleCount < roundType.eight) {
            round.category = template.cat1.datalabel;
            maleCount++;
          } else if (geniusCount < roundType.eight) {
            round.category = template.catA.datalabel;
            geniusCount++;
          } else {
            round.category = template.cat2.datalabel;
            femaleCount++;
          }
        }
        //Pick female
        else  {
          if (femaleCount < roundType.eight) {
            round.category = template.cat2.datalabel;
            femaleCount++;
          } else if (geniusCount < roundType.eight) {
            round.category = template.catA.datalabel;
            geniusCount++;
          } else {
            round.category = template.cat1.datalabel;
            maleCount++;
          }
        }
      }

      // catA
      if (round.category == template.catA.datalabel) {
        round.itemtype = template.catA.itemtype;
        if (i < 2) {
          round.correct = 1;
        } else {
          round.correct = 2;
        }

        do {
          round.catIndex = Math.floor(
            Math.random() * template.catA.items.length
          );
        } while (
          // condition
          round.catIndex == imgItemA[imgItemA.length - 1] ||
          (imgItemA.length < template.catA.items.length &&
            imgItemA.includes(round.catIndex))
        );

        imgItemA.push(round.catIndex);
      }

      // cat1
      else if (round.category == template.cat1.datalabel) {
        round.itemtype = template.cat1.itemtype;
        round.correct = 2;

        do {
          round.catIndex = Math.floor(
            Math.random() * template.cat1.items.length
          );
        } while (
          // condition
          round.catIndex == imgItem1[imgItem1.length - 1] ||
          (imgItem1.length < template.cat1.items.length &&
            imgItem1.includes(round.catIndex))
        );

        imgItem1.push(round.catIndex);
      }

      // cat2
      else if (round.category == template.cat2.datalabel) {
        round.itemtype = template.cat2.itemtype;
        round.correct = 1;

        do {
          round.catIndex = Math.floor(
            Math.random() * template.cat2.items.length
          );
        } while (
          // condition
          round.catIndex == imgItem2[imgItem2.length - 1] ||
          (imgItem2.length < template.cat2.items.length &&
            imgItem2.includes(round.catIndex))
        );

        imgItem2.push(round.catIndex);
      }

      roundArray[i].push(round);
    }
  }

  return roundArray;
}

// insert instruction text based on stage in IAT
function instructionPage() {
  switch (session) {
    case 0:
    case 1:
      $("#left_cat").ready(function () {
        $("#left_cat").html(
          openA +
            template.cat2.label +
            closeA +
            "<br>or<br>" +
            open1 +
            template.catA.label +
            close1
        );
      });
      $("#right_cat").ready(function () {
        $("#right_cat").html(openA + template.cat1.label + closeA);
      });
      break;
    case 2:
    case 3:
      $("#left_cat").html(openA + template.cat2.label + closeA);
      $("#right_cat").html(
        openA +
          template.cat1.label +
          closeA +
          "<br>or<br>" +
          open1 +
          template.catA.label +
          close1
      );
      break;
  }
  if (session == 4) {
    $("#left_cat").html("");
    $("#right_cat").html("");
    $("#exp_instruct").html("<img src='core/spinner.gif'>");

    writeFile();

    resulttext =
      "<div style='text-align:center;padding:20px'>Thank you for participating in our study!</div>";
    $("#picture_frame").html(resulttext);
  } else {
    $.get("core/gInstruct" + (session + 1) + ".html", function (data) {
      $("#exp_instruct").html(data);
    });
  }
}

function IsNumeric(input) {
  return input - 0 == input && input.length > 0;
}

// Convert roundArray to proper format and
// send data to server to upload to google sheet
function writeFile() {
  let ID = sub;
  ID = ID.length == 0 ? "unknown" : ID;

  let dataArray = [];
  for (let i = 0; i < roundArray.length; i++) {
    for (let j = 0; j < roundArray[i].length; j++) {
      let a = i;
      let b = j;
      let c = roundArray[i][j].category;
      let d = roundArray[i][j].catIndex;
      let e = roundArray[i][j].errors;
      let f = roundArray[i][j].endtime - roundArray[i][j].starttime;
      dataArray.push([a, b, c, d, e, f]);
    }
  }

  let final = JSON.stringify({
    category: "SCGENAdult2_exp",
    folderID: "1Km7cW8JSP9ZaSF7K6wePOSuSzOp9x7r2",
    name: ID,
    data: dataArray,
  });

  fetch("http://157.230.252.224:5001/post", {
    method: "post",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: final,
  });
}

// This monitors for keyboard events
function keyHandler(kEvent) {
  // move from instructions to session on spacebar press
  var unicode;
  if (!kEvent) var kEvent = window.event;
  if (kEvent.keyCode) unicode = kEvent.keyCode;
  else if (kEvent.which) unicode = kEvent.which;
  if (currentState == "instruction" && unicode == 32) {
    currentState = "play";
    $("#exp_instruct").html("");
    displayItem();
  }
  // in session
  if (currentState == "play") {
    runSession(kEvent);
  }
}

let message;
function warningMsg() {
  clearTimeout(message);
  message = setTimeout(function () {
    $("#warning").css("display", "block");
  }, 3000);
}

// Get the stimulus for this session & round and display it
function displayItem() {
  var tRound = roundArray[session][roundnum];
  tRound.starttime = new Date().getTime(); // the time the item was displayed

  $("#warning").css("display", "none");
    if (tRound.category == template.catA.datalabel) {
      $("#" + template.catA.datalabel + tRound.catIndex).css(
        "display",
        "block"
        );
      }
      if (tRound.category == template.cat1.datalabel) {
      $("#" + template.cat1.datalabel + tRound.catIndex).css(
        "display",
        "block"
        );
      }
   if (tRound.category == template.cat2.datalabel) {
    $("#" + template.cat2.datalabel + tRound.catIndex).css(
      "display",
      "block"
      );
    }

  warningMsg();
}

function runSession(kEvent) {
  var rCorrect = roundArray[session][roundnum].correct;
  var unicode = kEvent.keyCode ? kEvent.keyCode : kEvent.charCode;
  keyE = unicode == 69 || unicode == 101;
  keyI = unicode == 73 || unicode == 105;

  // if correct key (1 & E) or (2 & I)
  if ((rCorrect == 1 && keyE) || (rCorrect == 2 && keyI)) {
    roundArray[session][roundnum].endtime = new Date().getTime(); // end time

    $("#warning").css("display", "none");
    $("#wrong").css("display", "none"); // remove X if it exists
    $("#correct").css("display", "block"); //display correct

    setTimeout(function () {
      // if more rounds
      if (roundnum < roundArray[session].length - 1) {
        $("#correct").css("display", "none");
        roundnum++;
        $(".IATitem").css("display", "none"); // hide all items
        clearTimeout(message);
        displayItem(); // display chosen item
      } else {
        $("#correct").css("display", "none");
        $(".IATitem").css("display", "none"); // hide all items
        currentState = "instruction"; // change state to instruction
        session++; // move to next session
        roundnum = 0; // reset rounds to 0
        clearTimeout(message);
        instructionPage(); // show instruction page
      }
    }, 150);
  }
  // incorrect key
  else if ((rCorrect == 1 && keyI) || (rCorrect == 2 && keyE)) {
    clearTimeout(message);
    $("#warning").css("display", "none");
    $("#wrong").css("display", "block"); // show X
    roundArray[session][roundnum].errors++; // note error
  }
}