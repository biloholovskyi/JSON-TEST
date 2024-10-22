const schema = require("./json-schema.json");

const generateRandomString = (length) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
};

const getRandomFromArray = (array) =>
  array[Math.floor(Math.random() * array.length)];

const generateDataFromSchema = (schema, definitions) => {
  const generateValue = (definition) => {
    if (definition.$ref) {
      const refPath = definition.$ref.replace("#", "").split("/");
      const refDefinition = refPath.reduce((acc, key) => acc[key], definitions);
      return generateValue(refDefinition);
    }

    if (definition.enum) {
      return getRandomFromArray(definition.enum);
    }

    switch (definition.type) {
      case "integer":
        return definition.minimum
          ? Math.floor(
              Math.random() * (definition.maximum - definition.minimum + 1)
            ) + definition.minimum
          : Math.floor(Math.random() * 100);

      case "string":
        return definition.pattern
          ? "create random string from regex"
          : generateRandomString(10);

      case "boolean":
        return Math.random() > 0.5;

      case "array":
        const arrayLength = Math.floor(Math.random() * 5) + 1;
        return Array.from({ length: arrayLength }, () =>
          definition.items
            ? generateValue(definition.items)
            : generateRandomString(10)
        );

      case "object": {
        const obj = {};
        const requiredKeys = definition.required || [];

        if (definition.properties) {
          Object.keys(definition.properties).forEach((key) => {
            if (requiredKeys.includes(key) || Math.random() > 0.5) {
              obj[key] = generateValue(definition.properties[key]);
            }
          });
        } else {
          const randomPropertiesCount = Math.floor(Math.random() * 5) + 1;
          for (let i = 0; i < randomPropertiesCount; i++) {
            const randomKey = generateRandomString(5);
            obj[randomKey] = generateValue({ type: "string" });
          }
        }
        return obj;
      }

      case "anyOf":
        return generateValue(getRandomFromArray(definition.anyOf));

      default:
        if (definition.anyOf) {
          const randomSchema =
            definition.anyOf[
              Math.floor(Math.random() * definition.anyOf.length)
            ];
          return generateValue(randomSchema);
        }
        return null;
    }
  };

  const data = {};
  Object.keys(schema.properties).forEach((key) => {
    data[key] = generateValue(schema.properties[key]);
  });

  return data;
};

console.log("RESULT");
console.log(generateDataFromSchema(schema, schema.definitions));

module.exports = generateDataFromSchema;
