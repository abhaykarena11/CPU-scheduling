function priority(at, bt, pr) {
  const n = at.length;
  const processes = [];

  for (let i = 0; i < n; i++) {
    processes.push({
      id: i + 1,
      AT: parseInt(at[i]),
      BT: parseInt(bt[i]),
      priority: parseInt(pr[i]),
      WT: 0,
      TAT: 0,
    });
  }

  let currentTime = 0;
  let completed = [];
  let ghantt = [];
  let pidTimeline = [];

  processes.sort((a, b) => a.AT - b.AT); // Initial sort by arrival

  while (completed.length < n) {
    let available = processes.filter(
      (p) => p.AT <= currentTime && !p.completed
    );

    if (available.length === 0) {
      currentTime = processes.find((p) => !p.completed).AT;
      ghantt.push([currentTime, 0]);
      continue;
    }

    // Sort available by priority (lower number = higher priority), then arrival
    available.sort((a, b) => {
      if (a.priority === b.priority) {
        return a.AT - b.AT;
      }
      return a.priority - b.priority;
    });

    let current = available[0];
    current.WT = currentTime - current.AT;
    current.TAT = current.WT + current.BT;
    current.completed = true;

    currentTime += current.BT;
    ghantt.push([currentTime, 1]);
    pidTimeline.push(current.id);
    completed.push(current);
  }

  // Prepare results
  const atList = completed.map((p) => p.AT);
  const btList = completed.map((p) => p.BT);
  const ctList = completed.map((p) => p.AT + p.TAT);
  const tatList = completed.map((p) => p.TAT);
  const wtList = completed.map((p) => p.WT);
  const pidList = completed.map((p) => p.id);

  const avgWT = (wtList.reduce((sum, w) => sum + w, 0) / n).toFixed(2);
  const avgTAT = (tatList.reduce((sum, t) => sum + t, 0) / n).toFixed(2);

  addtable(atList, btList, ctList, tatList, wtList, pidList);
  chartfcfs(ghantt, pidTimeline);
  adddata.innerHTML = `Avg. W.T : ${avgWT} <br/> Avg. T.AT : ${avgTAT}`;
}
