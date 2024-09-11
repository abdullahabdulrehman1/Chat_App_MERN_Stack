import { faker, simpleFaker } from "@faker-js/faker";
import { User } from "../models/user.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
export const createSingleSampleChats = async (chatsCount) => {
  try {
    const users = await User.find().select("_id");
    const chatsPromise = [];
    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < users.length; j++) {
        chatsPromise.push(
          Chat.create({
            name: faker.lorem.word(),
            members: [users[i], users[j]],
          })
        );
      }
    }
    await Promise.all(chatsPromise);
    console.log("Sample chats created successfully");
    process.exit(0);
  } catch (e) {
    console.log(e);
  }
};
export const createGroupSampleChats = async (chatsCount) => {
  try {
    const users = await User.find().select("_id");
    const chatsPromise = [];
    for (let i = 0; i < chatsCount; i++) {
      const nummembers = simpleFaker.number.int({ min: 2, max: users.length });
      const members = [];

      for (let j = 0; j < nummembers; j++) {
        const randomIndex = Math.floor(Math.random() * users.length);
        const randomUser = users[randomIndex];

        if (!members.includes(randomUser)) {
          members.push(randomUser);
        }
      }
      const chat = Chat.create({
        groupChat: true,
        name: faker.lorem.word(),
        members,
        creator: members[0],
      });
      chatsPromise.push(chat);
    }
    await Promise.all(chatsPromise);
    console.log("Sample chats created successfully");
    process.exit(0);
  } catch (e) {
    console.log(e);
  }
};
export const CreateMessageInAChat = async (chatId, numMessages) => {
  try {
    const users = await User.find().select("_id");

    const messagesPromise = [];
    for (let i = 0; i < numMessages; i++) {
      const randomIndex = Math.floor(Math.random() * users.length);
      const randomUser = users[randomIndex];
      const message = Message.create({
        chat: chatId,
        sender: randomUser,
        content: faker.lorem.sentence(),
      });
      messagesPromise.push(message);
    }
    await Promise.all(messagesPromise);
    console.log("Sample messages created successfully");
    process.exit(0);
  } catch (e) {
    console.log(e);
  }
};
