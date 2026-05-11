<template>
  <div>
    <a-spin v-if="pending" />
    <a-alert v-else-if="error" type="error" message="Failed to load quiz" show-icon class="mb-4" />

    <a-card v-else-if="quiz" :title="quiz.title" class="shadow-sm">
      <QuizTimer v-if="remainingSeconds !== null" :seconds="remainingSeconds" />
      <a-alert v-else type="info" message="Timer is not set for this quiz" show-icon class="mb-6" />

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
const remainingSeconds = ref<number | null>(null);
const hasAutoSubmitted = ref(false);
let countdownHandle: ReturnType<typeof setInterval> | null = null;

function stopCountdown() {
  if (countdownHandle) {
    clearInterval(countdownHandle);
    countdownHandle = null;
  }
}

watch(
  () => quiz.value?.timeLimit,
  (timeLimit) => {
    if (!import.meta.client) return;

    stopCountdown();

    if (!timeLimit) {
      remainingSeconds.value = null;
      return;
    }

    hasAutoSubmitted.value = false;
    remainingSeconds.value = timeLimit * 60;
    countdownHandle = setInterval(() => {
      if (remainingSeconds.value === null) {
        stopCountdown();
        return;
      }

      if (remainingSeconds.value <= 1) {
        remainingSeconds.value = 0;
        stopCountdown();

        if (!submitting.value && !hasAutoSubmitted.value) {
          hasAutoSubmitted.value = true;
          onSubmit(true);
        }

        return;
      }

      remainingSeconds.value -= 1;
    }, 1000);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  stopCountdown();
});

if (!studentName.value) {
  await navigateTo("/");
}

async function onSubmit(isAutoSubmit = false) {
  if (!quiz.value?._id || submitting.value) return;
  submitting.value = true;

  if (isAutoSubmit) {
    message.info("Time is up. Submitting your quiz.");
  }

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
