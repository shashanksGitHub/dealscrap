// Provide a no-op implementation of themePlugin
globalThis.themePlugin = () => ({
  name: 'theme-plugin-shim',
  apply: () => {} // No-op implementation
});

// Ensure allowedHosts is set to true in Vite config
if (typeof process !== 'undefined' && process.env) {
  process.env.VITE_ALLOW_HOSTS = 'true';
  // Force development mode
  process.env.NODE_ENV = 'development';
  // Configure Vite dev server
  process.env.VITE_DEV_SERVER_HOST = '0.0.0.0';
  process.env.VITE_DEV_SERVER_CORS = 'true';
}

export default globalThis.themePlugin;