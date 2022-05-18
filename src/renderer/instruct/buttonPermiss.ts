import {App} from "@vue/runtime-core";
import {store} from "@renderer/store";

export default (app: App) => {
  app.directive('permission', {
      created: (el, binding) => {
      },
      mounted: (el, binding) => {
          let isHidden = true;
          let permissions = store.state.userInfos.userInfos.permissions
          if (permissions.length > 0 && permissions[0] === '*:*:*') {
              isHidden = false
          } else if (permissions.length > 0 && permissions.indexOf(binding.value) > -1) {
              isHidden = false
          } else if (binding.value === '') {
              isHidden = false
          }
          if (isHidden) {
              // el.parentNode && el.parentNode.removeChild(el)
              el.setAttribute('class', el.getAttribute('class') + ' is-disabled')
              el.setAttribute('aria-disabled', 'true')
              el.setAttribute('disabled', 'true')
          }
      }
  })
}