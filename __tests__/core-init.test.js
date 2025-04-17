const fs = require('fs');
const path = require('path');

describe('Generated core init JSON', () => {
  const filePath = path.resolve(__dirname, '../generated/json/init/core.json');

  test('should be valid JSON', () => {
    const content = fs.readFileSync(filePath, 'utf-8');

    expect(() => {
      JSON.parse(content);
    }).not.toThrow();
  });

  const events = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  test('should have exactly 3 events with correct IDs', () => {
    const expectedIds = [
      'core-sdk-init',
      'core-sdk-init-success',
      'core-sdk-init-failure'
    ];
    const actualIds = events.map(e => e.id);
    expect(actualIds.sort()).toEqual(expectedIds.sort());
  });

  test('should have unique event IDs', () => {
    const ids = events.map(e => e.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('should validate labels and logs for each event', () => {
    const eventById = id => events.find(e => e.id === id);
    
    expect(eventById('core-sdk-init').label).toBe('Initializing core SDK');
    expect(eventById('core-sdk-init').log).toBe('[CIO][Init] Initializing core SDK with prams: {...}');
    
    expect(eventById('core-sdk-init-success').label).toBe('Core SDK init success');
    expect(eventById('core-sdk-init-success').log).toBe('[CIO][Init] Core SDK init success!');

    expect(eventById('core-sdk-init-failure').label).toBe('Core SDK init failed');
    expect(eventById('core-sdk-init-failure').log).toBe('[CIO][Init] Core SDK init success with error: {...}');
  });

  test('core-sdk-init event should define success and error fields correctly', () => {
    const initEvent = events.find(e => e.id === 'core-sdk-init');
    expect(initEvent.success).toBe('core-sdk-init-success');
    expect(initEvent.error).toBe('core-sdk-init-failure');
  });
});
