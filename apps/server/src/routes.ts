import { Router, Request, Response } from "express";
import {
  generateQuestions,
  generateRoadmap,
  Question,
  QuestionsResult,
  RoadmapResult,
} from "./lib/geminiApiCalls.js";

const router = Router();

interface GenerateQuestionsRequest {
  topic: string;
}

interface QuestionsResponse {
  success: boolean;
  topic: string;
  result: Question[];
}

interface RoadmapChapter {
  title: string;
  description: string;
}
interface RoadmapResponse {
  success: boolean;
  roadmap: RoadmapChapter[];
}

interface ErrorResponse {
  error: string;
}

router.post(
  "/api/courses/generate/questions",
  async (
    req: Request<
      {},
      QuestionsResponse | ErrorResponse,
      GenerateQuestionsRequest
    >,
    res: Response<QuestionsResponse | ErrorResponse>,
  ): Promise<void> => {
    try {
      const { topic } = req.body;

      if (!topic || topic.trim().length === 0) {
        res.status(400).json({ error: "Course topic is required" });
        return;
      }

      if (topic.length > 500) {
        res.status(400).json({ error: "Topic is too long" });
        return;
      }

      const result = await generateQuestions(topic);

      res.json({
        success: true,
        topic,
        result: result.questions,
      });
    } catch (err) {
      console.error("Question generation error:", err);
      res.status(500).json({
        error: "Failed to generate questions. Please try again.",
      });
    }
  },
);

// routes/courseRoutes.ts

router.post(
  "/api/courses/generate/roadmap",
  async (
    req: Request<
      {},
      RoadmapResult | ErrorResponse,
      {
        topic: string;
        answers: { id: number; question: string; answer: string }[];
      }
    >,
    res: Response<RoadmapResult | ErrorResponse>,
  ): Promise<void> => {
    try {
      const { topic, answers } = req.body;

      if (!topic || topic.trim().length === 0) {
        res.status(400).json({ error: "Course topic is required" });
        return;
      }

      if (!answers || !Array.isArray(answers) || answers.length === 0) {
        res.status(400).json({ error: "Answers are required" });
        return;
      }

      const roadmap = await generateRoadmap(topic, answers);

      res.json(roadmap);
    } catch (err) {
      console.error("Roadmap generation error:", err);
      res.status(500).json({
        error: "Failed to generate course roadmap. Please try again.",
      });
    }
  },
);

export default router;
