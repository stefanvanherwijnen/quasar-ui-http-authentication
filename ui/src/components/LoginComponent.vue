<template>
  <div>
    <q-card
      square
      style="width: 400px; padding:50px"
    >
      <q-card-section>
        <div class="text-h6">
          {{ lang.auth.login.login }}
        </div>
      </q-card-section>

      <q-form
        class="q-gutter-md"
        @submit="onSubmit"
      >
        <q-card-section>
          <q-input
            v-if="identifierField === 'email'"
            id="email"
            v-model.trim="data.user.email"
            type="email"
            :label="lang.auth.fields.email"
            :rules="validations['email']"
            lazy-rules
            autofocus
          />
          <q-input
            v-if="identifierField === 'username'"
            v-model.trim="data.user.username"
            type="text"
            :label="lang.auth.fields.username"
            :rules="validations['username']"
            lazy-rules
          />
          <q-input
            id="password"
            v-model="data.user.password"
            :type="showPassword ? 'text' : 'password'"
            :label="lang.auth.fields.password"
            :rules="validations['password']"
            lazy-rules
          >
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>
          <br>
          <q-checkbox
            id="rememberMe"
            v-model="data.rememberMe"
            :label="lang.auth.login.rememberMe"
          />
        </q-card-section>
        <q-card-actions>
          <q-btn
            :label="lang.auth.login.login"
            color="primary"
            :loading="loading"
            type="submit"
          />
        </q-card-actions>
      </q-form>
      <router-link to="/password/forgot">
        <a>{{ lang.auth.login.passwordForgot }}</a>
      </router-link>

      <q-card-section>
        <a>{{ lang.auth.login.registerMessage }} </a>
        <router-link to="/register">
          <a>{{ lang.auth.login.register }}</a>
        </router-link>
      </q-card-section>
    </q-card>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onBeforeMount, inject, computed, reactive } from '@vue/composition-api'
import { preFetch } from 'quasar/wrappers'
import { useStore } from '../store'

import isEmail from 'validator/es/lib/isEmail'

import { useAuthHelper } from '../utils/helper'
import { loadLang } from './lang/index'
import { AxiosResponse } from 'axios'
import { UserLoginType } from '../store/actions'

import { QCard, QCardSection, QForm, QCardActions, QInput, QBtn, QCheckbox, QIcon, Dialog } from 'quasar'
export default defineComponent({
  name: 'LoginComponent',
  components: {
    QCard, QCardSection, QForm, QCardActions, QInput, QBtn, QCheckbox, QIcon
  },
  props: {

  },

  setup (props, context) {
    const lang = ref(loadLang())
    function __setupLang () {
      const isoName = context.root.$q.lang.isoName || 'en-us'
      lang.value = loadLang(isoName)
    }
    watch(() => context.root.$q.lang.isoName, (lang, prevLang) => {
      __setupLang()
    })
    onBeforeMount(() => {
      __setupLang()
    })
    const $auth = reactive(useAuthHelper())
    const store = useStore()

    const data = ref({
      user:
      {
        email: '',
        username: '',
        password: ''
      },
      rememberMe: false
    })
    const loading = ref(false)
    const validations = ref({
      email: [
        (val: string): boolean | string => !!val || lang.value.auth.validations.required,
        (val: string): boolean | string => isEmail(val) || lang.value.auth.validations.email
      ],
      username: [
        (val: string): boolean | string => !!val || lang.value.auth.validations.required
      ],
      password: [(val: string): boolean | string => !!val || lang.value.auth.validations.required]
    })
    const identifierField = computed(() => store.state.value.identifierField)
    const showPassword = ref(false)

    function onSubmit () {
      let loginUser: UserLoginType | undefined
      if (identifierField.value === 'email') {
        loginUser = {
          __identifier: 'email',
          email: data.value.user.email,
          password: data.value.user.password
        }
      } else if (identifierField.value === 'username') {
        loginUser = {
          __identifier: 'username',
          username: data.value.user.username,
          password: data.value.user.password
        }
      }
      if (loginUser) {
        loading.value = true
        $auth
          .login({user: loginUser, rememberMe: data.value.rememberMe })
          .then(() => {
            // Either or?
            context.root.$router.replace('/')
            $auth.loginCallback({ router: context.root.$router })
          })
          .catch(error => {
            if (error.response) {
              if (error.response.status === 401) {
                Dialog.create({
                  message: lang.value.auth.login.verificationRequired
                })
              } else if (error.response.status === 403) {
                Dialog.create({
                  message: lang.value.auth.login.invalidCredentials
                })
              } else {
                console.error(error)
              }
            }
          })
          .finally(() => {
            loading.value = false
          })
      }
    }

    return {
      data,
      loading,
      lang,
      validations,
      identifierField,
      showPassword,
      onSubmit
    }
  }
})
</script>
