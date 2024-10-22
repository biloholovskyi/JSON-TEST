const schema = require("./json-schema.json");
const generateDataFromSchema = require("./index.js");

describe("generateDataFromSchema", () => {
  it("should generate an object with required properties", () => {
    const data = generateDataFromSchema(schema, schema.definitions);

    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("title");
    expect(data).toHaveProperty("description");
    expect(data).toHaveProperty("startDate");
    expect(data).toHaveProperty("endDate");
    expect(data).toHaveProperty("attendees");
  });

  it("should generate an array of attendees with correct structure", () => {
    const data = generateDataFromSchema(schema, schema.definitions);

    expect(Array.isArray(data.attendees)).toBe(true);

    if (data.attendees.length > 0) {
      const attendee = data.attendees[0];
      expect(attendee).toHaveProperty("userId");
      expect(attendee).toHaveProperty("access");
    }
  });

  it("should generate a random integer within specified bounds", () => {
    const definition = { type: "integer", minimum: 1, maximum: 10 };
    const value = generateDataFromSchema(
      { properties: { test: definition } },
      {}
    );

    expect(value.test).toBeGreaterThanOrEqual(1);
    expect(value.test).toBeLessThanOrEqual(10);
  });

  it("should generate a string that matches the expected pattern", () => {
    const definition = { type: "string", pattern: ".*" };
    const value = generateDataFromSchema(
      { properties: { test: definition } },
      {}
    );

    expect(typeof value.test).toBe("string");
  });

  it("should generate a boolean value", () => {
    const definition = { type: "boolean" };
    const value = generateDataFromSchema(
      { properties: { test: definition } },
      {}
    );

    expect(typeof value.test).toBe("boolean");
  });

  it("should allow optional properties based on required flag", () => {
    const definition = {
      type: "object",
      properties: {
        requiredProp: { type: "string" },
        optionalProp: { type: "string" },
      },
      required: ["requiredProp"],
    };
    const data = generateDataFromSchema(
      { properties: { test: definition } },
      {}
    );

    expect(data.test).toHaveProperty("requiredProp");
  });
});
