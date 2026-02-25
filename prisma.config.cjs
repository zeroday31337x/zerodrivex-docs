require('dotenv').config({ path: '.env.local' });

/** @type {import('prisma').PrismaConfig} */
module.exports = {
  schema: './prisma/schema.prisma',

  migrations: {
    path: './prisma/migrations',
  },

  datasource: {
    url: process.env.DATABASE_URL,
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
};
