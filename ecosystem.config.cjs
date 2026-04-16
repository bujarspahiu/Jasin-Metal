require('dotenv').config();

module.exports = {
  apps: [
    {
      name: 'jasin-metal',
      script: 'server/index.js',
      instances: 1,
      exec_mode: 'fork',
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3001,
        DATABASE_URL: process.env.DATABASE_URL,
        RESEND_API_KEY: process.env.RESEND_API_KEY || '',
        RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || 'Jasin Metal <noreply@jasin-metal.com>',
        ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'info@jasin-metal.com',
      },
    },
  ],
};
