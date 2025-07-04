function preemptivepriority(at, bt, pt) {
  class Process {
    constructor(id, arrivalTime, burstTime, priority) {
      this.id = id;
      this.arrivalTime = arrivalTime;
      this.burstTime = burstTime;
      this.priority = priority;
      this.remainingTime = burstTime;
      this.completionTime = 0;
      this.turnaroundTime = 0;
      this.waitingTime = 0;
    }
  }

  function scheduleProcesses(processes) {
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
    
    let currentTime = 0;
    let completedProcesses = 0;
    const n = processes.length;
    const ghantt = [];
    const xid = [];

    while (completedProcesses < n) {
      const availableProcesses = processes.filter(
        p => p.arrivalTime <= currentTime && p.remainingTime > 0
      );

      if (availableProcesses.length === 0) {
        currentTime++;
        ghantt.push([currentTime, 0]);
        xid.push(0);
        continue;
      }

      availableProcesses.sort((a, b) => 
        a.priority - b.priority || a.remainingTime - b.remainingTime
      );

      const currentProcess = availableProcesses[0];
      currentProcess.remainingTime--;
      currentTime++;
      ghantt.push([currentTime, 1]);
      xid.push(currentProcess.id);

      if (currentProcess.remainingTime === 0) {
        completedProcesses++;
        currentProcess.completionTime = currentTime;
      }
    }

    let totalTAT = 0, totalWT = 0;
    const results = processes.map(process => {
      process.turnaroundTime = process.completionTime - process.arrivalTime;
      process.waitingTime = process.turnaroundTime - process.burstTime;
      totalTAT += process.turnaroundTime;
      totalWT += process.waitingTime;
      
      return {
        id: process.id,
        arrivalTime: process.arrivalTime,
        burstTime: process.burstTime,
        completionTime: process.completionTime,
        turnaroundTime: process.turnaroundTime,
        waitingTime: process.waitingTime
      };
    });

    adddata.innerHTML = `Avg. W.T : ${(totalWT / n).toFixed(2)} <br/> Avg. T.A.T : ${(totalTAT / n).toFixed(2)}`;
    
    const { arrivalTimes, burstTimes, completionTimes, turnaroundTimes, waitingTimes, ids } = results.reduce((acc, curr) => {
      acc.arrivalTimes.push(curr.arrivalTime);
      acc.burstTimes.push(curr.burstTime);
      acc.completionTimes.push(curr.completionTime);
      acc.turnaroundTimes.push(curr.turnaroundTime);
      acc.waitingTimes.push(curr.waitingTime);
      acc.ids.push(curr.id);
      return acc;
    }, {
      arrivalTimes: [], burstTimes: [], completionTimes: [], 
      turnaroundTimes: [], waitingTimes: [], ids: []
    });

    addtable(arrivalTimes, burstTimes, completionTimes, turnaroundTimes, waitingTimes, ids);
    reduceGhanttchart(ghantt, xid);
  }

  const processes = at.map((_, i) => 
    new Process(i + 1, parseInt(at[i]), parseInt(bt[i]), parseInt(pt[i]))
  );

  scheduleProcesses(processes);
}
