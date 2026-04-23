<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <a-card>
        <p class="text-gray-500">Total Quizzes</p>
        <p class="text-3xl font-bold">{{ totalQuizzes }}</p>
      </a-card>
      <a-card>
        <p class="text-gray-500">Total Submissions</p>
        <p class="text-3xl font-bold">{{ totalSubmissions }}</p>
      </a-card>
    </div>

    <div class="flex gap-3">
      <a-button type="primary" @click="navigateTo('/admin/create')">Create Quiz</a-button>
      <a-button @click="navigateTo('/admin/results')">View Results</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "admin" });

const { getUser } = useAuth();
const user = await getUser();
if (!user || user.role !== "admin") {
  await navigateTo("/admin/login");
}

const { data } = await useFetch("/api/quiz");
const totalQuizzes = computed(() => ((data.value as any[]) || []).length);

const { data: resultsData } = await useFetch("/api/results");
const totalSubmissions = computed(() => ((resultsData.value as any[]) || []).length);
</script>
