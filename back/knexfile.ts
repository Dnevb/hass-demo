// Update with your config settings.

module.exports = {
  development: {
    client: "pg",
    connection: "postgres://dev:124@localhost:5432/hass",
    migrations: {
      extension: "ts",
      directory: "./src/migrations",
    },
  },
};
