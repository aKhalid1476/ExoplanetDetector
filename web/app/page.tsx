import { AccuracyChart, LossChart } from "./components/TrainingChart";

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "#05080f", color: "#e2e8f0" }}>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-6 py-28 overflow-hidden star-bg"
        style={{ minHeight: "60vh" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(59,130,246,0.12) 0%, transparent 70%)",
          }}
        />
        <p className="text-sm font-semibold tracking-widest mb-4" style={{ color: "#60a5fa" }}>
          MACHINE LEARNING · ASTROPHYSICS
        </p>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          <span
            style={{
              background: "linear-gradient(135deg, #60a5fa, #a78bfa, #34d399)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Exoplanet Detector
          </span>
        </h1>
        <p className="max-w-2xl text-lg md:text-xl mb-10" style={{ color: "#94a3b8" }}>
          A 1-D Convolutional Neural Network trained on NASA Kepler mission light curves
          to classify stars as{" "}
          <strong style={{ color: "#34d399" }}>exoplanet hosts</strong> or{" "}
          <strong style={{ color: "#f472b6" }}>non-hosts</strong> with{" "}
          <strong style={{ color: "#60a5fa" }}>99.47 % validation accuracy</strong>.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
          {[
            { label: "Val Accuracy", value: "99.47 %", color: "#34d399" },
            { label: "Val Loss",     value: "0.0173",  color: "#60a5fa" },
            { label: "Epochs",       value: "20",       color: "#a78bfa" },
            { label: "Architecture", value: "Conv1D",   color: "#fb923c" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-4"
              style={{
                background: "rgba(15,23,42,0.85)",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              <div className="text-2xl font-bold" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-xs mt-1" style={{ color: "#64748b" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20 space-y-16">

        {/* ── Dataset ──────────────────────────────────────── */}
        <Section title="Dataset" accent="#60a5fa">
          <p style={{ color: "#94a3b8" }} className="mb-6 text-base leading-relaxed">
            The dataset originates from the{" "}
            <strong style={{ color: "#e2e8f0" }}>NASA Kepler Space Observatory</strong>, which
            monitors stellar brightness over time to detect the tiny periodic dips caused by a
            planet transiting in front of its star. Each sample is a time-series of{" "}
            <strong style={{ color: "#60a5fa" }}>3,197 flux measurements</strong>.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                label: "Training set",
                detail: "5,087 stars · 37 exoplanet hosts (0.73 %)",
                color: "#60a5fa",
              },
              {
                label: "Test set",
                detail: "570 stars · 5 exoplanet hosts (0.88 %)",
                color: "#34d399",
              },
            ].map((d) => (
              <Card key={d.label}>
                <div
                  className="text-xs font-semibold uppercase tracking-widest mb-1"
                  style={{ color: d.color }}
                >
                  {d.label}
                </div>
                <div style={{ color: "#cbd5e1" }}>{d.detail}</div>
              </Card>
            ))}
          </div>
          <InfoBox color="#fb923c" className="mt-4">
            The dataset is severely <strong>class-imbalanced</strong>. Only ~0.7 % of stars host
            confirmed exoplanets, which motivated the use of{" "}
            <strong>SMOTE oversampling</strong> during preprocessing.
          </InfoBox>
        </Section>

        {/* ── Preprocessing Pipeline ───────────────────────── */}
        <Section title="Preprocessing Pipeline" accent="#a78bfa">
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
                  border: "1px solid rgba(139,92,246,0.25)",
                }}
              >
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: "rgba(139,92,246,0.2)", color: "#a78bfa" }}
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
                  <code className="text-xs mt-1 block" style={{ color: "#a78bfa" }}>
                    {step.code}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── CNN Architecture ─────────────────────────────── */}
        <Section title="CNN Architecture" accent="#34d399">
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
              { label: "Loss",      value: "Binary Cross-Entropy", color: "#f472b6" },
              { label: "Optimizer", value: "Adam",                 color: "#60a5fa" },
              { label: "Metric",    value: "Accuracy",             color: "#34d399" },
            ].map((c) => (
              <Card key={c.label} className="text-center">
                <div
                  className="text-xs uppercase tracking-widest mb-1"
                  style={{ color: "#64748b" }}
                >
                  {c.label}
                </div>
                <div className="font-semibold" style={{ color: c.color }}>
                  {c.value}
                </div>
              </Card>
            ))}
          </div>
        </Section>

        {/* ── Training ─────────────────────────────────────── */}
        <Section title="Training" accent="#fb923c">
          <p style={{ color: "#94a3b8" }} className="mb-8 text-base leading-relaxed">
            The model was trained for{" "}
            <strong style={{ color: "#e2e8f0" }}>20 epochs</strong> with a{" "}
            <strong style={{ color: "#e2e8f0" }}>batch size of 64</strong>. SMOTE-oversampled
            training data was used to fit the model, while the raw held-out test set provided
            validation — reflecting the real-world class distribution.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <SectionLabel color="#60a5fa">Accuracy per Epoch</SectionLabel>
              <AccuracyChart />
            </div>
            <div>
              <SectionLabel color="#f472b6">Loss per Epoch</SectionLabel>
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
                <div className="text-xl font-bold" style={{ color: h.color }}>
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
        <Section title="Confusion Matrix (Test Set)" accent="#f472b6">
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
                  style={{ color: "#60a5fa" }}
                >
                  Predicted: No
                </div>
                <div
                  className="text-xs font-semibold py-1"
                  style={{ color: "#34d399" }}
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
                <MatrixCell value={562} label="TN" color="#1e3a5f" textColor="#60a5fa" />
                <MatrixCell value={3}   label="FP" color="#3b1f2b" textColor="#f472b6" />
              </div>
              <div className="grid grid-cols-3 gap-1 text-center">
                <div
                  className="flex items-center justify-end pr-2 text-xs font-semibold"
                  style={{ color: "#94a3b8" }}
                >
                  Actual: Yes
                </div>
                <MatrixCell value={0}   label="FN" color="#3b1f2b" textColor="#fb923c" />
                <MatrixCell value={5}   label="TP" color="#1a3b2e" textColor="#34d399" />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                {[
                  { label: "Precision",    value: "62.5 %",  color: "#a78bfa", note: "TP / (TP + FP)" },
                  { label: "Recall",       value: "100 %",   color: "#34d399", note: "TP / (TP + FN)" },
                  { label: "F1 Score",     value: "76.9 %",  color: "#fb923c", note: "Harmonic mean"  },
                  { label: "Overall Acc.", value: "99.47 %", color: "#60a5fa", note: "(TP+TN) / Total" },
                ].map((m) => (
                  <Card key={m.label}>
                    <div
                      className="text-xs uppercase tracking-widest"
                      style={{ color: "#64748b" }}
                    >
                      {m.label}
                    </div>
                    <div className="text-xl font-bold my-0.5" style={{ color: m.color }}>
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

          <InfoBox color="#34d399" className="mt-8">
            <strong>Zero false negatives</strong> — every confirmed exoplanet host in the test
            set was correctly detected. The 3 false positives are an acceptable trade-off; these
            candidate stars would simply be reviewed by human astronomers as the next step.
          </InfoBox>
        </Section>

        {/* ── Key Findings ─────────────────────────────────── */}
        <Section title="Key Findings" accent="#a78bfa">
          <div className="grid md:grid-cols-2 gap-4">
            {findings.map((f) => (
              <div
                key={f.title}
                className="flex gap-4 rounded-xl p-5"
                style={{
                  background: "rgba(15,23,42,0.85)",
                  border: "1px solid rgba(139,92,246,0.2)",
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
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-1 w-8 rounded-full" style={{ background: accent }} />
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
  color,
  className = "",
}: {
  children: React.ReactNode;
  color: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl p-4 text-sm ${className}`}
      style={{
        background: `${color}18`,
        border: `1px solid ${color}40`,
        color: "#cbd5e1",
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <div
      className="text-xs font-semibold uppercase tracking-widest mb-3"
      style={{ color }}
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
    border: "rgba(100,116,139,0.4)",
    color: "#94a3b8",
  },
  {
    name: "Conv1D  (8 filters, kernel=5, ReLU)",
    detail: "Detects short-range transit dip patterns across 5 time-steps",
    bg: "rgba(30,58,95,0.5)",
    border: "rgba(96,165,250,0.5)",
    color: "#60a5fa",
  },
  {
    name: "MaxPooling1D  (pool=4, stride=4)",
    detail: "Reduces sequence length by 4×, retaining dominant activations",
    bg: "rgba(15,23,42,0.7)",
    border: "rgba(96,165,250,0.25)",
    color: "#93c5fd",
  },
  {
    name: "Conv1D  (16 filters, kernel=3, ReLU, same padding)",
    detail: "Learns medium-range composite features with doubled filter count",
    bg: "rgba(46,16,101,0.5)",
    border: "rgba(167,139,250,0.5)",
    color: "#a78bfa",
  },
  {
    name: "MaxPooling1D  (pool=4, stride=4)",
    detail: "Further reduces spatial resolution, building abstract representations",
    bg: "rgba(15,23,42,0.7)",
    border: "rgba(167,139,250,0.25)",
    color: "#c4b5fd",
  },
  {
    name: "Flatten",
    detail: "Converts 2-D feature maps to 1-D vector for the dense classifier",
    bg: "rgba(15,23,42,0.7)",
    border: "rgba(100,116,139,0.3)",
    color: "#64748b",
  },
  {
    name: "Dense (1 unit, Sigmoid)",
    detail: "Outputs P(exoplanet) — classified as positive when > 0.5",
    bg: "rgba(20,83,45,0.5)",
    border: "rgba(52,211,153,0.5)",
    color: "#34d399",
  },
];

const epochHighlights = [
  { label: "Peak Val Acc",    value: "99.47 %", color: "#34d399", sub: "Epochs 11, 17-20" },
  { label: "Best Val Loss",   value: "0.0173",  color: "#60a5fa", sub: "Epoch 13"          },
  { label: "Final Train Acc", value: "99.99 %", color: "#a78bfa", sub: "Epoch 20"          },
  { label: "Batch Size",      value: "64",       color: "#fb923c", sub: "with shuffle"     },
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
