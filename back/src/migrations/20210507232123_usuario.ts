import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("usuario", (t) => {
    t.uuid("uid").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    t.timestamps(true, true);
    t.string("email").notNullable();
    t.string("pass").notNullable();
    t.string("nombres").notNullable();
    t.string("apellidos").notNullable();
    t.boolean("admin").defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("usuario");
}
