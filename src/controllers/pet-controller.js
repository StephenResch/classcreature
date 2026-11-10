import { randomInt, randomUUID } from 'node:crypto';

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
  };
}