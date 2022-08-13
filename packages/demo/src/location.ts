import { ReactLocation, createHashHistory } from "@tanstack/react-location";

// Create a hash history
const hashHistory = createHashHistory();

// Set up a ReactLocation instance with the hash history
export const location = new ReactLocation({
  history: hashHistory,
});
