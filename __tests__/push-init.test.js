const fs = require('fs');
const path = require('path');

describe('Push notifications init flow', () => {
  const filePath = path.resolve(__dirname, '../generated/json/push/push-init.json');
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
        "core-sdk-init",
        "core-sdk-init-already-initialized",
        "data-pipelines-module-init",
        "data-pipelines-module-success",
        "push-module-init",
        "push-google-services-available",
        "push-google-services-error",
        "push-module-success",
        "core-sdk-init-success"
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
  });
});
