<template>
  <q-card
    square
    style="width: 400px; padding:50px"
  >
    <q-card-section>
      <div class="text-h6">
        {{ lang.auth.password.reset.header }}
      </div>
    </q-card-section>

    <q-form
      class="q-gutter-md"
      @submit="onSubmit"
    >
      <q-card-section>
        <q-input
          id="password"
          v-model="user.password"
          :type="showPassword.password ? 'text' : 'password'"
          :label="lang.auth.fields.password"
          bottom-slots
          :rules="validations['password']"
          lazy-rules
        >
          <template v-slot:append>
            <q-icon
              :name="showPassword.password ? 'visibility' : 'visibility_off'"
              class="cursor-pointer"
              @click="showPassword.password = !showPassword.password"
            />
          </template>
        </q-input>
        <q-input
          id="repeatPassword"
          v-model="user.repeatPassword"
          :type="showPassword.repeatPassword ? 'text' : 'password'"
          :label="lang.auth.fields.repeatPassword"
          bottom-slots
          required
          :rules="validations['repeatPassword']"
          lazy-rules
        >
          <template v-slot:append>
            <q-icon
              :name="showPassword.repeatPassword ? 'visibility' : 'visibility_off'"
              class="cursor-pointer"
              @click="showPassword.repeatPassword = !showPassword.repeatPassword"
            />
          </template>
        </q-input>
      </q-card-section>
      <q-card-actions>
        <q-btn
          :label="lang.auth.submit"
          color="primary"
          :loading="loading"
          type="submit"
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onBeforeMount, reactive } from '@vue/composition-api'

import equals from 'validator/es/lib/equals'

import { useAuthHelper } from '../utils/helper'
import { loadLang } from './lang/index'

import { QCard, QCardSection, QForm, QCardActions, QInput, QBtn, Dialog } from 'quasar'
export default defineComponent({
  name: 'PasswordResetComponent',
  components: {
    QCard, QCardSection, QForm, QCardActions, QInput, QBtn
  },
  props: {
    minPasswordLength: {
      type: Number,
      default: 8
    }
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

    const user = ref({
      password: '',
      repeatPassword: ''
    })
    const loading = ref(false)
    const validations = ref({
        password: [
          val => !!val || lang.value.auth.validations.required,
          val =>
            val.length > props.minPasswordLength ||
            lang.value.auth.validations.passwordLength(props.minPasswordLength)
        ],
        repeatPassword: [
          val => !!val || lang.value.auth.validations.required,
          val =>
            equals(val, user.value.password) ||
            lang.value.auth.validations.passwordMatch
        ]
    })
    const showPassword = ref({
      password: false,
      repeatPassword: false
    })

    function onSubmit () {
      loading.value = true
      const token: string = context.root.$route.query.token
      $auth.passwordReset({
          token: token,
          user: { password: user.value.password }
        })
        .then(response => {
          Dialog.create({
              message: lang.value.auth.password.reset.success
            })
            .onOk(() => {
              context.root.$router.push('/login')
            })
        })
        .catch(error => {
          console.error(error)
        })
        .finally(() => {
          loading.value = false
        })
    }

    return {
      lang,
      user,
      loading,
      validations,
      showPassword,
      onSubmit
    }
  }
})
</script>
