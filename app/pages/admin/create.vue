<template>
  <a-card title="Quiz Management" class="shadow-sm">
    <div class="mb-4 flex justify-end">
      <a-button type="primary" @click="openCreate">New Quiz</a-button>
    </div>

    <a-spin v-if="pending" />
    <a-alert v-else-if="error" type="error" message="Failed to load quizzes" show-icon class="mb-4" />
    <a-table v-else :columns="columns" :data-source="rows" row-key="_id" :pagination="{ pageSize: 8 }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'actions'">
          <div class="flex gap-2">
            <a-button size="small" @click="openEdit(record._id)">Edit</a-button>
            <a-button size="small" danger @click="confirmDelete(record._id)">Delete</a-button>
          </div>
        </template>
      </template>
    </a-table>
  </a-card>

  <a-modal v-model:open="isModalOpen" :title="editingId ? 'Edit Quiz' : 'Create Quiz'" :confirm-loading="saving" @ok="onSubmit" width="900px">
    <a-form layout="vertical" :model="form">
      <a-form-item label="Quiz Title" name="title" :rules="[{ required: true, message: 'Quiz title is required' }]">
        <a-input v-model:value="form.title" placeholder="Enter quiz title" />
      </a-form-item>

      <a-form-item label="Time Limit (minutes)">
        <a-input-number v-model:value="form.timeLimit" :min="1" class="w-full" placeholder="Enter time limit" />
      </a-form-item>

      <div v-for="(q, qIndex) in form.questions" :key="qIndex" class="border rounded-lg p-4 mb-4">
        <a-form-item :label="`Question ${qIndex + 1}`">
          <a-input v-model:value="q.question" placeholder="Question text" />
        </a-form-item>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <a-input v-for="(opt, oIndex) in q.options" :key="oIndex" v-model:value="q.options[oIndex]" :placeholder="`Option ${oIndex + 1}`" />
        </div>

        <a-form-item label="Correct Answer Index (0-3)" class="mt-3">
          <a-input-number v-model:value="q.answer" :min="0" :max="3" />
        </a-form-item>

        <a-button danger @click="removeQuestion(qIndex)" v-if="form.questions.length > 1">Remove Question</a-button>
      </div>

      <a-button @click="addQuestion">Add Question</a-button>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { message, Modal } from "ant-design-vue";

definePageMeta({ layout: "admin" });

const { getUser } = useAuth();
const user = await getUser();
if (!user || user.role !== "admin") {
  await navigateTo("/admin/login");
}

const { getQuizzes, getQuizForEdit, updateQuiz, deleteQuiz } = useQuiz();

const { data, pending, error, refresh } = getQuizzes();

const rows = computed(() => {
  const list = (data.value as any[]) || [];
  return list.map((item) => ({
    ...item,
    createdAt: new Date(item.createdAt).toLocaleString(),
  }));
});

const columns = [
  { title: "Title", dataIndex: "title", key: "title" },
  { title: "Created At", dataIndex: "createdAt", key: "createdAt" },
  { title: "Actions", key: "actions" },
];

const isModalOpen = ref(false);
const saving = ref(false);
const editingId = ref<string | null>(null);

const form = ref({
  title: "",
  timeLimit: 10,
  questions: [{ question: "", options: ["", "", "", ""], answer: 0 }],
});

function resetForm() {
  form.value = {
    title: "",
    timeLimit: 10,
    questions: [{ question: "", options: ["", "", "", ""], answer: 0 }],
  };
}

function openCreate() {
  editingId.value = null;
  resetForm();
  isModalOpen.value = true;
}

async function openEdit(id: string) {
  try {
    const quiz: any = await getQuizForEdit(id);
    editingId.value = id;
    form.value = {
      title: quiz.title,
      timeLimit: quiz.timeLimit || 10,
      questions: quiz.questions.map((q: any) => ({
        question: q.question,
        options: q.options,
        answer: q.answer,
      })),
    };
    isModalOpen.value = true;
  } catch {
    message.error("Failed to load quiz for editing");
  }
}

function addQuestion() {
  form.value.questions.push({ question: "", options: ["", "", "", ""], answer: 0 });
}

function removeQuestion(index: number) {
  form.value.questions.splice(index, 1);
}

async function onSubmit() {
  saving.value = true;
  try {
    if (editingId.value) {
      await updateQuiz(editingId.value, form.value);
      message.success("Quiz updated");
    } else {
      await $fetch("/api/quiz/create", {
        method: "POST",
        body: form.value,
      });
      message.success("Quiz created");
    }
    isModalOpen.value = false;
    await refresh();
  } catch {
    message.error("Failed to save quiz");
  } finally {
    saving.value = false;
  }
}

function confirmDelete(id: string) {
  Modal.confirm({
    title: "Delete Quiz",
    content: "Are you sure you want to delete this quiz?",
    okText: "Delete",
    okType: "danger",
    async onOk() {
      try {
        await deleteQuiz(id);
        message.success("Quiz deleted");
        await refresh();
      } catch {
        message.error("Failed to delete quiz");
      }
    },
  });
}
</script>
