import { render, screen } from '@testing-library/react';
import App from './App';

vi.mock('howler', async () => {
  const actual = await vi.importActual<typeof import('howler')>('howler');
  class Howl {
    play() {}
    pause() {}
    playing() { return false; }
    seek() { return 0; }
    duration() { return 0; }
    volume() {}
    unload() {}
  }
  return { ...actual, Howl, Howler: { ctx: null, masterGain: { connect: () => {} } } };
});

// jsdom has no real WebGL context — Visualiser's real Three.js scene setup
// would throw. Same lightweight mock as Visualiser.test.tsx.
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

vi.mock('gsap/Draggable', () => ({
  Draggable: { create: () => [{ kill: () => {} }] },
}));

describe('App', () => {
  it('renders the header, visualiser, and every service card', () => {
    render(<App />);
    expect(screen.getByText('Node')).toBeInTheDocument();
    expect(screen.getByText('RT / Spectrum')).toBeInTheDocument();
    for (const title of ['Mastering', 'Mixing', 'Production', 'Education', 'Tools & Samples', 'Track Analysis']) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it('opens the service modal when a card is clicked', async () => {
    const { default: userEvent } = await import('@testing-library/user-event');
    render(<App />);
    await userEvent.click(screen.getByText('Mastering'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
