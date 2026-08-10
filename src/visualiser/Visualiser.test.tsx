import { render, screen, fireEvent } from '@testing-library/react';
import { Visualiser } from './Visualiser';

const playMock = vi.fn();
const pauseMock = vi.fn();
const seekMock = vi.fn();
const volumeMock = vi.fn();
let playingState = false;

vi.mock('howler', () => {
  class Howl {
    constructor(_opts: unknown) {}
    play = () => { playingState = true; playMock(); };
    pause = () => { playingState = false; pauseMock(); };
    playing = () => playingState;
    seek = (...args: unknown[]) => { if (args.length) seekMock(args[0]); return 0; };
    duration = () => 100;
    volume = volumeMock;
    unload = () => {};
  }
  return { Howl, Howler: { ctx: null, masterGain: { connect: () => {} } } };
});

vi.mock('three', () => {
  return {
    Scene: class { add() {} },
    PerspectiveCamera: class { position = { z: 0 }; aspect = 1; updateProjectionMatrix() {} },
    WebGLRenderer: class {
      domElement = document.createElement('canvas');
      setSize() {}
      render() {}
      dispose() {}
    },
    BufferGeometry: class {
      attributes: Record<string, { array: Float32Array; needsUpdate: boolean }> = {};
      setAttribute(name: string, attr: { array: Float32Array }) { this.attributes[name] = { array: attr.array, needsUpdate: false }; }
      dispose() {}
    },
    BufferAttribute: class { constructor(public array: Float32Array, public itemSize: number) {} },
    PointsMaterial: class { size = 0; color = { setHSL: () => {} }; dispose() {} },
    Points: class { rotation = { x: 0, y: 0, z: 0 }; scale = { setScalar: () => {} }; material = { color: { setHSL: () => {} } }; },
    Color: class { getHSL(target: { h: number; s: number; l: number }) { target.h = 0; target.s = 0; target.l = 0; } },
    AdditiveBlending: 1,
  };
});

vi.mock('gsap', () => ({ gsap: { registerPlugin: () => {}, set: () => {} } }));
vi.mock('gsap/Draggable', () => ({
  Draggable: { create: () => [{ kill: () => {} }] },
}));

const tracks = [
  { label: 'Track One', src: '/audio/one.mp3' },
  { label: 'Track Two', src: '/audio/two.mp3' },
];

describe('Visualiser', () => {
  beforeEach(() => {
    playingState = false;
    playMock.mockClear();
    pauseMock.mockClear();
    seekMock.mockClear();
  });

  it('renders one option per track and starts on Play', () => {
    render(<Visualiser tracks={tracks} />);
    expect(screen.getByRole('option', { name: 'Track One' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Track Two' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
  });

  it('toggles Play/Pause and calls the underlying Howl methods', () => {
    render(<Visualiser tracks={tracks} />);
    const button = screen.getByRole('button', { name: 'Play' });
    fireEvent.click(button);
    expect(playMock).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    expect(pauseMock).toHaveBeenCalled();
  });

  it('seeks when the scrub bar is clicked', () => {
    const { container } = render(<Visualiser tracks={tracks} />);
    const scrub = container.querySelector('.cursor-pointer.relative.overflow-hidden') as HTMLElement;
    fireEvent.click(scrub, { clientX: 50 });
    expect(seekMock).toHaveBeenCalled();
  });
});
