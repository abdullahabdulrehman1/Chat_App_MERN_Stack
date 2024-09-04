export const sampleChats = [
  {
    avatar: ["https://picsum.photos/200"],
    name: "Abdullah",
    _id: "1",
    groupChat: false,
    sameSender: false,
    isOnline: false,
    newMessegeAlert: { count: 0 },
    index: 0,
    handleDeleteChatOpen: () => {},
    members: [2, 3],
  },
  {
    avatar: ["https://picsum.photos/200"],
    name: "John Doe",
    _id: "2",
    groupChat: false,
    sameSender: false,
    isOnline: false,
    newMessegeAlert: { count: 3 },
    index: 0,
    handleDeleteChatOpen: () => {},
    members: [2, 3],
  },
  {
    avatar: ["https://picsum.photos/200"],
    name: "Abdul",
    _id: "3",
    groupChat: false,
    sameSender: true,
    isOnline: false,
    newMessegeAlert: { count: 3 },
    index: 0,
    handleDeleteChatOpen: () => {},
    members: [2, 3],
  },
];

export const sampleUsers = [
  {
    avatar: "https://picsum.photos/200",
    name: "John",
    _id: "1",
  },
  {
    avatar: "https://picsum.photos/200",
    name: "John Doe",
    _id: "2",
  },
];
export const sampleNotifications = [
  {
    sender: {
      avatar: "https://picsum.photos/200",
      name: "John",
    },
    _id: "1",
  },
  {
    sender: {
      avatar: "https://picsum.photos/200",
      name: "John Doe",
    },
    _id: "2",
  },
];
export const sampleMesseges = [
  {
    attachments: [
      {
        public_id: "asdsdf",
        url: "https://picsum.photos/200",
      },
    ],
    content: "Abdullah hello",
    _id: "sss",
    sender: {
      _id: "asdsdf",
      name: "John Doe",
    },
    chat: "adf",
    createdAt: "2021-09-09T08:23:19.542Z",
  },
  {
    attachments: [
      {
        public_id: "asdsdf2",
        url: "https://www.w3schools.com/howto/img_avatar2.png",
      },
    ],
    content: "messege hello2",
    _id: "afd2",
    sender: {
      _id: "adfs",
      name: "John Doe2",
    },
    chat: "12",
    createdAt: "2022-09-09T08:23:19.542Z",
  },
];
export const dashboardData = () => ({
  users: [
    {
      name: "Abdullah",
      avatar: "https://www.w3schools.com/howto/img_avatar2.png",
      _id: "1",
      username: "abdullah",
      groups: 5,
      friends: 20,
    },
    {
      name: "John",
      avatar: "https://www.w3schools.com/howto/img_avatar2.png",
      _id: "2",
      username: "john",
      groups: 30,
      friends: 29,
    },
  ],
  chats: [
    {
      name: "John",
      avatar: ["https://www.w3schools.com/howto/img_avatar2.png"],
      _id: "1",
      groupChat: "false",
      members: [
        {
          _id: "1",

          avatar: "https://www.w3schools.com/howto/img_avatar2.png",
        },
        {
          _id: "2",

          avatar: "https://www.w3schools.com/howto/img_avatar2.png",
        },
      ],
      totalMembers: 2,
      totalMesseges: 29,
      creator: {
        name: "John Doe",
        avatar: "https://www.w3schools.com/howto/img_avatar2.png",
      },
    },
    {
      name: "John Saleem",
      avatar: ["https://www.w3schools.com/howto/img_avatar2.png"],
      _id: "2",
      groupChat: "false",
      members: [
        {
          _id: "1",

          avatar: "https://www.w3schools.com/howto/img_avatar2.png",
        },
        {
          _id: "2",

          avatar: "https://www.w3schools.com/howto/img_avatar2.png",
        },
      ],
      totalMembers: 2,
      totalMesseges: 20,
      creator: {
        name: "John Doe",
        avatar: "https://www.w3schools.com/howto/img_avatar2.png",
      },
    },
  ],
  messages: [
    {
      attachments: [
        {
          public_id: "asdsfdsf",
          url: "https://www.w3schools.com/howto/img_avatar2.png",
        },
      ],
      content: "this is testing message",
      _id: "jsdflsjfd",
      groupChat: false,
      sender: {
        avatar: "https://www.w3schools.com/howto/img_avatar2.png",
        name: "Chaman",
      },
      chat: "chatId",
      createdAt: "2024-02-12T10:41:30.630Z",
    },
    {
      attachments: [
        {
          public_id: "asdsfdsf",
          url: "https://www.w3schools.com/howto/img_avatar2.png",
        },
      ],
      content: "this is testing 22message",
      _id: "jsdflsjfd2",
      groupChat: true,
      sender: {
        avatar: "https://www.w3schools.com/howto/img_avatar2.png",
        name: "Chaman2",
      },
      chat: "chatId2",
      createdAt: "2024-03-12T10:41:30.630Z",
    },
  ],
});
