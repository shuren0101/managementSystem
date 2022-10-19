import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from './en';
import zhLocale from './zh';
import ElementenLocale from 'element-ui/lib/locale/lang/en'
import ElementzhLocale from 'element-ui/lib/locale/lang/zh-CN'

Vue.use(VueI18n)

const i18n = new VueI18n({
    locale: 'zh', // 默认语言
    messages: {
        zh: {...zhLocale, ...ElementzhLocale },
        en: {...enLocale, ...ElementenLocale }
    }
})

export default i18n