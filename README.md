# ExoplanetDetector

A 1-D Convolutional Neural Network trained on NASA Kepler Space Observatory data to classify stars as exoplanet hosts from stellar flux time-series. The model achieves **99.47% validation accuracy** with **100% recall** on the held-out test set.

---

## The Problem

The Kepler Space Observatory monitors stellar brightness over time. When a planet orbits its host star, it periodically blocks a small fraction of the star's light, producing a characteristic dip in the flux curve — a **transit**. Detecting these transits is needle-in-a-haystack work: fewer than 1% of observed stars host confirmed exoplanets, making naive classification trivially accurate and genuinely useless.

The goal of this project is to build a model that reliably identifies the rare positive cases — exoplanet-hosting stars — without being fooled by the severe class imbalance.

---

## Dataset

**Source:** NASA Kepler Space Observatory

Each sample is a time-series of **3,197 flux measurements** from a single star. The dataset is split as follows:

| Split | Total Stars | Exoplanet Hosts | Class Ratio |
|-------|-------------|-----------------|-------------|
| Train | 5,087 | 37 | 0.73% |
| Test | 570 | 5 | 0.88% |

The class imbalance is the central challenge. A model that predicts "non-host" for every star would score over 99% accuracy while detecting zero exoplanets.

---

## Preprocessing Pipeline

Raw flux data is noisy, variable in absolute brightness across stars, and dominated by non-transit signals. Five sequential transformations convert it into a form where transit signatures are prominent and consistent.

### 1. Fourier Transform
```python
X = np.abs(np.fft.fft(X, axis=1))
```
Converts the time-domain flux signal to the frequency domain. Periodic transit dips — which repeat every orbital period — become sharp spectral peaks, far easier for convolutional filters to detect than subtle dips buried in noisy time-series data.

### 2. Savitzky-Golay Filter
```python
X = savgol_filter(X, window_length=21, polyorder=4, deriv=0)
```
Smooths the frequency-domain signal using a degree-4 polynomial fit over a 21-point window. This suppresses high-frequency noise while preserving the shape and amplitude of transit-related spectral peaks.

### 3. L2 Normalization
```python
X = normalize(X)
```
Scales each sample to unit norm, making the model invariant to the absolute brightness of a star. This ensures the CNN learns transit shape rather than absolute flux magnitude.

### 4. Robust Scaling
```python
X_train = RobustScaler().fit_transform(X_train)
```
Centers and scales features using the median and interquartile range rather than mean and standard deviation. Robust to the outlier flux spikes that are common in raw stellar photometry.

### 5. SMOTE Oversampling
```python
X_train, y_train = SMOTE().fit_resample(X_train, y_train)
```
Applied only to the training set. Synthesizes new exoplanet-class examples by interpolating between existing positive samples, balancing the severely skewed training distribution. The test set is left untouched to reflect the real-world class distribution.

---

## Model Architecture

A lightweight **1-D CNN** implemented in TensorFlow/Keras. The 1-D convolutions operate directly on the frequency-domain flux sequence.

```
Input (3197, 1)
    │
    ▼
Conv1D — 8 filters, kernel=5, ReLU
    │   Detects short-range transit spectral patterns across 5 time-steps
    ▼
MaxPooling1D — pool=4, stride=4
    │   Reduces sequence length by 4×, retains dominant activations
    ▼
Conv1D — 16 filters, kernel=3, ReLU, same padding
    │   Learns composite medium-range features with doubled filter count
    ▼
MaxPooling1D — pool=4, stride=4
    │   Further abstracts spatial representation
    ▼
Flatten
    │
    ▼
Dense — 1 unit, Sigmoid
    │   Outputs P(exoplanet); classified positive if > 0.5
```

**Training configuration:**
- Loss: Binary Cross-Entropy
- Optimizer: Adam
- Batch Size: 64
- Epochs: 20
- Shuffle: Enabled

---

## Training Results

| Epoch | Train Accuracy | Val Accuracy | Train Loss | Val Loss |
|-------|---------------|--------------|------------|----------|
| 1 | 85.58% | 95.61% | 0.3282 | 0.1580 |
| 2 | 97.91% | 99.12% | 0.0721 | 0.0792 |
| 13 | 99.83% | 99.30% | 0.0052 | **0.0173** |
| 20 | 99.99% | **99.47%** | 0.0014 | 0.0407 |

The model converges rapidly — reaching 99% validation accuracy by epoch 2. Best validation loss (0.0173) is achieved at epoch 13; peak validation accuracy (99.47%) is sustained from epoch 11 onwards.

---

## Evaluation

Evaluated on the held-out test set of 570 stars (5 confirmed exoplanet hosts).

### Confusion Matrix

|  | Predicted: Non-Host | Predicted: Exoplanet Host |
|--|---------------------|--------------------------|
| **Actual: Non-Host** | 562 (TN) | 3 (FP) |
| **Actual: Exoplanet Host** | 0 (FN) | 5 (TP) |

### Metrics

| Metric | Value |
|--------|-------|
| Overall Accuracy | 99.47% |
| Precision | 62.5% |
| Recall | **100%** |
| F1 Score | 76.9% |

### Why Recall Is the Right Metric

In a planetary detection pipeline, a **false negative** (missing a real exoplanet host) is far costlier than a **false positive** (flagging a non-host for human review). The model achieves **zero false negatives** — all 5 confirmed exoplanet hosts in the test set are correctly identified. The 3 false positives represent a small, acceptable burden on follow-up review.

---

## Key Findings

**Frequency-domain preprocessing is critical.** The FFT step is the single most impactful transformation. Periodic transit signals, which are nearly invisible as subtle dips in raw time-series data, become sharp, prominent spectral peaks after transformation — highly discriminative features for convolutional filters.

**SMOTE enables genuine learning.** Without oversampling, a model maximizes accuracy by learning to predict the majority class exclusively. SMOTE forces the CNN to learn the actual spectral signature of exoplanet transits rather than exploiting class imbalance.

**A shallow architecture is sufficient.** Two convolutional layers with just 8 and 16 filters achieve near-perfect performance. After the preprocessing pipeline, the features are highly separable — the CNN does not need to be deep to distinguish them.

**Perfect recall is achievable.** The combination of frequency-domain feature extraction and class balancing produces a model that correctly identifies every exoplanet host in the test set, which is the operationally meaningful outcome for an astronomical screening tool.

---

## Repository Structure

```
ExoplanetDetector/
├── ml_model/
│   └── ExoplanetDetectorCNN.ipynb   # Full training pipeline
└── web/                             # Next.js interactive report
```
