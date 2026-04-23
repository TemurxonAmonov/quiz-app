<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Available Quizzes</h1>

    <a-spin v-if="pending" />
    <a-alert v-else-if="error" type="error" message="Failed to load quizzes" show-icon class="mb-4" />

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <a-card v-for="quiz in quizzes" :key="quiz._id" :title="quiz.title" class="shadow-sm">
        <template #actions>
          <a-button type="primary" @click="openStartModal(quiz._id)">Start Quiz</a-button>
        </template>
      </a-card>
    </div>

    <a-modal v-model:open="isStartModalOpen" title="Student Information" :footer="null" :maskClosable="false">
      <a-form layout="vertical" :model="studentForm" @finish="onConfirmStart">
        <a-form-item label="Full Name" name="fullName" :rules="[{ required: true, message: 'Full name is required' }]">
          <a-input v-model:value="studentForm.fullName" placeholder="Enter your full name" />
        </a-form-item>
        <div class="flex justify-end gap-2">
          <a-button @click="isStartModalOpen = false">Cancel</a-button>
          <a-button type="primary" html-type="submit" :disabled="!studentForm.fullName.trim()">Start</a-button>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
const { getQuizzes } = useQuiz();
const { data, pending, error } = getQuizzes();

const quizzes = computed(() => (data.value as any[]) || []);
const studentName = useState<string>("student-name", () => "");
const selectedQuizId = ref<string>("");
const isStartModalOpen = ref(false);
const studentForm = ref({ fullName: studentName.value || "" });

function openStartModal(quizId: string) {
  selectedQuizId.value = quizId;
  studentForm.value.fullName = studentName.value || "";
  isStartModalOpen.value = true;
}

async function onConfirmStart() {
  if (!selectedQuizId.value || !studentForm.value.fullName.trim()) return;
  studentName.value = studentForm.value.fullName.trim();
  isStartModalOpen.value = false;
  await navigateTo(`/quiz/${selectedQuizId.value}`);
}
</script>
