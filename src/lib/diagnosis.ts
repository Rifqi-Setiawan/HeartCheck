export type Label = "L" | "N" | "Q" | "R" | "V";
export type ModelId = "bert" | "mae" | "conformer";

export interface DiagnosisResult {
  total_segments: number;
  counts: Record<Label, number>;
}
