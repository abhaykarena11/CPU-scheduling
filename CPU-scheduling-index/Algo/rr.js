function RR(at, bt, quant) {
  class Process {
    constructor(AT, BT, id) {
      this.AT = AT;
      this.BT = BT;
      this.remainingBT = BT;
      this.FT = 0;
      this.WT = 0;
      this.TAT = 0;
      this.id = id;
      this.startTimes = [];
    }
  }

  const n = at.length;
  const processes = at.map(
    (a, i) => new Process(parseInt(a), parseInt(bt[i]), i + 1)
  );

  let time = 0;
  let remaining = n;
  let ghantt = [];
  let xid = [];
  let totalWT = 0,
    totalTAT = 0;

  let queue = [];
  let visited = new Array(n).fill(false);

  // Add initially available processes
  for (let i = 0; i < n; i++) {
    if (processes[i].AT === 0) {
      queue.push(i);
      visited[i] = true;
    }
  }

  while (remaining > 0) {
    if (queue.length === 0) {
      // Idle time
      time++;
      ghantt.push([time, 0]);
      xid.push(0);

      // Check new arrivals
      for (let i = 0; i < n; i++) {
        if (!visited[i] && processes[i].AT <= time) {
          queue.push(i);
          visited[i] = true;
        }
      }
      continue;
    }

    let idx = queue.shift();
    let p = processes[idx];

    p.startTimes.push(time);
    let execTime = Math.min(quant, p.remainingBT);
    time += execTime;
    p.remainingBT -= execTime;

    ghantt.push([time, 1]);
    xid.push(p.id);

    // Check new arrivals during execution
    for (let i = 0; i < n; i++) {
      if (!visited[i] && processes[i].AT <= time) {
        queue.push(i);
        visited[i] = true;
      }
    }

    if (p.remainingBT > 0) {
      queue.push(idx); // Re-queue if not finished
    } else {
      p.FT = time;
      p.TAT = p.FT - p.AT;
      p.WT = p.TAT - p.BT;
      totalWT += p.WT;
      totalTAT += p.TAT;
      remaining--;
    }
  }

  at = processes.map((p) => p.AT);
  bt = processes.map((p) => p.BT);
  const ct = processes.map((p) => p.FT);
  const tat = processes.map((p) => p.TAT);
  const wt = processes.map((p) => p.WT);
  const pid = processes.map((p) => p.id);

  // Show results
  adddata(totalWT / n, totalTAT / n);
  reduceGhanttchart(ghantt, xid);
  addtable(at, bt, ct, tat, wt, pid);
}
