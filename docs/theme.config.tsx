import type { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  docsRepositoryBase: 'https://github.com/beaverfy/expo-fitbit/docs', // base URL for the docs repository
  darkMode: true,
  primaryHue: {
    dark: 150.00,
    light: 150.00
  },
  primarySaturation: {
    dark: 42,
    light: 42
  },
  chat: {
    link: "https://discord.gg/3u2bWnzg3x"
  },
  project: {
    link: "https://github.com/beaverfy/expo-fitbit"
  },
  footer: {
    text: 'by beaverfy and the community ♥️',
  },
  editLink: {
    text: 'Edit this page on GitHub →',
  },
  logo: (
    <>
      <img
        src="/expo-fitbit.png"
        width="20"
        alt="Expo Wear"
        style={{ marginRight: '10px' }}
      />
      <span>Expo Fitbit</span>
      <div style={{
        gap: "8px",
        display: "flex",
        flexDirection: "row",
        paddingLeft: 15
      }}>
        <div style={{
          backgroundColor: "#102a4c",
          borderRadius: 4
        }}>
          <div style={{ padding: 5 }}>
            <svg style={{ width: "1rem", height: "1rem" }} viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.477 12.0001H7.17725V2.91919H14.477C14.8606 2.91919 15.1716 3.23015 15.1716 3.61374V11.3055C15.1716 11.6891 14.8606 12.0001 14.477 12.0001Z" fill="hsl(211, 100%, 43.2%)"></path><path d="M1.1432 12.0001H7.60645V2.91919H1.1432C0.759611 2.91919 0.448652 3.23015 0.448652 3.61374V11.3055C0.448652 11.6891 0.759611 12.0001 1.1432 12.0001Z" fill="hsl(211, 100%, 43.2%)"></path><path d="M7.44238 2.75447V11.2081C6.25791 10.0362 1.9577 10.2382 1.9577 10.2382V0.893055C1.9577 0.893055 5.71355 0.264309 7.44238 2.75447Z" fill="hsl(208, 77.5%, 76.9%)"></path><path d="M8.19653 2.75447V11.2081C9.38101 10.0362 13.6812 10.2382 13.6812 10.2382V0.893055C13.6812 0.893055 9.92537 0.264309 8.19653 2.75447Z" fill="hsl(208, 77.5%, 76.9%)"></path></svg>
          </div>
        </div>
        <span>Docs</span>
      </div>
    </>
  ),
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="description"
        content="Module that handles fitbit oauth for your expo project"
      />
      <meta name="og:title" content="Expo Fitbit" />
    </>
  ),
  toc: {
    backToTop: true,
  },
};

export default config;
