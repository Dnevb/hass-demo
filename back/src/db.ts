import knex from "knex";

export default knex({
  client: "pg",
  connection: "postgres://dev:124@localhost:5432/hass",
});
