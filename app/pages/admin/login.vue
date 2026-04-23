<template>
  <div class="max-w-md mx-auto mt-16">
    <a-card title="Admin Login" class="shadow-sm">
      <a-form layout="vertical" :model="form" @finish="onLogin">
        <a-form-item label="Username" name="username" :rules="[{ required: true, message: 'Username is required' }]">
          <a-input v-model:value="form.username" />
        </a-form-item>
        <a-form-item label="Password" name="password" :rules="[{ required: true, message: 'Password is required' }]">
          <a-input-password v-model:value="form.password" />
        </a-form-item>
        <a-button type="primary" html-type="submit" :loading="loading" block>Login</a-button>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { message } from "ant-design-vue";

definePageMeta({ layout: "default" });

const { login } = useAuth();
const loading = ref(false);
const form = ref({ username: "", password: "" });

async function onLogin() {
  loading.value = true;
  try {
    await login(form.value.username, form.value.password);
    await navigateTo("/admin/dashboard");
  } catch {
    message.error("Login failed");
  } finally {
    loading.value = false;
  }
}
</script>
