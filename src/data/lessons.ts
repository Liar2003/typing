import { TestMode } from '../types/typing';

export interface LessonContent {
  id: string;
  title: string;
  text: string;
}

export const LESSONS: Record<TestMode, LessonContent[]> = {
  'home-row': [
    {
      id: 'hr-1',
      title: 'Home Row Foundation',
      text: 'asdf jkl; asdf jkl; a s d f j k l ; dad fad lad sad salad flask falls',
    },
    {
      id: 'hr-2',
      title: 'Home Row Combinations',
      text: 'ask dad for a flask of salads as all lads fall fast as a flash',
    },
    {
      id: 'hr-3',
      title: 'Home Row Agility',
      text: 'a lad had a sad dad and a glad lass had salads as a flash fall',
    },
  ],
  'top-row': [
    {
      id: 'tr-1',
      title: 'Top Row Navigation',
      text: 'qwer tyui op type write wire power tower tree root rope query pure quit',
    },
    {
      id: 'tr-2',
      title: 'Top & Home Row Integration',
      text: 'we write quick queries while you post reports to our software tools today',
    },
    {
      id: 'tr-3',
      title: 'High Velocity Reach',
      text: 'pure power requires quiet priority write poetry with every keystroke today',
    },
  ],
  'bottom-row': [
    {
      id: 'br-1',
      title: 'Bottom Row Flex',
      text: 'zxcv bnm zxcv bnm calm zinc vex mob zen cab back comb zone civic view',
    },
    {
      id: 'br-2',
      title: 'Full Row Flow',
      text: 'the quick brown fox jumps over a lazy dog back in the zinc mine zone',
    },
    {
      id: 'br-3',
      title: 'Precision Coordinate Shift',
      text: 'maximize cyber vector bounds next to dynamic cosmic zero point axis',
    },
  ],
  'numbers-symbols': [
    {
      id: 'ns-1',
      title: 'Numeric Drill',
      text: '123 456 789 012 345 678 90 2026 1984 4096 8192 1024 365 24 7',
    },
    {
      id: 'ns-2',
      title: 'Symbols & Shift',
      text: 'const rate = 100 * (val / total); if (x >= 0 && y <= 50) { return #cyber; }',
    },
    {
      id: 'ns-3',
      title: 'Data Stream Protocols',
      text: 'ip: 192.168.1.1 port: 8080 [status=200] ping=12ms user@domain.org:~$',
    },
  ],
  'common-words': [
    {
      id: 'cw-1',
      title: 'Top 100 English Words - Part 1',
      text: 'the of and a to in is you that it he was for on are as with his they at be this have from or one had by word but not what all were we when your can said there use an each which she do how their if will up other about out many then them these so some her would make like him into time has look two more write go see number no way could people my than first water been call who oil its now find long down day did get come made may part',
    },
    {
      id: 'cw-2',
      title: 'Top 100 English Words - Part 2',
      text: 'time will tell how each system can make great things work with simple code and deep focus when you build clear solutions every single day',
    },
  ],
  'code-snippets': [
    {
      id: 'cs-1',
      title: 'TypeScript Hook',
      text: 'const useMatrix = <T,>(initial: T): [T, (next: T) => void] => {\n  const [state, setState] = useState<T>(initial);\n  return [state, setState];\n};',
    },
    {
      id: 'cs-2',
      title: 'Shader Vector Math',
      text: 'vec3 hologram = mix(vec3(0.0, 0.94, 1.0), vec3(0.1, 0.2, 0.4), dot(normal, viewDir));',
    },
    {
      id: 'cs-3',
      title: 'Async Signal Stream',
      text: 'async function fetchHologramStream(id: string): Promise<StreamPacket[]> {\n  const response = await fetch(`/api/matrix/${id}`);\n  return response.json();\n}',
    },
  ],
  'quotes': [
    {
      id: 'q-1',
      title: 'Neuromancer - William Gibson',
      text: 'The sky above the port was the color of television, tuned to a dead channel.',
    },
    {
      id: 'q-2',
      title: 'Snow Crash - Neal Stephenson',
      text: 'The Deliverator belongs to an elite order, a confederacy of the highway whose members make no excuses and take no prisoners.',
    },
    {
      id: 'q-3',
      title: 'Do Androids Dream of Electric Sheep? - Philip K. Dick',
      text: 'You will be required to do wrong no matter where you go. It is the basic condition of life, to be required to violate your own identity.',
    },
    {
      id: 'q-4',
      title: 'Ghost in the Shell',
      text: 'We weep for a bird in the sea, but not for a fish in the air. Blessed are those who have voice.',
    },
  ],
  'custom': [
    {
      id: 'custom-1',
      title: 'Custom Practice Buffer',
      text: 'Paste or type any custom practice text in the custom modal to train on your own technical documentation, prose, or code snippets.',
    },
  ],
};

export function getRandomLesson(mode: TestMode): LessonContent {
  const list = LESSONS[mode] || LESSONS['home-row'];
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}
