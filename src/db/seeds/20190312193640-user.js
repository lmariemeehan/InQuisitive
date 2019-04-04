'use strict';

const faker = require("faker");
const User = require("../models").User;

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Users', [{
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: faker.random.number(1),
      createdAt: new Date(),
      updatedAt: new Date(),
      id: faker.random.number({min:1, max:20})
    }], {});

    const Users = await queryInterface.sequelize.query(`SELECT id from Users;`);

    let wikis = [];

    return await queryInterface.bulkInsert('Wikis', [
      for(let i = 1; i <= 20; i++){
        wikis.push({
          title: faker.lorem.sentence(),
          body: faker.lorem.sentences(),
          private: faker.random.boolean(),
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: user.id
        });
      }
    ], {});

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Wikis', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
