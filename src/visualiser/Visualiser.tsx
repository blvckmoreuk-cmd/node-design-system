import { useEffect, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent, ChangeEvent } from 'react';
import * as THREE from 'three';
import { Howl, Howler } from 'howler';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { buildShapeSet, PARTICLE_COUNT } from './shapes';
import { computeBassRaw, updateEnvelope } from './envelope';

gsap.registerPlugin(Draggable);

export interface VisualiserTrack {
  label: string;
  src: string;
}

export interface VisualiserProps {
  tracks: VisualiserTrack[];
}

const HOLD_MS = 5200;
const MORPH_MS = 2200;
const VIZ_HEIGHT = 288;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function Visualiser({ tracks }: VisualiserProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const knobWrapperRef = useRef<HTMLDivElement>(null);
  const glowCoreRef = useRef<HTMLDivElement>(null);
  const knobHitAreaRef = useRef<HTMLDivElement>(null);
  const scrubRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const ensureAnalyserRef = useRef<() => void>(() => {});

  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const soundRef = useRef<InstanceType<typeof Howl> | null>(null);
  const volumeRef = useRef(0.5);

  // ---- Audio: create/replace the Howl instance when the track changes ----
  useEffect(() => {
    const sound = new Howl({ src: [tracks[trackIndex].src], html5: false, volume: volumeRef.current });
    soundRef.current = sound;
    setPlaying(false);
    return () => {
      sound.unload();
    };
  }, [trackIndex, tracks]);

  // ---- Scrub bar progress polling ----
  useEffect(() => {
    const id = setInterval(() => {
      const sound = soundRef.current;
      if (sound && sound.playing() && sound.duration() > 0 && progressRef.current) {
        progressRef.current.style.width = `${((sound.seek() as number) / sound.duration()) * 100}%`;
      }
    }, 100);
    return () => clearInterval(id);
  }, []);

  // ---- Three.js scene + render loop (mounts once) ----
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / VIZ_HEIGHT, 0.1, 1000);
    camera.position.z = 6.5;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, VIZ_HEIGHT);
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const resizeViz = () => {
      const w = container.clientWidth;
      renderer.setSize(w, VIZ_HEIGHT);
      camera.aspect = w / VIZ_HEIGHT;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resizeViz);
    resizeObserver.observe(container);

    const shapePositions = buildShapeSet(PARTICLE_COUNT);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(shapePositions[0].slice(), 3));
    const material = new THREE.PointsMaterial({
      size: 0.055,
      color: 0x2f6fed,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const hsl = { h: 0, s: 0, l: 0 };
    new THREE.Color(colorInputRef.current?.value || '#2f6fed').getHSL(hsl);
    const colorState = { hue: hsl.h, saturation: hsl.s };
    const onColorInput = () => {
      if (!colorInputRef.current) return;
      new THREE.Color(colorInputRef.current.value).getHSL(hsl);
      colorState.hue = hsl.h;
      colorState.saturation = hsl.s;
    };
    colorInputRef.current?.addEventListener('input', onColorInput);

    let shapeIndex = 0;
    let morphFrom = shapePositions[0];
    let morphTo = shapePositions[0];
    let morphProgress = 1;
    let phase: 'hold' | 'morphing' = 'hold';
    let phaseStart = performance.now();
    let bassEnvelope = 0;
    let analyser: AnalyserNode | null = null;
    let dataArray: Uint8Array<ArrayBuffer> | null = null;
    let frameId = 0;

    function startNextMorph(now: number) {
      const nextIndex = (shapeIndex + 1) % shapePositions.length;
      morphFrom = shapePositions[shapeIndex];
      morphTo = shapePositions[nextIndex];
      shapeIndex = nextIndex;
      phaseStart = now;
      morphProgress = 0;
    }

    function renderLoop() {
      frameId = requestAnimationFrame(renderLoop);
      const now = performance.now();
      const t = now * 0.001;

      if (phase === 'hold' && now - phaseStart > HOLD_MS) {
        startNextMorph(now);
        phase = 'morphing';
      } else if (phase === 'morphing') {
        morphProgress = Math.min(1, (now - phaseStart) / MORPH_MS);
        if (morphProgress >= 1) {
          phase = 'hold';
          phaseStart = now;
        }
      }
      const eased = easeInOutCubic(morphProgress);

      let vol = 0;
      const sound = soundRef.current;
      if (sound && sound.playing() && analyser && dataArray) {
        analyser.getByteFrequencyData(dataArray);
        const { volume, bassRaw } = computeBassRaw(dataArray, Howler.ctx?.sampleRate || 44100);
        vol = volume;
        bassEnvelope = updateEnvelope(bassEnvelope, bassRaw, 0.55, 0.07);
      } else {
        bassEnvelope = updateEnvelope(bassEnvelope, 0, 0.05, 0.05);
      }
      const bass = bassEnvelope;

      const positions = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const bx = morphFrom[i3] + (morphTo[i3] - morphFrom[i3]) * eased;
        const by = morphFrom[i3 + 1] + (morphTo[i3 + 1] - morphFrom[i3 + 1]) * eased;
        const bz = morphFrom[i3 + 2] + (morphTo[i3 + 2] - morphFrom[i3 + 2]) * eased;

        const dist = Math.sqrt(bx * bx + by * by + bz * bz) || 1;
        const pattern = Math.sin(bx * 3 + t * 1.4) * Math.cos(by * 3 + t * 1.4);
        const ambientDrift = 0.05 * Math.sin(t * 0.8 + i * 0.0015);
        const push = pattern * (vol * 0.6 + bass * 1.4) + ambientDrift;

        positions[i3] = bx + (bx / dist) * push;
        positions[i3 + 1] = by + (by / dist) * push;
        positions[i3 + 2] = bz + (bz / dist) * push;
      }
      geometry.attributes.position.needsUpdate = true;

      points.scale.setScalar(1 - bass * 0.12);
      material.size = 0.05 + bass * 0.09;
      points.rotation.y += 0.0022 + vol * 0.003 + bass * 0.004;
      points.rotation.x += 0.0013 + bass * 0.0018;
      points.rotation.z += 0.0008 + vol * 0.0012;
      points.material.color.setHSL(colorState.hue, colorState.saturation, 0.42 + bass * 0.22 + vol * 0.06);

      renderer.render(scene, camera);
    }
    renderLoop();

    ensureAnalyserRef.current = () => {
      if (!analyser && Howler.ctx) {
        analyser = Howler.ctx.createAnalyser();
        analyser.fftSize = 1024;
        Howler.masterGain.connect(analyser);
        dataArray = new Uint8Array(analyser.frequencyBinCount);
      }
    };

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      colorInputRef.current?.removeEventListener('input', onColorInput);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  // ---- Volume knob (GSAP Draggable) ----
  useEffect(() => {
    const hitArea = knobHitAreaRef.current;
    if (!hitArea) return;

    function updateKnobVisual(rotation: number) {
      if (knobWrapperRef.current) {
        knobWrapperRef.current.style.transform = `rotate(${rotation - 135}deg)`;
      }
      if (glowCoreRef.current) {
        glowCoreRef.current.style.background = `conic-gradient(from -135deg, rgba(47,111,237,0.35) 0deg ${rotation}deg, transparent 0deg)`;
      }
    }

    gsap.set(hitArea, { rotation: 135 });
    updateKnobVisual(135);

    const [draggable] = Draggable.create(hitArea, {
      type: 'rotation',
      bounds: { minRotation: 0, maxRotation: 270 },
      onDrag(this: { rotation: number }) {
        updateKnobVisual(this.rotation);
        volumeRef.current = this.rotation / 270;
        soundRef.current?.volume(volumeRef.current);
      },
    });

    return () => {
      draggable.kill();
    };
  }, []);

  function enablePlaybackAudioSession() {
    try {
      const audioSession = (navigator as unknown as { audioSession?: { type: string } }).audioSession;
      if (audioSession) audioSession.type = 'playback';
    } catch {
      /* unsupported browser */
    }
  }

  function handlePlayPause() {
    enablePlaybackAudioSession();
    ensureAnalyserRef.current();
    if (Howler.ctx?.state === 'suspended') Howler.ctx.resume();

    const sound = soundRef.current;
    if (!sound) return;
    if (sound.playing()) {
      sound.pause();
      setPlaying(false);
    } else {
      sound.play();
      setPlaying(true);
    }
  }

  function handleScrubClick(e: ReactMouseEvent<HTMLDivElement>) {
    const sound = soundRef.current;
    if (!sound || !scrubRef.current) return;
    const rect = scrubRef.current.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    sound.seek(pct * sound.duration());
  }

  function handleTrackChange(e: ChangeEvent<HTMLSelectElement>) {
    setTrackIndex(Number(e.target.value));
  }

  return (
    <div className="p-4 md:p-5 flex flex-col gap-4">
      <div id="canvas-container" ref={containerRef} className="w-full h-72 bg-[#030605] border border-black overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,rgba(47,111,237,0.07)_0%,transparent_55%)] pointer-events-none z-10" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.35)_50%)] bg-size-[100%_3px] pointer-events-none z-10 opacity-70" />
        <div className="absolute top-2 left-2 font-mono text-[8px] uppercase tracking-[0.3em] text-accent/70 z-10">RT / Spectrum</div>

        <div className="absolute top-3 left-3 right-3 sm:left-auto z-20 pointer-events-auto">
          <div className="relative w-full sm:w-80">
            <select
              value={trackIndex}
              onChange={handleTrackChange}
              className="w-full bg-black/65 backdrop-blur-sm border border-accent text-accent pl-3 pr-7 py-2 text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer outline-none appearance-none rounded-sm shadow-[0_4px_14px_rgba(0,0,0,0.55)]"
            >
              {tracks.map((track, i) => (
                <option key={track.src} value={i}>{track.label}</option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-accent text-[8px]">&#9660;</div>
          </div>
        </div>

        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-end justify-between gap-3 pointer-events-none">
          <div className="flex items-center gap-2 bg-black/45 backdrop-blur-sm border border-line-strong/70 px-2.5 py-1.5 pointer-events-auto">
            <input
              ref={colorInputRef}
              type="color"
              defaultValue="#2f6fed"
              aria-label="Particle colour"
              className="w-5 h-5 bg-transparent cursor-pointer"
            />
            <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-fg-faint">Vol</span>
            <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
              <div ref={glowCoreRef} className="absolute w-full h-full rounded-full pointer-events-none opacity-50 mix-blend-screen z-2" />
              <div className="absolute w-9 h-9 rounded-full bg-[#090b0d] shadow-[0_4px_10px_rgba(0,0,0,0.6)] z-1" />
              <div
                className="w-8 h-8 rounded-full cursor-ns-resize relative z-10 shadow-[inset_0_2px_2px_rgba(255,255,255,0.2),inset_0_-3px_8px_rgba(0,0,0,0.9)] border border-[#0a0a0a]"
                style={{ background: 'radial-gradient(circle at 50% 10%, #2a313c, #0a0c0f 80%)' }}
              >
                <div className="knob-knurl absolute inset-0 rounded-full opacity-25 mix-blend-overlay" />
                <div className="absolute inset-1 rounded-full bg-linear-to-b from-[#1c222b] to-[#0a0c0f] shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] border border-[#050505]" />
                <div ref={knobWrapperRef} className="knob-rotation-wrapper w-full h-full absolute top-0 left-0 pointer-events-none rounded-full">
                  <div className="knob-indicator w-0.5 h-3 mx-auto mt-1 rounded-full bg-linear-to-b from-[#f1f5f9] to-[#94a3b8] shadow-[inset_0_1px_2px_rgba(255,255,255,1),inset_0_-1px_2px_rgba(0,0,0,0.5)]" />
                </div>
                <div ref={knobHitAreaRef} className="absolute inset-0 z-20 rounded-full cursor-grab active:cursor-grabbing" />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePlayPause}
            className="pointer-events-auto px-5 py-2.5 bg-accent-dim text-white font-mono font-black text-[11px] uppercase tracking-[0.2em] border border-accent-dim active:translate-y-px transition-transform shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          >
            <span className="relative z-10">{playing ? 'Pause' : 'Play'}</span>
          </button>
        </div>
      </div>

      <div className="p-2.5 bg-[#050505] border border-black">
        <div ref={scrubRef} onClick={handleScrubClick} className="w-full h-2 bg-black cursor-pointer relative overflow-hidden">
          <div ref={progressRef} className="h-full bg-accent w-0 shadow-[0_0_10px_rgba(47,111,237,0.7)] relative" />
        </div>
      </div>
    </div>
  );
}
