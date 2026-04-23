<template>
  <a-card title="Student Results" class="shadow-sm">
    <a-spin v-if="pending" />
    <a-alert v-else-if="error" type="error" message="Failed to load results" show-icon class="mb-4" />
    <a-table v-else :columns="columns" :data-source="rows" :pagination="{ pageSize: 6 }" row-key="_id" />
  </a-card>
</template>

<script setup lang="ts">
definePageMeta({ layout: "admin" });

const { getUser } = useAuth();
const user = await getUser();
if (!user || user.role !== "admin") {
  await navigateTo("/admin/login");
}

const columns = [
  { title: "Student Name", dataIndex: "studentName", key: "studentName" },
  { title: "Quiz Title", dataIndex: "quizTitle", key: "quizTitle" },
  { title: "Score", dataIndex: "score", key: "score" },
  { title: "Total", dataIndex: "total", key: "total" },
  { title: "Date", dataIndex: "date", key: "date" },
];

const { data, pending, error } = useFetch("/api/results");

const rows = computed(() => {
  const list = (data.value as any[]) || [];
  return list.map((item) => ({
    ...item,
    date: new Date(item.createdAt).toLocaleString(),
  }));
});
</script>
