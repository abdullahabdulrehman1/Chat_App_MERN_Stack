export const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    "https://chatappsocketclient.vercel.app",

    process.env.CLIENT_URL,
  ],
  credentials: true,
};
