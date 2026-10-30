import React from "react";

export const ParkingBayMotif: React.FC<{ className?: string }> = ({ className = "" }) => {
  // Representation of a parking lot grid with occupied (Majorelle), reserved/picked (Saffron), and free bays (dashed)
  const bays = [
    { id: 1, status: "occupied" },
    { id: 2, status: "occupied" },
    { id: 3, status: "free" },
    { id: 4, status: "occupied" },
    { id: 5, status: "occupied" },
    { id: 6, status: "occupied" },
    { id: 7, status: "occupied" },
    { id: 8, status: "occupied" },
    { id: 9, status: "free" },
    { id: 10, status: "pick" }, // Selected/optimal spot
    { id: 11, status: "occupied" },
    { id: 12, status: "free" },
  ];

  return (
    <div
      className={`relative p-3 rounded-2xl border border-line-light/80 dark:border-line-dark/80 bg-surface-light/60 dark:bg-surface-dark/60 backdrop-blur-sm shadow-sm select-none ${className}`}
      role="img"
      aria-label="SmartPark YOLOv8 occupancy detector subtle motif"
    >
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-line-light/50 dark:border-line-dark/50 text-[11px] font-mono text-muted-light dark:text-muted-dark">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          YOLOv8 Live Telemetry
        </span>
        <span className="text-[10px] bg-majorelle-light dark:bg-majorelle-darkSurface text-majorelle dark:text-majorelle-dark px-1.5 py-0.5 rounded font-semibold">
          9/12 Occupied
        </span>
      </div>

      <div className="grid grid-cols-6 gap-1.5">
        {bays.map((bay) => {
          if (bay.status === "pick") {
            return (
              <div
                key={bay.id}
                title="Optimal free bay"
                className="h-8 rounded-[4px] bg-saffron dark:bg-saffron-dark shadow-sm flex items-center justify-center text-[9px] font-bold text-white transition-transform hover:scale-105"
              >
                P10
              </div>
            );
          }
          if (bay.status === "free") {
            return (
              <div
                key={bay.id}
                title="Free bay"
                className="h-8 rounded-[4px] border border-dashed border-line-light dark:border-line-dark hover:border-emerald-500 transition-colors"
              />
            );
          }
          return (
            <div
              key={bay.id}
              title="Occupied"
              className="h-8 rounded-[4px] bg-majorelle/25 dark:bg-majorelle/35 flex items-center justify-center"
            >
              <div className="w-2.5 h-4 rounded-sm bg-majorelle dark:bg-majorelle-dark opacity-80" />
            </div>
          );
        })}
      </div>
      <p className="mt-1.5 text-[10px] text-muted-light dark:text-muted-dark text-right font-mono">
        Active Learning loop · SmartPark AI
      </p>
    </div>
  );
};
