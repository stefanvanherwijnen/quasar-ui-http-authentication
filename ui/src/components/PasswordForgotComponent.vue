<template>
  <q-card
    square
    style="width: 400px; padding:50px"
  >
    <q-card-section>
      <div class="text-h6">
        {{ lang.auth.password.forgot.header }}
      </div>
    </q-card-section>

    <q-form
      class="q-gutter-md"
      @submit="onSubmit"
    >
      <q-card-section>
        <q-input
          id="email"
          v-model.trim="user.email"
          type="text"
          :label="lang.auth.fields.email"
          :rules="validations['email']"
          lazy-rules
          autofocus
        />
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

import isEmail from 'validator/es/lib/isEmail'

import { useAuthHelper } from '../utils/helper'
import { loadLang } from './lang/index'

import { QCard, QCardSection, QForm, QCardActions, QInput, QBtn, Dialog } from 'quasar'
export default defineComponent({
  name: 'PasswordForgotComponent',
  components: {
    QCard, QCardSection, QForm, QCardActions, QInput, QBtn
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

    const user = ref({
      email: '',
    })
    const loading = ref(false)
    const validations = ref({
      email: [
        val => !!val || lang.value.auth.validations.required,
        val => isEmail(val) || lang.value.auth.validations.email
      ]
    })

    function onSubmit () {
      loading.value = true
      $auth.passwordForgot(user.value)
        .then(response => {
          Dialog.create({
              message: lang.value.auth.password.forgot.checkEmail
            })
            .onOk(() => {
              context.root.$router.push('/login')
            })
        })
        .catch(error => {
          Dialog.create({
              message: lang.value.auth.password.forgot.unknownEmail
            })
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
      onSubmit
    }
  }
})
</script>
