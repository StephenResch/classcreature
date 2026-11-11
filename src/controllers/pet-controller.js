import { randomInt, randomUUID } from 'node:crypto';
import { NotFoundError, ValidationError } from '#errors';

const CREATURE_TYPES = ['blue', 'red', 'green'];
const RARITIES = [
  [5000, 'common'],
  [8000, 'uncommon'],
  [9000, 'rare'],
  [9750, 'epic'],
  [10000, 'legendary'],
];

function chooseRarity() {
  const roll = randomInt(10000);
  return RARITIES.find(([limit]) => roll < limit)[1];
}

export function createPetController(container) {
  return {
    async generateEgg(req, res, next) {
      try {
        await container.db.knex('inventory').insert({
          id: randomUUID(),
          user_id: req.currentUser.id,
          name: 'Egg',
          itemtype: 'egg',
          creaturetype: CREATURE_TYPES[randomInt(CREATURE_TYPES.length)],
          creaturerarity: chooseRarity(),
        });

        res.redirect('/inventory');
      } catch (error) {
        next(error);
      }
    },

    async inventory(req, res, next) {
      try {
        const items = await container.db.knex('inventory').where('user_id', req.currentUser.id)
        .select('id', 'name', 'itemtype', 'creaturetype', 'creaturerarity');
        res.render('pages/inventory', {
          title: 'Inventory',
          features: container.config.features,
          items,
        });
      } catch (error) {
        next(error);
      }
    },
    
    egg(req, res) {
      res.render('pages/egg', {
        title: 'Egg',
        features: container.config.features,
      });
    },
    creature(req, res) {
      res.render('pages/creature', {
        title: 'Creature',
        features: container.config.features,
      });
    },
    shop(req, res) {
      res.render('pages/shop', {
        title: 'shop',
        features: container.config.features,
      });
    },

    async hatchForm(req, res, next) {
      try {
        const egg = await container.db.knex('inventory').where({
          id: req.params.id,
          user_id: req.currentUser.id,
          itemtype: 'egg',
        }).first();

        if (!egg) {
          throw new NotFoundError('Egg not found');
        }

        res.render('pages/hatch', {
          title: 'Hatch Egg',
          features: container.config.features,
          egg,
        });
      } catch (error) {
        next(error);
      }
    },

    async hatch(req, res, next) {
      try {
        const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
        if (!name || name.length > 64) {
          throw new ValidationError('Enter a pet name of 1 to 64 characters');
        }

        const hatched = await container.db.knex.transaction(async (trx) => {
          const criteria = {
            id: req.params.id,
            user_id: req.currentUser.id,
            itemtype: 'egg',
          };

          const egg = await trx('inventory').where(criteria).forUpdate().first();

          if (!egg) {
            return false;
          }

          const deleted = await trx('inventory').where(criteria).delete();
          if (deleted !== 1) {
            throw new Error('Failed to consume egg');
          }

          await trx('creatures').insert({
            id: randomUUID(),
            user_id: req.currentUser.id,
            name,
            creaturetype: egg.creaturetype,
            creaturerarity: egg.creaturerarity,
          });

          return true;
        });

        if (!hatched) {
          throw new NotFoundError('Egg not found');
        }

        res.redirect('/inventory');
      } catch (error) {
        next(error);
      }
    },
  };
}