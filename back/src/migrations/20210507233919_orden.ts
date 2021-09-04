import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("orden", (t) => {
      t.uuid("uid").primary().defaultTo(knex.raw("uuid_generate_v4()"));
      t.timestamps(true, true);
      t.uuid("usuario_id").references("uid").inTable("usuario");
      t.boolean("completada").defaultTo(false);
    })
    .createTable("orden_producto", (t) => {
      t.uuid("uid").primary().defaultTo(knex.raw("uuid_generate_v4()"));
      t.timestamps(true, true);
      t.uuid("producto_id").references("uid").inTable("producto");
      t.uuid("orden_id").references("uid").inTable("orden");
      t.integer("cantidad").notNullable().defaultTo(1);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists("orden")
    .dropTableIfExists("orden_producto");
}
