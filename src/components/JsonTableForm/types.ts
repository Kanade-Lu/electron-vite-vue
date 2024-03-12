import type ElTableColumn from 'element-plus/es/components/table/src/tableColumn'

export type ITableColumnFunction<T = any> = (row: T, column?: any, cellValue?: any, index?: number) => unknown & typeof ElTableColumn['formatter']
export interface ITableColumnConfig<T = any> {
  label: string
  prop: keyof T & string
  width?: string
  align?: string
  formatter?: ITableColumnFunction<T>
  type?: 'slot:image' | 'slot'
  /** 由于插槽和formatter不兼容，对插槽的使用严格一点 */
  onClick?: ITableColumnFunction<T>
  /** 同样是为了解决插槽和formatter不兼容的问题，使用onClick的时候不能直接在 el-form-item 内使用，所以必须要用slot，用了slot formatter失效，所以对于对象来说有指定key的需求 */
  key?: string
  /** 配合formatter 使用，主要是为了能自控换行。以 formatter内返回的字符串， 以"，"进行分割换行 */
  formatterSlot?: boolean
}
