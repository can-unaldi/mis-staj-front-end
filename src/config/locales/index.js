const locales = [
  {
    locale: 'en',
    messages: import('./en'),
    //loadData: import(`@formatjs/intl-relativetimeformat/dist/locale-data/en`),
  },
  {
    locale: 'tr',
    messages: import('./tr'),
    //loadData: import(`@formatjs/intl-relativetimeformat/dist/locale-data/tr`),
  },
]

export default locales
