import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

jest.mock("antd", () => {
  const Image = ({ alt, className, src }) => (
    <img alt={alt} className={className} src={src} />
  );

  Image.PreviewGroup = ({ children }) => <>{children}</>;

  return {
    Image,
    Tag: ({ children, className }) => <span className={className}>{children}</span>,
  };
});

jest.mock("./components/RadarStats", () => () => <div>Skills Chart</div>);
jest.mock("./components/ProjectsGrid", () => () => <div>Projects Grid</div>);

const THEME_STORAGE_KEY = "portfolio-theme-preference";

const mockMatchMedia = (initialMatch = false) => {
  let matches = initialMatch;
  const listeners = new Set();

  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn((listener) => listeners.add(listener)),
    removeListener: jest.fn((listener) => listeners.delete(listener)),
    addEventListener: jest.fn((event, listener) => {
      if (event === "change") {
        listeners.add(listener);
      }
    }),
    removeEventListener: jest.fn((event, listener) => {
      if (event === "change") {
        listeners.delete(listener);
      }
    }),
    dispatchEvent: jest.fn(),
  }));

  return {
    setMatches(nextMatch) {
      matches = nextMatch;
      listeners.forEach((listener) =>
        listener({
          matches: nextMatch,
          media: "(prefers-color-scheme: dark)",
        })
      );
    },
  };
};

beforeEach(() => {
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.style.colorScheme = "";
  window.localStorage.clear();
});

test("renders the portfolio header and experience section", () => {
  mockMatchMedia(false);
  render(<App />);

  expect(
    screen.getByRole("heading", { name: /dario cruz/i, level: 1 })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /experience/i, level: 2 })
  ).toBeInTheDocument();
});

test("follows the system theme when there is no stored preference", () => {
  const mediaQuery = mockMatchMedia(true);
  render(<App />);

  expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  expect(
    screen.getByRole("button", { name: /system theme\. click to switch to dark mode\./i })
  ).toBeInTheDocument();

  act(() => {
    mediaQuery.setMatches(false);
  });

  expect(document.documentElement).toHaveAttribute("data-theme", "light");
});

test("cycles theme mode between system, dark, light, and back to system", async () => {
  mockMatchMedia(true);
  render(<App />);

  await act(async () => {
    await userEvent.click(
      screen.getByRole("button", {
        name: /system theme\. click to switch to dark mode\./i,
      })
    );
  });

  expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  expect(
    screen.getByRole("button", { name: /dark mode\. click to switch to light mode\./i })
  ).toBeInTheDocument();

  await act(async () => {
    await userEvent.click(
      screen.getByRole("button", { name: /dark mode\. click to switch to light mode\./i })
    );
  });

  expect(document.documentElement).toHaveAttribute("data-theme", "light");
  expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  expect(
    screen.getByRole("button", { name: /light mode\. click to switch to system theme\./i })
  ).toBeInTheDocument();

  await act(async () => {
    await userEvent.click(
      screen.getByRole("button", {
        name: /light mode\. click to switch to system theme\./i,
      })
    );
  });

  expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
});
