import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// FOR QUESTION GENERATION
const QuestionSchema = z.object({
  id: z.string().describe("Id of the question"),
  text: z.string().describe("The text of the question"),
});

const QuestionsResponseSchema = z.object({
  questions: z.array(QuestionSchema),
});

// FOR ROADMAP GENERATION
const RoadmapSchema = z.object({
  title: z.string(),
  description: z.string(),
  modules: z.array(
    z.object({
      title: z.string(),
      topics: z.array(z.string()),
    }),
  ),
});

interface UserAnswer {
  id: number;
  question: string;
  answer: string;
}

export type RoadmapResult = z.infer<typeof RoadmapSchema>;

export type Question = z.infer<typeof QuestionSchema>;
export type QuestionsResult = z.infer<typeof QuestionsResponseSchema>;

// FOR COURSE GENERATION

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateQuestions(
  topic: string,
): Promise<QuestionsResult> {
  const prompt = `
You are an expert course designer.

The user wants to learn: "${topic}"

Generate exactly 4 short diagnostic questions to estimate the user's familiarity level.

IMPORTANT:
- Each question must be independent from the others.
- Do NOT build questions that logically follow one another.
- Do NOT progressively increase difficulty.
- Do NOT reference previous questions.
- Avoid very specific technical subtopics.
- Keep questions general and broad.
- Keep them simple and neutral.
- Each question must be ONE sentence.
- Maximum 14 words per question.
- Avoid definitions.
- Avoid multi-part questions.
- Make them feel casual and natural.

The goal is to capture different signals:
- Exposure
- Confidence
- Practical experience
- Conceptual familiarity

Return only valid JSON.
`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: zodToJsonSchema(QuestionsResponseSchema),
      },
    });
    const raw = response.text;

    console.log("RAW RESPONSE", raw);

    if (!raw) {
      throw new Error("Empty response from Gemini");
    }

    const json = JSON.parse(raw);
    const finalResponse: QuestionsResult = QuestionsResponseSchema.parse(json);
    return finalResponse;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw error;
  }
}

export async function generateRoadmap(
  topic: string,
  answers: UserAnswer[],
): Promise<RoadmapResult> {
  const formattedAnswers = answers
    .map(
      (a, index) => `Q${index + 1}: ${a.question}\nA${index + 1}: ${a.answer}`,
    )
    .join("\n\n");

  const prompt = `
You are an expert course architect.

The user wants to learn: "${topic}"

Based on their answers below, determine their knowledge level and create a structured learning roadmap.

User Answers:
${formattedAnswers}

Create:
- A course title
- A short course description
- 4 to 8 structured modules
- Each module must contain 3–6 specific topics

Return JSON only.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: zodToJsonSchema(RoadmapSchema),
      },
    });

    const raw = response.text;

    if (!raw) {
      throw new Error("Empty response from Gemini");
    }

    const json = JSON.parse(raw);
    const finalResponse = RoadmapSchema.parse(json);

    return finalResponse;
  } catch (error) {
    console.error("Roadmap generation error:", error);
    throw error;
  }
}
