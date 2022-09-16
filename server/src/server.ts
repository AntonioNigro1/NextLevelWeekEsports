import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { convertHourMin, convertMinHour } from "./utils/convert-time";

const app = express();
app.use(express.json());
app.use(cors());

const prisma = new PrismaClient({
  log: ["query"],
});

app.get("/games", async (req, res) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true,
        },
      },
    },
  });
  return res.status(200).json(games);
});

app.post("/games/:id/ads", async (req, res) => {
  const gameId = req.params.id;
  const body = req.body;
  //validação ZOD js
  const ad = await prisma.ad.create({
    data: {
      gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      weekDays: body.weekDays.join(","),
      hourStart: convertHourMin(body.hourStart),
      hourEnd: convertHourMin(body.hourEnd),
      useVoiceChat: body.useVoiceChat,
    },
  });

  return res.status(200).json(ad);
});

app.get("/games/:id/ads", async (req, res) => {
  const gameId = req.params.id;
  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      yearsPlaying: true,
      weekDays: true,
      useVoiceChat: true,
      hourStart: true,
      hourEnd: true,
    },
    where: { gameId },
    orderBy: {
      createdAt: "desc",
    },
  });
  return res.status(200).json(
    ads.map((ad) => {
      return {
        ...ad,
        weekDays: ad.weekDays.split(","),
        hourStart: convertMinHour(ad.hourStart),
        hourEnd: convertMinHour(ad.hourEnd),
      };
    })
  );
});

app.get("/ads/:id/discord", async (req, res) => {
  const adId = req.params.id;

  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true,
    },
    where: {
      id: adId,
    },
  });

  return res.status(200).json(ad);
});

app.listen(3333);
