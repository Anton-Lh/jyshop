const directive = Vue => {
    /**
     *  v-enter-number
     *  限制input输入框只能输入正整数
     *  v-enter-number.float="2" (保留两位小数)
     */
    Vue.directive("enterNumber", {
        insert (el, binding, vnode) {
            let ele = el.tagName === "INPUT" ? el : el.querySelector("input");
            if (ele) {
                ele.addEventListener("input", Vue.prototype.$util.onInput(ele, binding, vnode));
            }
        },
        update (el, binding, vnode) {
            let ele = el.tagName === "INPUT" ? el : el.querySelector("input");
            if (ele) {
                ele.addEventListener("input", Vue.prototype.$util.onInput(ele, binding, vnode));
            }
        },

        unbink (el, binding, vnode) {
            let ele = el.tagName === "INPUT" ? el : el.querySelector("input");
            if (ele) {
                ele.removeEventListener("input", Vue.prototype.$util.onInput(ele, binding, vnode));
            }
        }
    });



}


export default directive
