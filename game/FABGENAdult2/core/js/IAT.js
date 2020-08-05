let template = {
  name: "Gender",
  showResult: "noshow",
  IATtype: "two",
  catA: {
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
  catB: {
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
  cat1: {
    label: "Genius",
    datalabel: "G",
    itemtype: "txt",
    items: ["genius", "brilliant", "brainy", "gifted", "super-smart"],
  },
  cat2: {
    label: "Diligent",
    datalabel: "D",
    itemtype: "txt",
    items: ["diligent", "dedicated", "driven", "persistent", "hard-working"],
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
  document.title = "FABGENAdult2";
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
  if (Math.random() < 0.5) {
    openA = "<font color=green>";
    closeA = "</font>";
    open1 = "";
    close1 = "";
  } else {
    open1 = "<font color=green>";
    close1 = "</font>";
    openA = "";
    closeA = "";
  }
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
  if (template.catB.itemtype == "img") {
    for (i in template.catB.items) {
      var itemstr =
        '<img id="' +
        template.catB.datalabel +
        i +
        '" class="IATitem" src="templates/' +
        template.name +
        "/img/" +
        template.catB.items[i] +
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
  for (var i = 0; i < 7; i++) {
    roundArray[i] = [];
    switch (i) {
      case 0:
      case 4:
        stype = "target";
        numrounds = 20;
        break;
      case 1:
        stype = "association";
        numrounds = 20;
        break;
      case 2:
      case 3:
      case 5:
      case 6:
        stype = "both";
        numrounds = 40;
        break;
    }

    let imgItemA = [];
    let imgItemB = [];
    let txtItem1 = [];
    let txtItem2 = [];

    let math = 0;
    let reading = 0;

    for (var j = 0; j < numrounds; j++) {
      var round = new IATround();

      if (stype == "target") {
        let picker = Math.random();
        if (math < 8 && reading < 8) {
          if (picker < 0.5) {
            round.category = template.catA.datalabel;
            math++;
          } else {
            round.category = template.catB.datalabel;
            reading++;
          }
        } else if (math == 8 && reading < 8) {
          round.category = template.catB.datalabel;
          reading++;
        } else if (math < 8 && reading == 8) {
          round.category = template.catA.datalabel;
          math++;
        } else {
          round.category =
            picker < 0.5 ? template.catA.datalabel : template.catB.datalabel;
        }
      } else if (stype == "association") {
        round.category =
          Math.random() < 0.5
            ? template.cat1.datalabel
            : template.cat2.datalabel;
      } else if (stype == "both") {
        if (j % 2 == 0) {
          round.category =
            Math.random() < 0.5
              ? template.catA.datalabel
              : template.catB.datalabel;
        } else {
          round.category =
            Math.random() < 0.5
              ? template.cat1.datalabel
              : template.cat2.datalabel;
        }
      }
      // pick a category
      // catA
      if (round.category == template.catA.datalabel) {
        round.itemtype = template.catA.itemtype;
        if (i < 4) {
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
      // catB
      else if (round.category == template.catB.datalabel) {
        round.itemtype = template.catB.itemtype;
        if (i < 4) {
          round.correct = 2;
        } else {
          round.correct = 1;
        }

        do {
          round.catIndex = Math.floor(
            Math.random() * template.catB.items.length
          );
        } while (
          // condition
          round.catIndex == imgItemB[imgItemB.length - 1] ||
          (imgItemB.length < template.catB.items.length &&
            imgItemB.includes(round.catIndex))
        );

        imgItemB.push(round.catIndex);
      }
      // cat1
      else if (round.category == template.cat1.datalabel) {
        round.itemtype = template.cat1.itemtype;
        round.correct = 1;

        do {
          round.catIndex = Math.floor(
            Math.random() * template.cat1.items.length
          );
        } while (
          // condition
          round.catIndex == txtItem1[txtItem1.length - 1] ||
          (txtItem1.length < template.cat1.items.length &&
            txtItem1.includes(round.catIndex))
        );

        txtItem1.push(round.catIndex);
      }
      // cat2
      else if (round.category == template.cat2.datalabel) {
        round.itemtype = template.cat2.itemtype;
        round.correct = 2;

        do {
          round.catIndex = Math.floor(
            Math.random() * template.cat2.items.length
          );
        } while (
          // condition
          round.catIndex == txtItem2[txtItem2.length - 1] ||
          (txtItem2.length < template.cat2.items.length &&
            txtItem2.includes(round.catIndex))
        );

        txtItem2.push(round.catIndex);
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
      $("#left_cat").ready(function () {
        $("#left_cat").html(openA + template.catA.label + closeA);
      });
      $("#right_cat").ready(function () {
        $("#right_cat").html(openA + template.catB.label + closeA);
      });
      break;
    case 1:
      $("#left_cat").html(open1 + template.cat1.label + close1);
      $("#right_cat").html(open1 + template.cat2.label + close1);
      break;
    case 2:
    case 3:
      $("#left_cat").html(
        openA +
          template.catA.label +
          closeA +
          "<br>or<br>" +
          open1 +
          template.cat1.label +
          close1
      );
      $("#right_cat").html(
        openA +
          template.catB.label +
          closeA +
          "<br>or<br>" +
          open1 +
          template.cat2.label +
          close1
      );
      break;
    case 4:
      $("#left_cat").html(openA + template.catB.label + closeA);
      $("#right_cat").html(openA + template.catA.label + closeA);
      break;
    case 5:
    case 6:
      $("#left_cat").html(
        openA +
          template.catB.label +
          closeA +
          "<br>or<br>" +
          open1 +
          template.cat1.label +
          close1
      );
      $("#right_cat").html(
        openA +
          template.catA.label +
          closeA +
          "<br>or<br>" +
          open1 +
          template.cat2.label +
          close1
      );
      break;
  }
  if (session == 7) {
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
    category: "FABGENAdult2",
    folderID: "1o5g9KcpaL4w6nAUdcjktAsH29KI295ej",
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

// Get the stimulus for this session & round and display it
function displayItem() {
  var tRound = roundArray[session][roundnum];
  tRound.starttime = new Date().getTime(); // the time the item was displayed
  if (tRound.itemtype == "img") {
    if (tRound.category == template.catA.datalabel) {
      $("#" + template.catA.datalabel + tRound.catIndex).css(
        "display",
        "block"
      );
    } else if (tRound.category == template.catB.datalabel) {
      $("#" + template.catB.datalabel + tRound.catIndex).css(
        "display",
        "block"
      );
    } else if (tRound.category == template.cat1.datalabel) {
      $("#" + template.cat1.datalabel + tRound.catIndex).css(
        "display",
        "block"
      );
    } else if (tRound.category == template.cat2.datalabel) {
      $("#" + template.cat2.datalabel + tRound.catIndex).css(
        "display",
        "block"
      );
    }
  } else if (tRound.itemtype == "txt") {
    if (tRound.category == template.catA.datalabel) {
      $("#word").html(openA + template.catA.items[tRound.catIndex] + closeA);
      $("#word").css("display", "block");
    } else if (tRound.category == template.catB.datalabel) {
      $("#word").html(openA + template.catB.items[tRound.catIndex] + closeA);
      $("#word").css("display", "block");
    } else if (tRound.category == template.cat1.datalabel) {
      $("#word").html(open1 + template.cat1.items[tRound.catIndex] + close1);
      $("#word").css("display", "block");
    } else if (tRound.category == template.cat2.datalabel) {
      $("#word").html(open1 + template.cat2.items[tRound.catIndex] + close1);
      $("#word").css("display", "block");
    }
  }
}

function runSession(kEvent) {
  var rCorrect = roundArray[session][roundnum].correct;
  var unicode = kEvent.keyCode ? kEvent.keyCode : kEvent.charCode;
  keyE = unicode == 69 || unicode == 101;
  keyI = unicode == 73 || unicode == 105;

  // if correct key (1 & E) or (2 & I)
  if ((rCorrect == 1 && keyE) || (rCorrect == 2 && keyI)) {
    $("#wrong").css("display", "none"); // remove X if it exists
    roundArray[session][roundnum].endtime = new Date().getTime(); // end time
    // if more rounds
    if (roundnum < roundArray[session].length - 1) {
      roundnum++;
      $(".IATitem").css("display", "none"); // hide all items
      displayItem(); // display chosen item
    } else {
      $(".IATitem").css("display", "none"); // hide all items
      currentState = "instruction"; // change state to instruction
      session++; // move to next session
      roundnum = 0; // reset rounds to 0
      instructionPage(); // show instruction page
    }
  }
  // incorrect key
  else if ((rCorrect == 1 && keyI) || (rCorrect == 2 && keyE)) {
    $("#wrong").css("display", "block"); // show X
    roundArray[session][roundnum].errors++; // note error
  }
}
