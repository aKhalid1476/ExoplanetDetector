"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const trainingData = [
  { epoch: 1,  trainAcc: 85.58, valAcc: 95.61, trainLoss: 0.3282, valLoss: 0.1580 },
  { epoch: 2,  trainAcc: 97.91, valAcc: 99.12, trainLoss: 0.0721, valLoss: 0.0792 },
  { epoch: 3,  trainAcc: 98.90, valAcc: 98.07, trainLoss: 0.0383, valLoss: 0.0794 },
  { epoch: 4,  trainAcc: 98.96, valAcc: 99.12, trainLoss: 0.0318, valLoss: 0.0581 },
  { epoch: 5,  trainAcc: 99.42, valAcc: 99.12, trainLoss: 0.0199, valLoss: 0.0588 },
  { epoch: 6,  trainAcc: 99.44, valAcc: 99.30, trainLoss: 0.0168, valLoss: 0.0520 },
  { epoch: 7,  trainAcc: 99.78, valAcc: 99.12, trainLoss: 0.0099, valLoss: 0.0505 },
  { epoch: 8,  trainAcc: 99.82, valAcc: 99.30, trainLoss: 0.0083, valLoss: 0.0501 },
  { epoch: 9,  trainAcc: 99.90, valAcc: 99.30, trainLoss: 0.0077, valLoss: 0.0461 },
  { epoch: 10, trainAcc: 99.87, valAcc: 99.12, trainLoss: 0.0052, valLoss: 0.0601 },
  { epoch: 11, trainAcc: 99.75, valAcc: 99.47, trainLoss: 0.0064, valLoss: 0.0467 },
  { epoch: 12, trainAcc: 99.75, valAcc: 98.95, trainLoss: 0.0094, valLoss: 0.0424 },
  { epoch: 13, trainAcc: 99.83, valAcc: 99.30, trainLoss: 0.0052, valLoss: 0.0173 },
  { epoch: 14, trainAcc: 99.92, valAcc: 99.30, trainLoss: 0.0040, valLoss: 0.0291 },
  { epoch: 15, trainAcc: 99.89, valAcc: 99.30, trainLoss: 0.0045, valLoss: 0.0282 },
  { epoch: 16, trainAcc: 99.95, valAcc: 99.30, trainLoss: 0.0028, valLoss: 0.0307 },
  { epoch: 17, trainAcc: 99.91, valAcc: 99.47, trainLoss: 0.0029, valLoss: 0.0294 },
  { epoch: 18, trainAcc: 99.92, valAcc: 99.47, trainLoss: 0.0024, valLoss: 0.0327 },
  { epoch: 19, trainAcc: 99.97, valAcc: 99.47, trainLoss: 0.0017, valLoss: 0.0353 },
  { epoch: 20, trainAcc: 99.99, valAcc: 99.47, trainLoss: 0.0014, valLoss: 0.0407 },
];

const tooltipStyle = {
  backgroundColor: "#0f172a",
  border: "1px solid rgba(99,102,241,0.4)",
  borderRadius: "0.5rem",
  color: "#e2e8f0",
};

export function AccuracyChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={trainingData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="epoch"
          stroke="#64748b"
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          label={{ value: "Epoch", position: "insideBottom", offset: -2, fill: "#64748b" }}
        />
        <YAxis
          stroke="#64748b"
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          domain={[80, 100]}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value) => [`${Number(value).toFixed(2)}%`]}
        />
        <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 13 }} />
        <Line
          type="monotone"
          dataKey="trainAcc"
          name="Train Accuracy"
          stroke="#60a5fa"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="valAcc"
          name="Val Accuracy"
          stroke="#34d399"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function LossChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={trainingData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="epoch"
          stroke="#64748b"
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          label={{ value: "Epoch", position: "insideBottom", offset: -2, fill: "#64748b" }}
        />
        <YAxis
          stroke="#64748b"
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          tickFormatter={(v) => v.toFixed(3)}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value) => [Number(value).toFixed(4)]}
        />
        <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 13 }} />
        <Line
          type="monotone"
          dataKey="trainLoss"
          name="Train Loss"
          stroke="#f472b6"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="valLoss"
          name="Val Loss"
          stroke="#fb923c"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
