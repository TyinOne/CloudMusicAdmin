import {App} from "@vue/runtime-core";
import {store} from "@renderer/store";

export default (app: App) => {
  app.directive('permission', {
      created: (el, binding) => {
          console.log(el.parentNode)
      },
      mounted: (el, binding) => {
          let isHidden = true;
          let permissions = store.state.userInfos.userInfos.permissions
          if (permissions.length > 0 && permissions[0] === '*:*:*') {
              isHidden = false
          } else if (permissions.length > 0 && permissions.indexOf(binding) > -1) {
              isHidden = false
          } else if (binding === '') {
              isHidden = false
          }
          if (isHidden) {
              el.parentNode && el.parentNode.removeChild(el)
          }
      }
  })
}