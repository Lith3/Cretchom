const AbstractSeeder = require("./AbstractSeeder");

// Import seeders that must be executed before this one
// Follow your foreign keys to find the right order ;)
const UserSeeder = require("./UserSeeder");

class HomeStructureSeeder extends AbstractSeeder {
  constructor() {
    super({
      table: "home_structure",
      truncate: true,
      dependencies: [UserSeeder],
    });
  }

  static generateUniqueId() {
    const generatedIds = new Set();
    return function userId() {
      let id;
      do {
        id = Math.floor(Math.random() * 100); // Génère un nombre aléatoire jusqu'à 100
      } while (generatedIds.has(id));
      generatedIds.add(id);
      return id;
    };
  }

  async run() {
    const insertPromises = [];
    const getUniqueId = HomeStructureSeeder.generateUniqueId();

    for (let i = 0; i < 50; i += 1) {
      const uniqueId = getUniqueId();

      const fakeHomeStructure = {
        postal_code: this.faker.number.int({ min: 69001, max: 69999 }),
        capacity: this.faker.number.int({ min: 1, max: 50 }),
        is_professional: this.faker.datatype.boolean({ probability: 0.4 }),
        cat: this.faker.datatype.boolean({ probability: 0.6 }),
        dog: this.faker.datatype.boolean({ probability: 0.6 }),
        price: this.faker.number.int({ min: 1, max: 50 }),
        user_id: uniqueId, // Utilisez l'ID unique généré
        refName: `home_structure_${uniqueId}`,
      };

      insertPromises.push(this.insert(fakeHomeStructure));
    }

    await Promise.all(insertPromises);
  }
}

module.exports = HomeStructureSeeder;
