const SJF = (arrivalTimes, burstTimes) => {
  const n = arrivalTimes.length;

  // Parse inputs once for efficiency
  const at = arrivalTimes.map(Number);
  const bt = burstTimes.map(Number);

  const pid = Array.from({ length: n }, (_, i) => i + 1);
  const ct = Array(n).fill(0);
  const ta = Array(n).fill(0);
  const wt = Array(n).fill(0);
  const completed = Array(n).fill(false);

  let currentTime = 0;
  let completedCount = 0;
  let totalWT = 0;
  let totalTAT = 0;

  while (completedCount < n) {
    let minIndex = -1;
    let minBT = Infinity;

    for (let i = 0; i < n; i++) {
      if (!completed[i] && at[i] <= currentTime && bt[i] < minBT) {
        minBT = bt[i];
        minIndex = i;
      }
    }

    if (minIndex === -1) {
      currentTime++;
      continue;
    }

    ct[minIndex] = currentTime + bt[minIndex];
    ta[minIndex] = ct[minIndex] - at[minIndex];
    wt[minIndex] = ta[minIndex] - bt[minIndex];

    completed[minIndex] = true;
    currentTime = ct[minIndex];
    completedCount++;
  }

  // Combine and sort results based on completion time
  const results = pid.map((_, i) => [
    pid[i],
    at[i],
    bt[i],
    ct[i],
    ta[i],
    wt[i],
  ]);
  results.sort((a, b) => a[3] - b[3]);

  // Unpack sorted values back into arrays
  for (let i = 0; i < n; i++) {
    [pid[i], at[i], bt[i], ct[i], ta[i], wt[i]] = results[i];
    totalWT += wt[i];
    totalTAT += ta[i];
  }

  // Generate Gantt chart data
  const ganttChart = [];
  currentTime = 0;
  for (let i = 0; i < n; i++) {
    if (currentTime < at[i]) {
      ganttChart.push([at[i], 0]); // Idle time
      currentTime = at[i];
    }
    currentTime = ct[i];
    ganttChart.push([currentTime, 1]); // Task complete
  }

  // Update UI
  adddata(totalWT / n, totalTAT / n);
  chartfcfs(ganttChart, pid);
  addtable(at, bt, ct, ta, wt, pid);
};
