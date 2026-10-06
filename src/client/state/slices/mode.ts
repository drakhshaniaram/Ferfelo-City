import { parseOfficeMode, type OfficeMode } from '../../../shared/mode';
import type { Slice } from '../store';

declare module '../store' {
  interface Store {
    /** Coding office vs Ferfelo Academy skin. */
    mode: OfficeMode;
  }
  interface Topics {
    mode: true;
  }
}

export const mode: Slice = {
  init(s) {
    s.mode = 'academy';
  },
  on: {
    welcome(s, m) {
      s.mode = parseOfficeMode(m.mode);
      return ['mode'];
    },
    'office.mode'(s, m) {
      s.mode = parseOfficeMode(m.mode);
      return ['mode'];
    },
  },
};
