export function useQuiz() {
  function getQuizzes() {
    return useFetch("/api/quiz");
  }

  function getQuiz(id: string) {
    return useFetch(`/api/quiz/${id}`);
  }

  function getQuizForEdit(id: string) {
    return $fetch(`/api/quiz/${id}/edit`);
  }

  async function submitQuiz(quizId: string, answers: number[], studentName: string) {
    return await $fetch("/api/quiz/submit", {
      method: "POST",
      body: { quizId, answers, studentName },
    });
  }

  async function updateQuiz(id: string, payload: { title: string; timeLimit?: number; questions: Array<{ question: string; options: string[]; answer: number }> }) {
    return await $fetch(`/api/quiz/${id}`, {
      method: "PUT",
      body: payload,
    });
  }

  async function deleteQuiz(id: string) {
    return await $fetch(`/api/quiz/${id}`, {
      method: "DELETE",
    });
  }

  function getResults() {
    return useFetch("/api/results");
  }

  return { getQuizzes, getQuiz, getQuizForEdit, submitQuiz, updateQuiz, deleteQuiz, getResults };
}
