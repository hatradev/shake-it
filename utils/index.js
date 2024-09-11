const formattedDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const idString = (ObjectId) => {
  return ObjectId.match(/"([^"]+)"/)[1];
};

export { formattedDate, idString };
