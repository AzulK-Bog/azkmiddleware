export function distinctByProperty(array, property) {
  const uniqueValues = [];
  const seenValues = new Set();

  for (const item of array) {
    const value = item[property];
    if (!seenValues.has(value)) {
      seenValues.add(value);
      uniqueValues.push(item);
    }
  }

  return uniqueValues;
}
