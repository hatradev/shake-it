import events from "./json/event.json";

const getEventFromId = (id) => {
  return events.events.find((event) => event.id === id);
};

export { events, getEventFromId };
