/**
 * @param {import('knex').Knex} knex
 */
export async function up(knex) {
    if (!(await knex.schema.hasTable('creatures'))) {
        await knex.schema.createTable('creatures', (table) => {
            table.string('id', 36).primary();
            table
                .string('user_id', 36)
                .notNullable()
                .references('id')
                .inTable('users')
                .onDelete('CASCADE');
            table.string('name', 64).notNullable();
            table.string('creaturetype', 36).nullable();
            table.string('creaturerarity', 36).nullable();
            table.index(['user_id']);
        });
    } else {
        if (!(await knex.schema.hasColumn('creatures', 'creaturetype'))) {
            await knex.schema.alterTable('creatures', (table) => {
                table.string('creaturetype', 36).nullable();
            });
        }

        if (!(await knex.schema.hasColumn('creatures', 'creaturerarity'))) {
            await knex.schema.alterTable('creatures', (table) => {
                table.string('creaturerarity', 36).nullable();
            });
        }
    }

    if (!(await knex.schema.hasTable('inventory'))) {
        await knex.schema.createTable('inventory', (table) => {
            table.string('id', 36).primary();
            table
                .string('user_id', 36)
                .notNullable()
                .references('id')
                .inTable('users')
                .onDelete('CASCADE');
            table.string('name', 64).notNullable();
            table.string('itemtype', 36).nullable();
            table.string('creaturetype', 36).nullable();
            table.string('creaturerarity', 36).nullable();
            table.index(['user_id']);
        });
    } else {
        if (!(await knex.schema.hasColumn('inventory', 'itemtype'))) {
            await knex.schema.alterTable('inventory', (table) => {
                table.string('itemtype', 36).nullable();
            });
        }

        if (!(await knex.schema.hasColumn('inventory', 'creaturetype'))) {
            await knex.schema.alterTable('inventory', (table) => {
                table.string('creaturetype', 36).nullable();
            });
        }

        if (!(await knex.schema.hasColumn('inventory', 'creaturerarity'))) {
            await knex.schema.alterTable('inventory', (table) => {
                table.string('creaturerarity', 36).nullable();
            });
        }
    }
}

export async function down() { }