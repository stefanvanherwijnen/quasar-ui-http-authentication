


<template>
  <p v-cloak>
    {{ message }}
  </p>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onBeforeMount, onMounted, reactive } from '@vue/composition-api'
import { useAuthHelper } from '../utils/helper'
import { loadLang } from './lang/index'

import { Dialog } from 'quasar'
export default defineComponent({
  name: 'VerificationComponent',
  components: {
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
    onMounted(() => {
      verifyUser()
    })
    const $auth = reactive(useAuthHelper())

    const token = ref('')
    const message = ref('')

    function verifyUser () {
      token.value = context.root.$route.query.token

      $auth.verify(token.value)
        .then((response) => {
          message.value = lang.value.auth.verification.success
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 422) {
              message.value = lang.value.auth.verification.failed
            }
          }
          console.error(error)
        })
    }
    return {
      lang,
      token,
      message
    }
  }
})
</script>


<style>
[v-cloak] {
  display: none;
}
</style>
