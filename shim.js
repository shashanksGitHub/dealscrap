// Provide a no-op implementation of themePlugin
globalThis.themePlugin = () => ({
  name: 'theme-plugin-shim',
  apply: () => {} // No-op implementation
});

export default globalThis.themePlugin;
