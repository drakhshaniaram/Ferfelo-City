import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseOfficeMode, type OfficeMode } from '../shared/mode.js';

/**
 * Academy vs coding-office skin for everyone in the building. Starts from AGENT_OFFICE_MODE /
 * --mode (default academy on this fork), then ⚙️ Settings can override into .agent-office/mode.json.
 */
export class OfficeModeSetting {
  private current: OfficeMode;
  private path: string;

  constructor(
    dataDir: string,
    initial: OfficeMode,
    private onChange: (mode: OfficeMode) => void,
  ) {
    this.path = path.join(dataDir, 'mode.json');
    this.current = initial;
    this.restore();
  }

  get mode(): OfficeMode {
    return this.current;
  }

  set(mode: OfficeMode, by: string) {
    this.current = mode;
    try {
      writeFileSync(this.path, JSON.stringify({ mode, by, at: Date.now() }, null, 2), { mode: 0o600 });
    } catch {
      // disk issues shouldn't take the office down
    }
    this.onChange(this.current);
  }

  private restore() {
    try {
      const s = JSON.parse(readFileSync(this.path, 'utf8')) as { mode?: unknown };
      this.current = parseOfficeMode(s.mode);
    } catch {
      // keep constructor default
    }
  }
}
