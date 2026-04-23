<template>
  <div class="max-w-xl mx-auto mt-10">
    <a-card title="Quiz Result" class="shadow-sm">
      <p class="text-lg mb-2">
        Student:
        <strong>{{ result?.studentName ?? "-" }}</strong>
      </p>
      <p class="text-lg mb-2">
        Score:
        <strong>{{ result?.score ?? 0 }}</strong>
      </p>
      <p class="text-lg mb-6">
        Total:
        <strong>{{ result?.total ?? 0 }}</strong>
      </p>
      <a-button type="primary" @click="navigateTo('/')">Back to Home</a-button>
    </a-card>
  </div>
</template>

<script setup lang="ts">
const result = useState<any>("quiz-result", () => null);
</script>
