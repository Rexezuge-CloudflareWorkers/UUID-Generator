import { describe, expect, it } from 'vitest';
import { generateUUIDs } from './uuid';

describe('generateUUIDs', () => {
  it('generates the requested count', () => {
    expect(generateUUIDs(3, false, false)).toHaveLength(3);
    expect(generateUUIDs(0, false, false)).toHaveLength(0);
  });

  it('constrains the first character for letter requests', () => {
    for (const uuid of generateUUIDs(20, true, false)) {
      expect(uuid[0]).toMatch(/[A-Za-z]/);
    }
  });

  it('constrains the first character for number requests', () => {
    for (const uuid of generateUUIDs(20, false, true)) {
      expect(uuid[0]).toMatch(/[0-9]/);
    }
  });
});
