// Provide a no-op implementation of themePlugin
globalThis.themePlugin = () => ({
  name: 'theme-plugin-shim',
  apply: () => {} // No-op implementation
});

// Ensure allowedHosts is set to true in Vite config
if (typeof process !== 'undefined' && process.env) {
  process.env.VITE_ALLOW_HOSTS = 'true';
}

export default globalThis.themePlugin;