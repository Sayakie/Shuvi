const base_dataset_uri = '../locales/en-US.json' as const

export type LocaleDataSet = keyof typeof import('../locales/en_US.json')

export const locale = import(base_dataset_uri)
  .catch(reason => {
    throw new Error(reason)
  })
  .then((dataset: Exclude<typeof import('../locales/en_US.json'), 'default'>) =>
    Promise.resolve(dataset)
  )
