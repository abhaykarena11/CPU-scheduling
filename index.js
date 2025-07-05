const out = document.getElementById("output");
const AvgData = document.getElementById("add-data");
function start() {
  const scheduleType = document.getElementById("schedual-type").value;
  const arrivalInput = document.getElementById("a.t").value.trim();
  const burstInput = document.getElementById("b.t").value.trim();

  const arrivalArr = arrivalInput.split(",");
  const burstArr = burstInput.split(",");

  // Basic input validation
  if (arrivalArr.length !== burstArr.length) {
    alert("Yoops! Invalid INPUT: Arrival and Burst lengths mismatch.");
    return;
  }

  const hasNegative = arrivalArr.some((time) => time < 0);
  const hasNegativeBurst = burstArr.some((time) => time <= 0);

  if (hasNegative || hasNegativeBurst) {
    alert("Yoops! Invalid INPUT");
    return;
  }
  AvgData.style.display = "block";
  out.style.display = "block";

  switch (scheduleType) {
    case "FCFS":
      FCFS(arrivalArr, burstArr);
      break;

    case "SJF":
      SJF(arrivalArr, burstArr);
      break;

    case "SRTF":
      SRTF(arrivalArr, burstArr);
      break;

    case "RR":
      const quantumInput = document.getElementById("q.t").value;
      const quantum = parseInt(quantumInput);
      if (isNaN(quantum)) {
        alert("Please enter a valid Quantum Time.");
        return;
      }
      RR(arrivalArr, burstArr, quantum);
      break;

    case "Priority":
      const priorityInput = document.getElementById("p.t").value.trim();
      const priorityArr = priorityInput.split(",");
      if (arrivalArr.length !== priorityArr.length) {
        alert("Yoops! Invalid INPUT: Arrival and Priority lengths mismatch.");
        return;
      }
      priority(arrivalArr, burstArr, priorityArr);
      break;

    case "PP":
      const preemptivePriorityInput = document
        .getElementById("p.p")
        .value.trim();
      const preemptivePriorityArr = preemptivePriorityInput.split(",");
      if (arrivalArr.length !== preemptivePriorityArr.length) {
        alert("Yoops! Invalid INPUT: Arrival and Priority lengths mismatch.");
        return;
      }
      preemptivepriority(arrivalArr, burstArr, preemptivePriorityArr);
      break;

    default:
      alert("Unknown scheduling algorithm selected.");
  }
}
function check() {
  const scheduleType = document.getElementById("schedual-type").value;
  const quantumField = document.getElementById("quant");
  const priorityField = document.getElementById("priority");
  const ppField = document.getElementById("pp");

  // Helper to hide all optional fields
  const hideAllFields = () => {
    quantumField.style.display = "none";
    priorityField.style.display = "none";
    ppField.style.display = "none";
  };

  hideAllFields(); // Always start with hiding all

  switch (scheduleType) {
    case "RR":
      quantumField.style.display = "block";
      break;

    case "Priority":
      priorityField.style.display = "block";
      break;

    case "PP":
      ppField.style.display = "block";
      break;

    // For FCFS, SJF, SRTF, or any other type — all fields remain hidden
    default:
      break;
  }
}

function reduceGhanttchart(ghanttchart, id) {
  const n = ghanttchart.length;
  const reducedGhanttchart = [];
  const pid = [];

  for (let i = 1; i < n; i++) {
    const [prevct, prevflag] = ghanttchart[i - 1];

    if (id[i] !== id[i - 1]) {
      reducedGhanttchart.push([prevct, prevflag]);
      if (id[i - 1] !== 0) {
        pid.push(id[i - 1]);
      }
    }
  }
  reducedGhanttchart.push(ghanttchart[n - 1]);
  pid.push(id[n - 1]);

  chartfcfs(reducedGhanttchart, pid);
}

function chartfcfs(ghantt, id) {
  const boxes = document.getElementById("right-foot");
  boxes.innerHTML = "";
  boxes.innerHTML += `<div class="ghantt">
    <div class="foot-box master">begin</div>
    <p class="para-m">0</p>
</div>`;
  boxes.style.display = "flex";
  let j = 0;

  for (let i = 0; i < ghantt.length; i++) {
    const element = ghantt[i][0];
    const flag = ghantt[i][1];

    if (flag === 1) {
      boxes.innerHTML += `<div class="ghantt">
        <div class="foot-box">P${id[j]}</div>
        <p class="para-m">${element}</p>
         </div>`;
      j++;
    } else {
      boxes.innerHTML += `<div class="ghantt">
        <div class="foot-box"></div>
        <p class="para-m">${element}</p>
         </div>`;
    }
  }
}
// function chartsrtf(ghantt,id) {
//     const boxes=document.getElementById("right-foot");
//     boxes.style.display="flex";
//     boxes.innerHTML="";
//     boxes.innerHTML+=`<div class="ghantt">
//     <div class="master">
//     </div>
//     <p class="para-m">0</p>
// </div>`

//     for(let i=0;i<ghantt.length;i++){
//         boxes.innerHTML+=`<div class="ghantt">
//         <div class="foot-box">P${id[i]}</div>
//         <p class="para-m">${ghantt[i]}</p>
//          </div>`
//     }
// }

function adddata(totalwait, totaltat) {
  function formatValue(val) {
    return val % 1 === 0 ? val : val.toFixed(2);
  }
  AvgData.innerHTML = `
    <div class="line">Avg. W.T : <span class="value">${formatValue(
      totalwait
    )}</span></div>
    <div class="line">Avg. T.A.T : <span class="value">${formatValue(
      totaltat
    )}</span></div>
  `;
}
function addtable(
  arrivalarr,
  burstarr,
  completionarr,
  turnaroundarr,
  waitingarr,
  id
) {
  const tableBody = document.getElementById("table-body");
  // Remove all existing rows from the table body
  tableBody.innerHTML = "";
  for (var i = 0; i < completionarr.length; i++) {
    var row = tableBody.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    cell1.innerHTML = `P${id[i]}`;
    cell2.innerHTML = arrivalarr[i];
    cell3.innerHTML = burstarr[i];
    cell4.innerHTML = completionarr[i];
    cell5.innerHTML = turnaroundarr[i];
    cell6.innerHTML = waitingarr[i];
  }
}
