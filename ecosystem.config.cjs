module.exports = {
  apps: [
    {
      name: 'jasin-metal',
      script: 'server/index.js',
      instances: 1,
      exec_mode: 'fork',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
  ],
};
