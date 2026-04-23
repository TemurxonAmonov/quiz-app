<template>
  <a-layout class="min-h-screen">
    <a-layout-header class="flex items-center justify-between px-6">
      <NuxtLink to="/" class="text-white text-xl font-bold">Quiz App</NuxtLink>
      <div class="flex gap-4">
        <NuxtLink to="/" class="text-gray-300 hover:text-white">Home</NuxtLink>
        <NuxtLink to="/admin/login" class="text-gray-300 hover:text-white">Admin</NuxtLink>
      </div>
    </a-layout-header>
    <a-layout-content class="p-6">
      <div class="max-w-5xl mx-auto">
        <slot />
      </div>
    </a-layout-content>
    <a-layout-footer class="text-center text-gray-500">Quiz App © 2026</a-layout-footer>
  </a-layout>
</template>
