interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
  sources: Array<{ node: HTMLElement | null }>;
}

interface CLSReport {
  name: string;
  value: number;
  entries: LayoutShiftEntry[];
}

let clsValue: number = 0;
let clsEntries: LayoutShiftEntry[] = [];

export function onCLSReport(callback: (report: CLSReport) => void): void {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries() as LayoutShiftEntry[]) {
      // Chỉ tính layout shifts không có tương tác của người dùng
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        clsEntries.push(entry);

        const report: CLSReport = {
          name: "Cumulative Layout Shift",
          value: clsValue,
          entries: clsEntries,
        };

        callback(report);
      }
    }
  });

  observer.observe({
    type: "layout-shift",
    buffered: true,
  });
}

export function logCLSReport(cls: CLSReport): void {
  console.groupCollapsed(
    `[${cls.name}] Cumulative Value: %c${cls.value.toFixed(4)}`,
    "color: #FF4E42"
  );

  for (const entry of cls.entries) {
    console.log("Layout Shift Score:", entry.value);
    console.log("Layout Shift Target:", entry.sources.map((source) => source.node));
    console.log("Shift Time:", entry.startTime);
  }

  console.groupEnd();
}

export function logAllCLSReports(): void {
  onCLSReport(logCLSReport);
}
