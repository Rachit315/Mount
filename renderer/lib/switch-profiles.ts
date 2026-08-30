export type SwitchType = 'linear' | 'tactile' | 'clicky';

export interface SwitchFilesManifest {
  press: string[];
  release: string[];
}

export interface SwitchProfile {
  id: string;
  name: string;
  brand: string;
  type: SwitchType;
  color: string;
  tag: string;
  description: string;
  actuation: string;
  bottomOut: string;
  soundDescription: string;
  files: SwitchFilesManifest;
}

// ─────────────────────────────────────────────────────────────────────────
// 13 Authentic mechanical switch profiles sampled from real hardware
// ─────────────────────────────────────────────────────────────────────────

export const switchProfiles: SwitchProfile[] = [
  {
    id: 'alpaca',
    name: 'Alpaca Linear',
    brand: 'Durock / JWK',
    type: 'linear',
    color: '#EC4899',
    tag: 'Creamy Clack',
    description: 'Ultra-smooth JWK linear with factory lubrication feel and balanced bottom-out.',
    actuation: '50g',
    bottomOut: '62g',
    soundDescription: 'Creamy, balanced clack with soft bottom-out resonance.',
    files: {
      press: ['BACKSPACE', 'ENTER', 'GENERIC_R0', 'GENERIC_R1', 'GENERIC_R2', 'GENERIC_R3', 'GENERIC_R4', 'SPACE'],
      release: ['BACKSPACE', 'ENTER', 'GENERIC', 'SPACE'],
    },
  },
  {
    id: 'blackink',
    name: 'Gateron Black Ink V2',
    brand: 'Gateron',
    type: 'linear',
    color: '#475569',
    tag: 'Deep Thock',
    description: 'Iconic smoky transparent housing delivering deep, low-pitched acoustic bottom-out.',
    actuation: '60g',
    bottomOut: '70g',
    soundDescription: 'Deep, bassy thock with substantial acoustic weight.',
    files: {
      press: ['BACKSPACE', 'ENTER', 'GENERIC_R0', 'GENERIC_R1', 'GENERIC_R2', 'GENERIC_R3', 'GENERIC_R4', 'SPACE'],
      release: ['BACKSPACE', 'ENTER', 'GENERIC', 'SPACE'],
    },
  },
  {
    id: 'bluealps',
    name: 'Alps SKCM Blue',
    brand: 'Alps Electric',
    type: 'clicky',
    color: '#0284C7',
    tag: 'Vintage Pop',
    description: 'Legendary vintage 1980s complicated Alps click leaf with sharp tactile click.',
    actuation: '50g',
    bottomOut: '70g',
    soundDescription: 'Sharp, metallic vintage click with resonant cavity reverberation.',
    files: {
      press: ['BACKSPACE', 'ENTER', 'GENERIC_R0', 'GENERIC_R1', 'GENERIC_R2', 'GENERIC_R3', 'GENERIC_R4', 'SPACE'],
      release: ['BACKSPACE', 'ENTER', 'GENERIC', 'SPACE'],
    },
  },
  {
    id: 'boxnavy',
    name: 'Kailh Box Navy',
    brand: 'Kailh',
    type: 'clicky',
    color: '#1E3A8A',
    tag: 'Heavy Clickbar',
    description: 'Thick clickbar mechanism delivering an ultra-tactile bump and crisp acoustic snap.',
    actuation: '60g',
    bottomOut: '90g',
    soundDescription: 'Authoritative, loud double-click snap on both downstroke and upstroke.',
    files: {
      press: ['BACKSPACE', 'ENTER', 'GENERIC_R0', 'GENERIC_R1', 'GENERIC_R2', 'GENERIC_R3', 'GENERIC_R4', 'SPACE'],
      release: ['BACKSPACE', 'ENTER', 'GENERIC', 'SPACE'],
    },
  },
  {
    id: 'buckling',
    name: 'IBM Buckling Spring',
    brand: 'IBM / Model M',
    type: 'clicky',
    color: '#9333EA',
    tag: 'Metallic Ping',
    description: 'Timeless IBM Model M acoustic ping with steel backplate resonance and spring snap.',
    actuation: '65g',
    bottomOut: '75g',
    soundDescription: 'Iconic coil spring buckle with mechanical flapper strike and metallic tone.',
    files: {
      press: ['BACKSPACE', 'ENTER', 'GENERIC_R0', 'GENERIC_R1', 'GENERIC_R2', 'GENERIC_R3', 'GENERIC_R4', 'SPACE'],
      release: ['BACKSPACE', 'ENTER', 'GENERIC', 'SPACE'],
    },
  },
  {
    id: 'cream',
    name: 'NovelKeys Cream',
    brand: 'NovelKeys / Kailh',
    type: 'linear',
    color: '#F59E0B',
    tag: 'Solid POM Thock',
    description: '100% self-lubricating POM housing and stem for a signature warm, solid bottom-out.',
    actuation: '55g',
    bottomOut: '70g',
    soundDescription: 'Full-bodied solid POM thock with warm mid-frequency resonance.',
    files: {
      press: ['BACKSPACE', 'ENTER', 'GENERIC_R0', 'GENERIC_R1', 'GENERIC_R2', 'GENERIC_R3', 'GENERIC_R4', 'SPACE'],
      release: ['BACKSPACE', 'ENTER', 'GENERIC', 'SPACE'],
    },
  },
  {
    id: 'holypanda',
    name: 'Drop Holy Panda',
    brand: 'Drop / Invyr',
    type: 'tactile',
    color: '#EA580C',
    tag: 'Explosive Pop',
    description: 'Halo stem inside Invyr housing. Unmistakable tactile pop with sharp bottom-out.',
    actuation: '55g',
    bottomOut: '67g',
    soundDescription: 'Explosive tactile crack and snappy bottom-out with high tactile feedback.',
    files: {
      press: ['BACKSPACE', 'ENTER', 'GENERIC_R0', 'GENERIC_R1', 'GENERIC_R2', 'GENERIC_R3', 'GENERIC_R4', 'SPACE'],
      release: ['BACKSPACE', 'ENTER', 'GENERIC', 'SPACE'],
    },
  },
  {
    id: 'mxblack',
    name: 'Cherry MX Black',
    brand: 'Cherry',
    type: 'linear',
    color: '#334155',
    tag: 'Vintage Heavy',
    description: 'Classic heavy linear switch with vintage nylon housing acoustic characteristics.',
    actuation: '60g',
    bottomOut: '80g',
    soundDescription: 'Substantial, deep nylon bottom-out with smooth linear slide.',
    files: {
      press: ['BACKSPACE', 'ENTER', 'GENERIC_R0', 'GENERIC_R1', 'GENERIC_R2', 'GENERIC_R3', 'GENERIC_R4', 'SPACE'],
      release: ['BACKSPACE', 'ENTER', 'GENERIC', 'SPACE'],
    },
  },
  {
    id: 'mxblue',
    name: 'Cherry MX Blue',
    brand: 'Cherry',
    type: 'clicky',
    color: '#0072F5',
    tag: 'Crisp Click Jacket',
    description: 'The standard click jacket switch with a high-pitched click and typewriter acoustic.',
    actuation: '50g',
    bottomOut: '60g',
    soundDescription: 'High-pitched click jacket mechanism with bright snappy actuation.',
    files: {
      press: ['GENERIC_R0', 'GENERIC_R1', 'GENERIC_R2', 'GENERIC_R3', 'GENERIC_R4'],
      release: ['GENERIC'],
    },
  },
  {
    id: 'mxbrown',
    name: 'Cherry MX Brown',
    brand: 'Cherry',
    type: 'tactile',
    color: '#B45309',
    tag: 'Subdued Tactile',
    description: 'Subtle tactile bump with light, subdued bottom-out acoustics for daily typing.',
    actuation: '45g',
    bottomOut: '55g',
    soundDescription: 'Muted tactile pop with mild acoustic report and gentle bottom-out.',
    files: {
      press: ['BACKSPACE', 'ENTER', 'GENERIC_R0', 'GENERIC_R1', 'GENERIC_R2', 'GENERIC_R3', 'GENERIC_R4', 'SPACE'],
      release: ['BACKSPACE', 'ENTER', 'GENERIC', 'SPACE'],
    },
  },
  {
    id: 'redink',
    name: 'Gateron Red Ink V2',
    brand: 'Gateron',
    type: 'linear',
    color: '#EF4444',
    tag: 'Silky Clack',
    description: 'Silky smooth light linear in translucent Ink housing with crisp, refined clack.',
    actuation: '45g',
    bottomOut: '60g',
    soundDescription: 'Light, crisp clack with smooth travel and zero scratchiness.',
    files: {
      press: ['BACKSPACE', 'ENTER', 'GENERIC_R0', 'GENERIC_R1', 'GENERIC_R2', 'GENERIC_R3', 'GENERIC_R4', 'SPACE'],
      release: ['BACKSPACE', 'ENTER', 'GENERIC', 'SPACE'],
    },
  },
  {
    id: 'topre',
    name: 'Topre 45g Silent',
    brand: 'Topre Corporation',
    type: 'tactile',
    color: '#10B981',
    tag: 'Cushioned Thump',
    description: 'Capacitive rubber dome over conical spring. Deep, cushioned "thump" with zero rattle.',
    actuation: '45g',
    bottomOut: '45g',
    soundDescription: 'Deep, muted dome collapse with subtle bottom-out cushion sound.',
    files: {
      press: ['BACKSPACE', 'ENTER', 'GENERIC_R0', 'GENERIC_R1', 'GENERIC_R2', 'GENERIC_R3', 'GENERIC_R4', 'SPACE'],
      release: ['BACKSPACE', 'ENTER', 'GENERIC', 'SPACE'],
    },
  },
  {
    id: 'turquoise',
    name: 'Zeal Turquoise Tealio',
    brand: 'ZealPC / JWK',
    type: 'linear',
    color: '#06B6D4',
    tag: 'Polished Clack',
    description: 'Specially formulated turquoise polymer housing with ultra-smooth polished slide.',
    actuation: '63.5g',
    bottomOut: '63.5g',
    soundDescription: 'Refined, high-clarity clack with crisp acoustic rebound.',
    files: {
      press: ['BACKSPACE', 'ENTER', 'GENERIC_R0', 'GENERIC_R1', 'GENERIC_R2', 'GENERIC_R3', 'GENERIC_R4', 'SPACE'],
      release: ['BACKSPACE', 'ENTER', 'GENERIC', 'SPACE'],
    },
  },
];

export function getProfileById(id: string): SwitchProfile | undefined {
  return switchProfiles.find((p) => p.id === id);
}
