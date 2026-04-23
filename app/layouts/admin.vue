<template>
  <a-layout class="min-h-screen">
    <a-layout-sider :collapsed="collapsed" collapsible @collapse="collapsed = !collapsed" class="min-h-screen">
      <div class="p-4 text-white text-lg font-bold text-center">Admin</div>
      <a-menu theme="dark" mode="inline" :selectedKeys="selectedKeys">
        <a-menu-item key="dashboard">
          <NuxtLink to="/admin/dashboard" class="text-inherit">Dashboard</NuxtLink>
        </a-menu-item>
        <a-menu-item key="create">
          <NuxtLink to="/admin/create" class="text-inherit">Quiz</NuxtLink>
        </a-menu-item>
        <a-menu-item key="results">
          <NuxtLink to="/admin/results" class="text-inherit">Results</NuxtLink>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="bg-white px-6 flex items-center justify-end">
        <a-button type="text" danger @click="logout">Logout</a-button>
      </a-layout-header>
      <a-layout-content class="p-6">
        <slot />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
const collapsed = ref(false);
const route = useRoute();
const { logout } = useAuth();

const selectedKeys = computed(() => {
  const path = route.path;
  if (path.includes("create")) return ["create"];
  if (path.includes("results")) return ["results"];
  return ["dashboard"];
});
</script>
