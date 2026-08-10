export interface Service {
  num: string;
  title: string;
  slug: string;
  tagline: string;
  price: string;
  note: string;
  revisions: string;
  detail: string;
  wire: string;
  glow: string;
  hex: string;
  reqs: string[];
  reqsLabel?: string;
  shopHref?: string;
  firstOrderOffer?: boolean;
}

export const services: Service[] = [
  {
    num: '01', title: 'Mastering', slug: 'mastering', tagline: 'Loudness / Translation',
    price: '£30', note: 'single track, £20/track on EPs (2+)', revisions: '2 revisions included on every order', firstOrderOffer: true,
    detail: 'A final master on an already-mixed track: commercial loudness, tonal balance and translation across systems via an analogue chain. Discounted per-track rate for EPs.',
    wire: 'bg-yellow-400', glow: 'shadow-[0_0_8px_rgba(250,204,21,0.9)]', hex: '#facc15',
    reqs: [
      'One stereo mixdown, 24-bit WAV exported from 0:00.',
      'Leave roughly -3dB of headroom on the mix.',
      'No limiter or dynamic processing on the master bus.',
      'A reference track (.mp3 or a link in a text file).',
      'Any notes and preferences you have so far.',
    ],
  },
  {
    num: '02', title: 'Mixing', slug: 'mixing', tagline: 'Balance / Width / Depth',
    price: '£50', note: 'Mastering included, 10 stems, scales to 30+', revisions: '2 revisions included on every order', firstOrderOffer: true,
    detail: 'Stems mixed and balanced into a cohesive, club-ready record: gain staging, EQ, dynamics and spatial placement. Mastering is included, so the track leaves release-ready. Priced by stem count.',
    wire: 'bg-blue-500', glow: 'shadow-[0_0_8px_rgba(59,130,246,0.9)]', hex: '#3b82f6',
    reqs: [
      'All stems exported from 0:00 and clearly named (e.g. Kick, Bass, Lead).',
      'Sent as a single .zip at the project sample rate, 24-bit WAV.',
      'A reference track (.mp3 or a link in a text file).',
      'No master-bus processing left on the stems.',
      'A rough mix if you have one.',
      'Any notes and preferences you have so far.',
    ],
  },
  {
    num: '03', title: 'Production', slug: 'production', tagline: 'Ghost / Finish Your Track',
    price: '£120', note: 'Ghost Production from £250', revisions: 'Revision count set per project',
    detail: 'Bring a half-finished idea or a blank session. We handle composition, arrangement and sound selection to a mix-ready stage, from Finish Your Track up to a fully exclusive, royalty-free Ghost Production.',
    wire: 'bg-red-500', glow: 'shadow-[0_0_8px_rgba(239,68,68,0.9)]', hex: '#ef4444',
    reqs: [
      'Your DAW session or any stems/ideas you already have, exported from 0:00.',
      'At least one reference track (.mp3 or a link in a text file).',
      'A short note on the genre, target vibe and any parts you want kept.',
    ],
  },
  {
    num: '04', title: 'Education', slug: 'education', tagline: '1-on-1 Ableton',
    price: '£25', note: 'per hour, analysis call from £40', revisions: '',
    detail: 'One-to-one sessions on Ableton workflow, sound design fundamentals, or a technical breakdown of your own session. Book a single call or an ongoing run of lessons.',
    wire: 'bg-green-500', glow: 'shadow-[0_0_8px_rgba(34,197,94,0.9)]', hex: '#22c55e',
    reqs: [
      'The session or project you want to work through (Ableton preferred).',
      'A list of goals or questions for the call.',
      'A stable connection for Discord or Muse screen-share.',
    ],
  },
  {
    num: '05', title: 'Tools & Samples', slug: 'sounddesign', tagline: 'Custom Patches',
    price: 'From £5', note: 'tools from £5, custom on enquiry', revisions: '',
    detail: 'Bespoke patches, racks and one-shots built around your reference. Prefer something off-the-shelf? Sample packs, stock FX racks and the Nodegen VST are fixed-price tools.',
    wire: 'bg-purple-500', glow: 'shadow-[0_0_8px_rgba(168,85,247,0.9)]', hex: '#a855f7', shopHref: '/shop',
    reqsLabel: 'Workflow and production tools',
    reqs: [],
  },
  {
    num: '06', title: 'Track Analysis', slug: 'consulting', tagline: 'Feedback / Breakdown',
    price: '£15', note: 'per track', revisions: '',
    detail: 'A detailed listen-through of your track with honest technical and creative feedback: mix balance, arrangement, sound selection and where it stands next to reference records. Includes technical analysis with annotated screenshots (metering, EQ, spectrum) and clear explanations of what each one shows and how to fix it. Delivered as written notes or a call.',
    wire: 'bg-orange-500', glow: 'shadow-[0_0_8px_rgba(249,115,22,0.9)]', hex: '#f97316',
    reqs: [
      'The track as an .mp3 or WAV, or a private streaming link.',
      'A reference track or two for context (.mp3 or a link).',
      'The genre and where you feel it is falling short.',
      'Any specific areas or questions you want focused on.',
    ],
  },
];
