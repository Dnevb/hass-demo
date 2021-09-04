import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("producto", (t) => {
    t.uuid("uid").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    t.timestamps(true, true);
    t.string("nombre").notNullable();
    t.text("descripcion").nullable();
    t.string("url_img").nullable();
    t.integer("cantidad").notNullable();
    t.float("precio").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("producto");
}
