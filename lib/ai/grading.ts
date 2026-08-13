import "server-only";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export interface GradeInput {
  taskTitle: string;
  taskInstructions: string;
  rubric: string; // gabarito — pode vir vazio
  lessonContent: string; // descrição/conteúdo da aula ligada à tarefa
  moduleTitle: string;
  studentAnswer: string;
}

export interface GradeResult {
  score: number; // 0-10
  feedback: string;
}

const GRADE_TOOL: Anthropic.Tool = {
  name: "submit_grade",
  description: "Envia a nota (0 a 10) e o feedback para a resposta do aluno.",
  input_schema: {
    type: "object",
    properties: {
      score: { type: "number", description: "Nota de 0 a 10, pode ter uma casa decimal" },
      feedback: { type: "string", description: "Feedback construtivo em português para o aluno, explicando a nota" },
    },
    required: ["score", "feedback"],
  },
};

export async function gradeSubmission(input: GradeInput): Promise<GradeResult> {
  const hasRubric = input.rubric.trim().length > 0;

  const prompt = `Você é um professor de Psicanálise corrigindo a resposta de um aluno da Formação IDM.

Módulo: ${input.moduleTitle}
Tarefa: ${input.taskTitle}
Instruções da tarefa: ${input.taskInstructions}

${hasRubric ? `Gabarito/critério de correção (use como critério PRINCIPAL):\n${input.rubric}\n` : ""}
Conteúdo da aula relacionada (use como apoio${hasRubric ? " complementar ao gabarito" : " principal, já que não há gabarito definido"}):
${input.lessonContent || "(sem conteúdo de aula vinculado)"}

Resposta do aluno:
${input.studentAnswer}

Avalie a resposta do aluno de 0 a 10 e escreva um feedback construtivo em português, apontando o que foi bem e o que pode melhorar. Use a ferramenta submit_grade para enviar sua avaliação.`;

  const response = await client.messages.create({
    model: "claude-opus-5",
    max_tokens: 2048,
    tools: [GRADE_TOOL],
    tool_choice: { type: "tool", name: "submit_grade" },
    messages: [{ role: "user", content: prompt }],
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );

  if (!toolUse) {
    throw new Error("A IA não retornou uma avaliação estruturada.");
  }

  const result = toolUse.input as { score: number; feedback: string };
  return {
    score: Math.max(0, Math.min(10, result.score)),
    feedback: result.feedback,
  };
}
