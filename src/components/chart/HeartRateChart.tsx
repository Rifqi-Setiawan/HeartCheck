// "use client";

// import {
//   LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
// } from "recharts";
// import type { ECGPoint } from "@/lib/loadCsv";

// type Props = {
//   data: ECGPoint[];
//   title?: string;
//   className?: string;
// };

// export default function HeartRateChart({ data, title, className = "" }: Props) {
//   return (
//     <div className={["rounded-xl border border-border/60 bg-card p-5 shadow-sm", className].join(" ")}>
//       <div className="mb-3">
//         <h3 className="text-base font-semibold text-foreground">
//           {title ?? "Sinyal Detak Jantung Real-time"}
//         </h3>
//         <p className="text-sm text-muted-foreground">
//           Grafik menunjukkan pola detak jantung dalam waktu nyata
//         </p>
//       </div>

//       <div className="h-[320px]">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
//             <CartesianGrid strokeDasharray="4 4" />
//             <XAxis
//               dataKey="time"
//               tick={{ fontSize: 12 }}
//               tickMargin={6}
//               label={{ value: "Time", position: "insideBottomRight", offset: -4 }}
//             />
//             <YAxis
//               tick={{ fontSize: 12 }}
//               tickMargin={6}
//               label={{ value: "BPM", angle: -90, position: "insideLeft" }}
//               domain={["dataMin - 10", "dataMax + 10"]}
//             />
//             <Tooltip
//               formatter={(v: number | string) => [`${v} BPM`, "BPM"]}
//               labelFormatter={(l: number | string) => `t=${l}`}
//               cursor={{ strokeDasharray: "3 3" }}
//             />
//             <Line type="monotone" dataKey="bpm" strokeWidth={2} dot={false} isAnimationActive={false} />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }
