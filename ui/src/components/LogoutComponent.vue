


<template>

</template>

<script lang="ts">
import { defineComponent, ref, watch, onBeforeMount, onMounted, reactive } from '@vue/composition-api'
import { useAuthHelper } from '../utils/helper'
import { loadLang } from './lang/index'

import { Dialog } from 'quasar'
export default defineComponent({
  name: 'LogoutComponent',
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
    const $auth = reactive(useAuthHelper())

    function logoutDialog () {
      Dialog.create({
        title: lang.value.auth.logout.confirm,
        message: lang.value.auth.logout.confirmation,
        ok: lang.value.auth.logout.logout,
        cancel: lang.value.auth.logout.cancel
      }).onOk(() => {
        $auth.logout()
        context.root.$router.replace('/')
      }).onCancel(() => {
        context.root.$router.go(-1)
      })
    }

    onMounted(() => {
      logoutDialog()
    })

    return {
      lang
    }
  }
})
</script>