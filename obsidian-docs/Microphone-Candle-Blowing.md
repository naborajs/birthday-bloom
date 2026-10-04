# Microphone-Adaptive 3D Candle Blowing Architecture

🌐 **Canonical Web Documentation**: [https://naborajs.me/projects/birthday-bloom/docs/microphone-candle-blowing](https://naborajs.me/projects/birthday-bloom/docs/microphone-candle-blowing)

> **Status**: Production Feature  
> **Topic**: Web Audio API Acoustic Breath Detection, 3D WebGL Flame Physics & Sensory Interactivity  
> **Target Audience**: Birthday Bloom Developers, Audio Engineers & 3D Interactive Designers

---

## 1. Overview & Concept

In traditional web birthday greetings, "blowing out the candles" is usually an ordinary button click. Birthday Bloom revolutionizes this milestone with **Microphone-Adaptive Candle Blowing**:
1. The web application dynamically connects to the device microphone via Web Audio API.
2. The user blows air directly onto their phone or laptop microphone.
3. The acoustic low-frequency air turbulence is detected and computed in real time.
4. The 3D candle flames flutter, bend backward, and cool in direct physical response to the user's breath intensity.
5. Once sufficient breath energy is sustained (~550ms), the flame extinguishes and curling smoke wisps rise into the air with audio and haptic feedback.

```
                              ACOUSTIC BLOW PIPELINE
     ┌───────────────────────┐
     │  User Blows Air into  │
     │      Microphone       │
     └──────────┬────────────┘
                ▼
     ┌───────────────────────┐      Web Audio AnalyserNode
     │ Low-Frequency Analysis│ ───► FFT Energy (80Hz - 600Hz)
     └──────────┬────────────┘      Turbulence vs Vocal Filtering
                ▼
     ┌───────────────────────┐      useMicrophoneBlow Hook
     │ Smoothed BlowIntensity│ ───► Normalized value (0.0 to 1.0)
     └──────────┬────────────┘
                ▼
     ┌───────────────────────┐      Cake3D.tsx (Three.js / R3F)
     │ Real-time Flame Tilt  │ ───► • Flame lean: rotation.z = -wind * 0.6
     │ & Flutter Physics     │      • Flutter scale: sin(t * 24) * wind
     └──────────┬────────────┘      • Outer amber glow cooling
                ▼
     ┌───────────────────────┐      Phase Transition
     │ Flame Extinguished +  │ ───► • Candles blow out
     │ Curling Smoke Wisps   │      • Boom chime & haptic trigger
     └───────────────────────┘
```

---

## 2. Acoustic Breath Detection Architecture

### 2.1 The Physics of Breath vs. Speech

Blowing air onto a microphone diaphragm causes high-amplitude turbulent air pressure fluctuations in the **low-to-mid frequency range (80 Hz – 600 Hz)**, distinct from ambient room noise or speech harmonics.

Implemented in [`useMicrophoneBlow.ts`](file:///d:/Projects/Website/birthday-bloom/src/hooks/useMicrophoneBlow.ts):
* **Sample Rate & FFT**: 256-point FFT with low smoothing time constant (`0.2`).
* **Energy Extraction**: Low-frequency bin accumulator targeting frequency bins 1 through 8.
* **Low-Pass Smoothing**: Exponential moving average (EMA) filter prevents flame jitter while retaining instant responsiveness:
  $$\text{smoothed} = \text{smoothed} \times 0.65 + \text{raw} \times 0.35$$
* **Accumulated Energy Threshold**: Requires sustained blowing over ~550ms rather than a single sudden click or clap, ensuring emotional intentionality.

---

## 3. Real-Time 3D Flame Simulation

Implemented in [`Cake3D.tsx`](file:///d:/Projects/Website/birthday-bloom/src/components/birthday/Cake3D.tsx):
* **Flame Lean**: As `blowIntensity` increases, the flame rotates on its Z-axis away from the camera (`rotation.z = -wind * 0.6`).
* **Wind Turbulence**: A high-frequency sine oscillator flutters the flame's X-scale proportionally to breath speed.
* **Outer Amber Cooling**: The outer flame mesh shrinks and dims slightly as the flame is cooled by the incoming air stream.
* **Extinguish State**: Once the blow threshold completes, `lit` transitions to `false` and multi-layered translucent smoke spheres curl upward and expand.

---

## 4. Privacy, Lifecycle & Graceful Fallbacks

### 4.1 Strict Privacy & Battery Guardrails
* **Scoped Lifecycle**: The microphone stream is **only** requested when entering the `blow-intro` phase.
* **Automatic Teardown**: Upon candle extinguishing or leaving the screen, all `MediaStreamTrack` instances are immediately stopped and the `AudioContext` is cleanly closed, releasing hardware access.
* **Zero Cloud Transmission**: All audio analysis runs 100% locally on the client's GPU/CPU; no audio data is ever recorded or transmitted.

### 4.2 Inclusive Fallbacks
* If microphone permission is denied, unprompted, or running in an unsupported environment:
  * A tap/click fallback is permanently available: tapping anywhere on the cake or the breath pill triggers candle extinguishing immediately.
  * Screen readers and keyboard navigation (Enter / Space) can also trigger candle blowing.

---

## 5. Configuration & Environment Flags

| Key | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `VITE_ENABLE_MIC_BLOW` | Boolean | `true` | Enables or disables acoustic microphone candle blowing |
| `?micBlow=true/false` | URL Param | `true` | Overrides microphone candle blowing per shareable celebration link |

---

## 6. Multilingual Localization

The feature is fully localized across all 4 supported languages in [`src/i18n/locales/`](file:///d:/Projects/Website/birthday-bloom/src/i18n/locales/):

| Language | Locale Key: `cake.blowIntoMic` |
| :--- | :--- |
| **English** | "💨 Blow air into your microphone to extinguish the candles" |
| **Bengali** | "💨 মোমবাতি নেভাতে আপনার মাইক্রোফোনে ফুঁ দিন" |
| **Hindi** | "💨 मोमबत्तियाँ बुझाने के लिए अपने माइक्रोफ़ोन में फूँक मारें" |
| **French** | "💨 Soufflez dans votre micro pour éteindre les bougies" |
