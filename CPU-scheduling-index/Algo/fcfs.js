function FCFS(at, bt) {
  const n = at.length;

  // Combine and sort based on arrival time
  const combined = at.map((value, index) => [
    parseInt(value),
    parseInt(bt[index]),
    index + 1,
  ]);

  combined.sort((a, b) => a[0] - b[0]);

  let ct = [];
  let tat = [];
  let wt = [];
  let ghantt = [];

  let currenttime = 0;
  let totalwait = 0;
  let totaltat = 0;

  const sortedArrival = [];
  const sortedBurst = [];
  const sortedID = [];

  for (let i = 0; i < n; i++) {
    const [arrival, burst, pid] = combined[i];
    sortedArrival.push(arrival);
    sortedBurst.push(burst);
    sortedID.push(pid);

    if (currenttime < arrival) {
      currenttime = arrival;
      ghantt.push([currenttime, 0]);
    }

    ct[i] = currenttime + burst;
    ghantt.push([ct[i], 1]);

    tat[i] = ct[i] - arrival;
    wt[i] = tat[i] - burst;

    totalwait += wt[i];
    totaltat += tat[i];

    currenttime = ct[i];
  }

  addtable(sortedArrival, sortedBurst, ct, tat, wt, sortedID);
  adddata(totalwait / n, totaltat / n);

  chartfcfs(ghantt, sortedID);
}
