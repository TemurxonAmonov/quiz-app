<template>
  <div>
    <a-spin v-if="pending" />
    <a-alert v-else-if="error" type="error" message="Failed to load quiz" show-icon class="mb-4" />

    <a-card v-else-if="quiz" :title="quiz.title" class="shadow-sm">
      <QuizTimer v-if="quiz.timeLimit" :seconds="quiz.timeLimit * 60" />

      <div v-for="(q, i) in quiz.questions" :key="i" class="mb-8">
        <p class="font-semibold mb-3">{{ i + 1 }}. {{ q.question }}</p>
        <a-radio-group v-model:value="answers[i]" class="flex flex-col gap-2">
          <a-radio v-for="(opt, idx) in q.options" :key="idx" :value="idx">{{ opt }}</a-radio>
        </a-radio-group>
      </div>

      <a-button type="primary" :loading="submitting" @click="onSubmit">Submit</a-button>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { message } from "ant-design-vue";

const route = useRoute();
const { getQuiz, submitQuiz } = useQuiz();

const { data, pending, error } = getQuiz(route.params.id as string);
const quiz = computed(() => data.value as any);
const answers = ref<number[]>([]);
const submitting = ref(false);
const studentName = useState<string>("student-name", () => "");

if (!studentName.value) {
  await navigateTo("/");
}

async function onSubmit() {
  if (!quiz.value?._id) return;
  submitting.value = true;
  try {
    const result = await submitQuiz(quiz.value._id, answers.value, studentName.value);
    const resultState = useState<any>("quiz-result", () => null);
    resultState.value = result;
    await navigateTo("/result");
  } catch {
    message.error("Submit failed");
  } finally {
    submitting.value = false;
  }
}
</script>
