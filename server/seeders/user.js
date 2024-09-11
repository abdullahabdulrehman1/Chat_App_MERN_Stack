import { faker, simpleFaker } from "@faker-js/faker";
import { User } from "../models/user.js";
import { Chat } from "../models/chat.js";

export const createUser = async (numUsers) => {
  try {
    const users = [];
    for (let i = 0; i < numUsers; i++) {
      const user = User.create({
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        password: "password",
        bio: faker.lorem.sentence(10),
        avatar: {
          public_id: faker.system.fileName(),
          url: faker.image.avatar(),
        },
      });
      users.push(user);
    }
    return users;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
console.log(createUser(10));
