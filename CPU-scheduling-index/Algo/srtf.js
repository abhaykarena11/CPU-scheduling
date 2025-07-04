function SRTF(at, bt) {
  const n = at.length;
  let time = 0,
    completed = 0,
    avgwt = 0,
    avgtat = 0;

  // Parse input to integers and initialize arrays
  at = at.map(Number);
  bt = bt.map(Number);

  const pid = Array.from({ length: n }, (_, i) => i + 1);
  const remaining = [...bt];
  const ct = Array(n).fill(0);
  const tat = Array(n).fill(0);
  const wt = Array(n).fill(0);
  const finished = Array(n).fill(false);

  const ghantt = [];
  const id = [];

  while (completed < n) {
    let idx = -1,
      min = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < n; i++) {
      if (
        !finished[i] &&
        at[i] <= time &&
        remaining[i] < min &&
        remaining[i] > 0
      ) {
        min = remaining[i];
        idx = i;
      }
    }

    if (idx === -1) {
      time++;
      ghantt.push([time, 0]);
      id.push(0);
    } else {
      remaining[idx]--;
      time++;
      ghantt.push([time, 1]);
      id.push(pid[idx]);

      if (remaining[idx] === 0) {
        ct[idx] = time;
        tat[idx] = ct[idx] - at[idx];
        wt[idx] = tat[idx] - bt[idx];
        avgtat += tat[idx];
        avgwt += wt[idx];
        finished[idx] = true;
        completed++;
      }
    }
  }

  adddata(avgwt / n, avgtat / n);
  addtable(at, bt, ct, tat, wt, pid);
  reduceGhanttchart(ghantt, id);
}
