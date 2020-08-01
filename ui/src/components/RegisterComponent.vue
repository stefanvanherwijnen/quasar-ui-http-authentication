<template>
  <div>
    <q-card
      square
      style="width: 400px; padding:50px"
    >
      <q-card-section>
        <div class="text-h6">
          {{ lang.auth.register.register }}
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
            v-model.trim="user.email"
            type="email"
            :label="lang.auth.fields.email"
            bottom-slots
            autofocus
            :rules="validations['email']"
            lazy-rules
          />
          <q-input
            v-if="identifierField === 'username'"
            v-model.trim="user.username"
            type="text"
            :label="lang.auth.fields.username"
            :rules="validations['username']"
            lazy-rules
          />
          <slot
            name="extraFields"
            :data="data"
          />
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
            :label="lang.auth.register.register"
            :loading="loading"
            color="primary"
            type="submit"
          />
        </q-card-actions>
      </q-form>
    </q-card>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onBeforeMount, inject, computed, reactive } from '@vue/composition-api'
import { preFetch } from 'quasar/wrappers'
import { useStore } from '../store'

import isEmail from 'validator/es/lib/isEmail'
import equals from 'validator/es/lib/equals'
import isAlphanumeric from 'validator/es/lib/isAlphanumeric'

import { useAuthHelper } from '../utils/helper'
import { loadLang } from './lang/index'
import { AxiosResponse } from 'axios'
import { UserLoginType } from '../store/actions'

import { QCard, QCardSection, QForm, QCardActions, QInput, QBtn, QCheckbox, QIcon, Dialog } from 'quasar'
export default defineComponent({
  name: 'RegisterComponent',
  components: {
    QCard, QCardSection, QForm, QCardActions, QInput, QBtn, QCheckbox, QIcon
  },
  props: {
    extraFields: {
      type: Object,
      default: () => ({})
    },
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
    const store = useStore()


    const user = ref({
      username: '',
      email: '',
      password: '',
      repeatPassword: '',
      ...props.extraFields
    })
    const loading = ref(false)
    const validations = ref({
        email: [
          val => !!val || lang.value.auth.validations.required,
          val => isEmail(val) || lang.value.auth.validations.email
        ],
        username: [
          val => !!val || lang.value.auth.validations.required,
          val => isAlphanumeric(val) || lang.value.auth.validations.username
        ],
        password: [
          val => !!val || lang.value.auth.validations.required,
          val =>
            val.length >= props.minPasswordLength ||
            lang.value.auth.validations.passwordLength(props.minPasswordLength)
        ],
        repeatPassword: [
          val => !!val || lang.value.auth.validations.required,
          val =>
            equals(val, user.value.password) ||
            lang.value.auth.validations.passwordMatch
        ]
    })
    const identifierField = computed(() => store.state.value.identifierField)
    const showPassword = ref({
          password: false,
          repeatPassword: false
    })

    function register () {
        loading.value = true
        let registerUser
        if (identifierField.value === 'email') {
          registerUser = {
            __identifier: 'email',
            email: user.value.email,
            password: user.value.password
          }
        } else if (identifierField.value === 'username') {
          registerUser = {
            __identifier: 'username',
            username: user.value.username,
            password: user.value.password
          }
        }
        $auth
          .register(registerUser)
          .then(() => {
            Dialog.create({
                message: lang.value.auth.register.accountCreated
              })
              .onOk(data => {
                context.root.$router.push('/')
              })
          })
          .catch(error => {
            if (error.response) {
              if (error.response.status === 422) {
                Dialog.create({
                  message: lang.value.auth.register.invalidData
                })
              } else if (error.response.status === 409) {
                Dialog.create({
                  message: lang.value.auth.register.alreadyRegistered
                })
              } else {
                Dialog.create({
                  message: lang.value.auth.register.error
                })
                console.error(error)
              }
            }
          })
          .finally(() => {
            loading.value = false
          })
    }
      
    function onSubmit () {
      if (identifierField.value === 'email') {
        Dialog.create({
          html: true,
          message: lang.value.auth.register.checkEmail(user.value.email),
          cancel: true
        })
        .onOk(() => {
          register()
        })
      } else {
        register()
      }
    }


    return {
      lang,
      user,
      loading,
      validations,
      identifierField,
      showPassword,
      onSubmit
    }
  }
})
</script>
