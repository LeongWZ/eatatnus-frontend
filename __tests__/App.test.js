/* eslint-disable no-undef */
import React from "react";
import App from "../app/(tabs)/index";
import { render, screen } from "@testing-library/react-native";

// It is recommended to use userEvent with fake timers
// Some events involve duration so your tests may take a long time to run.
jest.useFakeTimers();

test("<App />", async () => {
  render(<App />);
  const tree = screen.toJSON();
  expect(tree.children.length).toBe(2);
});
