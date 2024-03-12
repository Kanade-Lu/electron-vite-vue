import type { ITableColumnConfig } from './types'

/** 预留设置默认值的空间 */
export function defineJsonTableConfig<T>(config: ITableColumnConfig<T>[]): ITableColumnConfig<T>[] {
  return config
}
