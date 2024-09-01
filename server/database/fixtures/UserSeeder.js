const AbstractSeeder = require("./AbstractSeeder");

class UserSeeder extends AbstractSeeder {
  constructor() {
    super({ table: "user", truncate: true });
  }

  run() {
    // Generate and insert fake data into the 'user' table
    for (let i = 0; i < 100; i += 1) {
      // Generate fake user data
      const fakeUser = {
        lastname: this.faker.person.lastName(),
        firstname: this.faker.person.firstName(),
        username: (() => {
          const username = this.faker.internet.userName();
          return username.length > 20 ? username.substring(0, 20) : username;
        })(),
        phone_number: "0600000000",
        location: this.faker.location.city(),
        mail: this.faker.internet.email(), // Generate a fake email using faker library
        password: this.faker.internet.password(), // Generate a fake password using faker library
        description: this.faker.lorem.lines({ min: 1, max: 5 }),
        refName: `user_${i}`, // Create a reference name for the user
      };

      this.insert(fakeUser); // insert into user(email, password) values (?, ?)
    }
  }
}
module.exports = UserSeeder;
