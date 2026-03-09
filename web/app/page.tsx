import { AccuracyChart, LossChart } from "./components/TrainingChart";
import SpaceAnimation from "./components/SpaceAnimation";

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "#05080f", color: "#e2e8f0" }}>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-6 py-28 overflow-hidden"
        style={{ minHeight: "60vh" }}
      >
        {/* Animated canvas background */}
        <SpaceAnimation />

        {/* Fade to page background at bottom */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: "40%",
            background: "linear-gradient(to bottom, transparent 0%, #05080f 100%)",
            zIndex: 1,
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="transit-pulse-dot" />
            <p className="text-sm font-semibold tracking-widest" style={{ color: "#3B82F6" }}>
              CURRENTLY OBSERVING TRANSIT · KEPLER-442 SYSTEM
            </p>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span style={{ color: "#F1F5F9" }}>
              Exoplanet Detector
            </span>
          </h1>

          <div
            className="rounded-2xl px-6 py-5 mb-10 max-w-2xl w-full"
            style={{
              background: "rgba(5,10,25,0.55)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(59,130,246,0.15)",
            }}
          >
            <p className="text-lg md:text-xl" style={{ color: "#94a3b8" }}>
              A 1-D Convolutional Neural Network trained on NASA Kepler mission light curves
              to classify stars as{" "}
              <strong style={{ color: "#F1F5F9" }}>exoplanet hosts</strong> or{" "}
              <strong style={{ color: "#F1F5F9" }}>non-hosts</strong> with{" "}
              <strong style={{ color: "#3B82F6" }}>99.47 % validation accuracy</strong>.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {[
              { label: "Val Accuracy", value: "99.47 %" },
              { label: "Val Loss",     value: "0.0173"  },
              { label: "Epochs",       value: "20"       },
              { label: "Architecture", value: "Conv1D"   },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-4"
                style={{
                  background: "rgba(5,10,25,0.55)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(59,130,246,0.2)",
                }}
              >
                <div className="text-2xl font-bold" style={{ color: "#F1F5F9" }}>
                  {s.value}
                </div>
                <div className="text-xs mt-1" style={{ color: "#64748b" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20 space-y-16">

        {/* ── Dataset ──────────────────────────────────────── */}
        <Section title="Dataset">
          <p style={{ color: "#94a3b8" }} className="mb-6 text-base leading-relaxed">
            The dataset originates from the{" "}
            <strong style={{ color: "#e2e8f0" }}>NASA Kepler Space Observatory</strong>, which
            monitors stellar brightness over time to detect the tiny periodic dips caused by a
            planet transiting in front of its star. Each sample is a time-series of{" "}
            <strong style={{ color: "#3B82F6" }}>3,197 flux measurements</strong>.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                label: "Training set",
                detail: "5,087 stars · 37 exoplanet hosts (0.73 %)",
              },
              {
                label: "Test set",
                detail: "570 stars · 5 exoplanet hosts (0.88 %)",
              },
            ].map((d) => (
              <Card key={d.label}>
                <div
                  className="text-xs font-semibold uppercase tracking-widest mb-1"
                  style={{ color: "#3B82F6" }}
                >
                  {d.label}
                </div>
                <div style={{ color: "#cbd5e1" }}>{d.detail}</div>
              </Card>
            ))}
          </div>
          <InfoBox className="mt-4">
            The dataset is severely <strong>class-imbalanced</strong>. Only ~0.7 % of stars host
            confirmed exoplanets, which motivated the use of{" "}
            <strong>SMOTE oversampling</strong> during preprocessing.
          </InfoBox>
        </Section>

        {/* ── Preprocessing Pipeline ───────────────────────── */}
        <Section title="Preprocessing Pipeline">
          <p style={{ color: "#94a3b8" }} className="mb-8 text-base leading-relaxed">
            Five sequential transformations prepare the raw flux data for the CNN. Each step
            targets a specific data quality issue.
          </p>
          <div className="flex flex-col gap-3">
            {preprocessingSteps.map((step, i) => (
              <div
                key={step.name}
                className="flex items-start gap-4 rounded-xl p-4"
                style={{
                  background: "rgba(15,23,42,0.85)",
                  border: "1px solid rgba(59,130,246,0.15)",
                }}
              >
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: "rgba(59,130,246,0.15)", color: "#3B82F6" }}
                >
                  {i + 1}
                </div>
                <div>
                  <div className="font-semibold mb-0.5" style={{ color: "#e2e8f0" }}>
                    {step.name}
                  </div>
                  <div className="text-sm" style={{ color: "#94a3b8" }}>
                    {step.desc}
                  </div>
                  <code className="text-xs mt-1 block" style={{ color: "#3B82F6" }}>
                    {step.code}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── CNN Architecture ─────────────────────────────── */}
        <Section title="CNN Architecture">
          <p style={{ color: "#94a3b8" }} className="mb-8 text-base leading-relaxed">
            A lightweight 1-D CNN extracts local temporal patterns from the light-curve signal.
            The two convolutional blocks progressively learn short-range and medium-range flux
            variations characteristic of transit events, then a single sigmoid neuron produces
            the binary classification.
          </p>

          <div className="flex flex-col items-center gap-2 py-4">
            {archLayers.map((layer, i) => (
              <div key={i} className="flex flex-col items-center w-full max-w-lg">
                <div
                  className="w-full rounded-lg px-5 py-3 text-center"
                  style={{ background: layer.bg, border: `1px solid ${layer.border}` }}
                >
                  <div className="font-semibold text-sm" style={{ color: layer.color }}>
                    {layer.name}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
                    {layer.detail}
                  </div>
                </div>
                {i < archLayers.length - 1 && (
                  <div className="text-lg" style={{ color: "#334155" }}>
                    ↓
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {[
              { label: "Loss",      value: "Binary Cross-Entropy" },
              { label: "Optimizer", value: "Adam"                 },
              { label: "Metric",    value: "Accuracy"             },
            ].map((c) => (
              <Card key={c.label} className="text-center">
                <div
                  className="text-xs uppercase tracking-widest mb-1"
                  style={{ color: "#64748b" }}
                >
                  {c.label}
                </div>
                <div className="font-semibold" style={{ color: "#3B82F6" }}>
                  {c.value}
                </div>
              </Card>
            ))}
          </div>
        </Section>

        {/* ── Training ─────────────────────────────────────── */}
        <Section title="Training">
          <p style={{ color: "#94a3b8" }} className="mb-8 text-base leading-relaxed">
            The model was trained for{" "}
            <strong style={{ color: "#e2e8f0" }}>20 epochs</strong> with a{" "}
            <strong style={{ color: "#e2e8f0" }}>batch size of 64</strong>. SMOTE-oversampled
            training data was used to fit the model, while the raw held-out test set provided
            validation — reflecting the real-world class distribution.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <SectionLabel>Accuracy per Epoch</SectionLabel>
              <AccuracyChart />
            </div>
            <div>
              <SectionLabel>Loss per Epoch</SectionLabel>
              <LossChart />
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mt-8">
            {epochHighlights.map((h) => (
              <Card key={h.label} className="text-center">
                <div
                  className="text-xs uppercase tracking-widest mb-1"
                  style={{ color: "#64748b" }}
                >
                  {h.label}
                </div>
                <div className="text-xl font-bold" style={{ color: "#3B82F6" }}>
                  {h.value}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#475569" }}>
                  {h.sub}
                </div>
              </Card>
            ))}
          </div>
        </Section>

        {/* ── Confusion Matrix ─────────────────────────────── */}
        <Section title="Confusion Matrix (Test Set)">
          <p style={{ color: "#94a3b8" }} className="mb-8 text-base leading-relaxed">
            On the held-out test set of 570 stars, the model correctly identifies nearly all
            stars. High recall on the positive (exoplanet) class is critical — missing a true
            exoplanet is more costly than a false alarm.
          </p>

          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="grid grid-cols-3 gap-1 mb-1 text-center">
                <div />
                <div
                  className="text-xs font-semibold py-1"
                  style={{ color: "#3B82F6" }}
                >
                  Predicted: No
                </div>
                <div
                  className="text-xs font-semibold py-1"
                  style={{ color: "#3B82F6" }}
                >
                  Predicted: Yes
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1 mb-1 text-center">
                <div
                  className="flex items-center justify-end pr-2 text-xs font-semibold"
                  style={{ color: "#94a3b8" }}
                >
                  Actual: No
                </div>
                <MatrixCell value={562} label="TN" color="#1E3A5F" textColor="#3B82F6" />
                <MatrixCell value={3}   label="FP" color="#1C2535" textColor="#93C5FD" />
              </div>
              <div className="grid grid-cols-3 gap-1 text-center">
                <div
                  className="flex items-center justify-end pr-2 text-xs font-semibold"
                  style={{ color: "#94a3b8" }}
                >
                  Actual: Yes
                </div>
                <MatrixCell value={0}   label="FN" color="#1C2535" textColor="#64748B" />
                <MatrixCell value={5}   label="TP" color="#1E3A5F" textColor="#3B82F6" />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                {[
                  { label: "Precision",    value: "62.5 %",  note: "TP / (TP + FP)" },
                  { label: "Recall",       value: "100 %",   note: "TP / (TP + FN)" },
                  { label: "F1 Score",     value: "76.9 %",  note: "Harmonic mean"  },
                  { label: "Overall Acc.", value: "99.47 %", note: "(TP+TN) / Total" },
                ].map((m) => (
                  <Card key={m.label}>
                    <div
                      className="text-xs uppercase tracking-widest"
                      style={{ color: "#64748b" }}
                    >
                      {m.label}
                    </div>
                    <div className="text-xl font-bold my-0.5" style={{ color: "#3B82F6" }}>
                      {m.value}
                    </div>
                    <div className="text-xs" style={{ color: "#475569" }}>
                      {m.note}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <InfoBox className="mt-8">
            <strong>Zero false negatives</strong> — every confirmed exoplanet host in the test
            set was correctly detected. The 3 false positives are an acceptable trade-off; these
            candidate stars would simply be reviewed by human astronomers as the next step.
          </InfoBox>
        </Section>

        {/* ── Key Findings ─────────────────────────────────── */}
        <Section title="Key Findings">
          <div className="grid md:grid-cols-2 gap-4">
            {findings.map((f) => (
              <div
                key={f.title}
                className="flex gap-4 rounded-xl p-5"
                style={{
                  background: "rgba(15,23,42,0.85)",
                  border: "1px solid rgba(59,130,246,0.2)",
                }}
              >
                <div className="text-2xl">{f.icon}</div>
                <div>
                  <div className="font-semibold mb-1" style={{ color: "#e2e8f0" }}>
                    {f.title}
                  </div>
                  <div className="text-sm" style={{ color: "#94a3b8" }}>
                    {f.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Footer ───────────────────────────────────────── */}
        <footer
          className="text-center pt-8 text-xs"
          style={{
            color: "#334155",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          Dataset: NASA Kepler Mission via{" "}
          <span style={{ color: "#475569" }}>Inspirit AI Data Bucket</span> · Model built with
          TensorFlow / Keras
        </footer>
      </div>
    </main>
  );
}

/* ── Reusable components ────────────────────────────────── */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-1 w-8 rounded-full" style={{ background: "#3B82F6" }} />
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "#e2e8f0" }}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl p-4 ${className}`}
      style={{
        background: "rgba(15,23,42,0.85)",
        border: "1px solid rgba(59,130,246,0.15)",
      }}
    >
      {children}
    </div>
  );
}

function InfoBox({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl p-4 text-sm ${className}`}
      style={{
        background: "rgba(59,130,246,0.09)",
        border: "1px solid rgba(59,130,246,0.25)",
        color: "#cbd5e1",
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="text-xs font-semibold uppercase tracking-widest mb-3"
      style={{ color: "#3B82F6" }}
    >
      {children}
    </div>
  );
}

function MatrixCell({
  value,
  label,
  color,
  textColor,
}: {
  value: number;
  label: string;
  color: string;
  textColor: string;
}) {
  return (
    <div
      className="rounded-lg py-5 flex flex-col items-center justify-center"
      style={{ background: color }}
    >
      <div className="text-2xl font-bold" style={{ color: textColor }}>
        {value}
      </div>
      <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>
        {label}
      </div>
    </div>
  );
}

/* ── Static data ────────────────────────────────────────── */

const preprocessingSteps = [
  {
    name: "Fourier Transform",
    desc: "Converts time-domain flux signal to frequency domain, isolating periodic transit signals from noise.",
    code: "np.abs(np.fft.fft(X, axis=1))",
  },
  {
    name: "Savitzky-Golay Filter",
    desc: "Smooths the frequency-domain signal while preserving peak shape. Window size 21, polynomial order 4, derivative 0.",
    code: "savgol_filter(X, window_length=21, polyorder=4, deriv=0)",
  },
  {
    name: "L2 Normalization",
    desc: "Scales each sample to unit norm, making the model invariant to absolute stellar brightness.",
    code: "sklearn.preprocessing.normalize(X)",
  },
  {
    name: "Robust Scaling",
    desc: "Centers and scales using median and IQR — robust to the outlier flux spikes common in stellar data.",
    code: "RobustScaler().fit_transform(X_train)",
  },
  {
    name: "SMOTE Oversampling",
    desc: "Synthesizes new exoplanet-class examples to balance the heavily skewed training distribution (~0.7 % positive).",
    code: "SMOTE().fit_resample(X_train, y_train)",
  },
];

const archLayers = [
  {
    name: "Input",
    detail: "Shape (3197, 1) — 3,197 flux time-steps per star",
    bg: "rgba(15,23,42,0.9)",
    border: "rgba(100,116,139,0.35)",
    color: "#94A3B8",
  },
  {
    name: "Conv1D  (8 filters, kernel=5, ReLU)",
    detail: "Detects short-range transit dip patterns across 5 time-steps",
    bg: "rgba(30,58,95,0.5)",
    border: "rgba(59,130,246,0.45)",
    color: "#3B82F6",
  },
  {
    name: "MaxPooling1D  (pool=4, stride=4)",
    detail: "Reduces sequence length by 4×, retaining dominant activations",
    bg: "rgba(15,23,42,0.7)",
    border: "rgba(59,130,246,0.2)",
    color: "#93C5FD",
  },
  {
    name: "Conv1D  (16 filters, kernel=3, ReLU, same padding)",
    detail: "Learns medium-range composite features with doubled filter count",
    bg: "rgba(30,58,95,0.5)",
    border: "rgba(59,130,246,0.45)",
    color: "#3B82F6",
  },
  {
    name: "MaxPooling1D  (pool=4, stride=4)",
    detail: "Further reduces spatial resolution, building abstract representations",
    bg: "rgba(15,23,42,0.7)",
    border: "rgba(59,130,246,0.2)",
    color: "#93C5FD",
  },
  {
    name: "Flatten",
    detail: "Converts 2-D feature maps to 1-D vector for the dense classifier",
    bg: "rgba(15,23,42,0.7)",
    border: "rgba(100,116,139,0.25)",
    color: "#64748B",
  },
  {
    name: "Dense (1 unit, Sigmoid)",
    detail: "Outputs P(exoplanet) — classified as positive when > 0.5",
    bg: "rgba(30,58,95,0.5)",
    border: "rgba(59,130,246,0.5)",
    color: "#F1F5F9",
  },
];

const epochHighlights = [
  { label: "Peak Val Acc",    value: "99.47 %", sub: "Epochs 11, 17-20" },
  { label: "Best Val Loss",   value: "0.0173",  sub: "Epoch 13"          },
  { label: "Final Train Acc", value: "99.99 %", sub: "Epoch 20"          },
  { label: "Batch Size",      value: "64",       sub: "with shuffle"     },
];

const findings = [
  {
    icon: "🌊",
    title: "Frequency-Domain Features Are Key",
    body: "Applying FFT before the CNN converts periodic transit dips into prominent spectral peaks, making them far easier for convolutional filters to detect than in the raw time domain.",
  },
  {
    icon: "⚖️",
    title: "SMOTE Resolves Class Imbalance",
    body: "Without oversampling, a naive classifier could score >99 % accuracy by predicting 'non-host' for every star. SMOTE forces the model to genuinely learn exoplanet signatures.",
  },
  {
    icon: "🎯",
    title: "Perfect Recall on Test Set",
    body: "All 5 confirmed exoplanet hosts in the test set were correctly identified (0 false negatives), which is the most critical metric for a planetary detection screening pipeline.",
  },
  {
    icon: "🏗️",
    title: "Lightweight Architecture Suffices",
    body: "Only 2 convolutional layers with 8 and 16 filters achieve near-perfect performance, demonstrating that the preprocessed features are highly linearly separable.",
  },
];
