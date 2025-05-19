const fs = require('fs');
const path = require('path');

describe('Push deep linking flow', () => {
  const filePath = path.resolve(__dirname, '../generated/json/push/deep-linking.json');
  let data;

  test('should be valid JSON', () => {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    expect(() => {
      data = JSON.parse(fileContent);
    }).not.toThrow();
  });

  describe('Parsed JSON structure', () => {
    beforeAll(() => {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      data = JSON.parse(fileContent);
    });

    test('should contain the correct event IDs in order', () => {
      const actualIds = data.map(event => event.id);
      const expectedIds = [
        "handling-push-deep-link-start",
        "push-deep-link-not-handled",
        "push-deep-link-handled-callback",
        "push-deep-link-handled-host-app",
        "push-deep-link-handled-externally"
      ];
  
      expect(actualIds).toEqual(expectedIds);
    });

    test('event IDs should be unique', () => {
      const ids = data.map(event => event.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    test('each event should have required keys for its ID', () => {
      data.forEach(event => {
        expect(event).toHaveProperty('id');
        expect(event).toHaveProperty('label');
        expect(event).toHaveProperty('log');
        expect(event).toHaveProperty('tag');
      });
    });

    test('event "handling-push-deep-link-start" has correct link values', () => {
      const event = data.find(e => e.id === 'handling-push-deep-link-start');
      expect(event).toBeDefined();
  
      expect(event).toHaveProperty('error', 'push-deep-link-not-handled');
      expect(event).toHaveProperty('next', 'push-deep-link-handled-callback');
    });

    test('event "push-deep-link-handled-callback" has correct link values', () => {
      const event = data.find(e => e.id === 'push-deep-link-handled-callback');
      expect(event).toBeDefined();
  
      expect(event).toHaveProperty('next', 'push-deep-link-handled-host-app');
    });

    test('event "push-deep-link-handled-host-app" has correct link values', () => {
      const event = data.find(e => e.id === 'push-deep-link-handled-host-app');
      expect(event).toBeDefined();
  
      expect(event).toHaveProperty('next', 'push-deep-link-handled-externally');
    });
  });
});
