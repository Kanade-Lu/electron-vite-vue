<script setup lang="ts" generic="T">
import type { ITableColumnConfig } from './types'

defineProps<{
  tableData: any[]
  tableColumnConfig: ITableColumnConfig<T>[]
  total?: number | string
  currentPage?: number
  loading?: boolean
  tableLayout?: 'auto' | 'fixed'
}>()
defineEmits<{
  currentChange: [number]
}>()

defineSlots<ISlots>()

interface ISlotProps {
  row: T
  column: ITableColumnConfig<T>
  $index: number
  store: {
    states: {
      _data: T[]
    }
  }
}

type ISlots = {
  [P in keyof T]: (props: {
    row: T
    props: ISlotProps
    index: number
  }) => VNode[]
} & {
  'lastColumns': (props: {
    row: T
    props: ISlotProps
    index: number
  }) => VNode[]
  'tableTab': (props: any) => VNode[]
}
function handleFomatterAndKey(row: any, item: ITableColumnConfig) {
  if (item.formatter)
    return item.formatter(row)

  if (!row[item.prop])
    return ''

  if (item.key && item.key in row[item.prop])
    return row[item.prop][item.key]

  return row[item.prop]
}

// 使用vscode的话这里会提示unused，请勿删除，应该是插件提示出错
function slotImageSrc(item: ITableColumnConfig<T>, tableRow: Record<string, any>) {
  if (item.key)
    return tableRow.row[item.prop][item.key].uploadImage || tableRow.row[item.prop][item.key]

  else
    return tableRow.row[item.prop].uploadImage || tableRow.row[item.prop]
}
// 使用vscode的话这里会提示unused，请勿删除，应该是插件提示出错
function slotImagePreImageList(item: ITableColumnConfig<T>, tableRow: Record<string, any>) {
  if (item.key)
    return [tableRow.row[item.prop][item.key].uploadImage || tableRow.row[item.prop][item.key]]

  else
    return [tableRow.row[item.prop].uploadImage || tableRow.row[item.prop]]
}
</script>

<template>
  <el-row
    class="mt20"
    type="flex"
    justify="space-between"
  >
    <slot name="tableTab" />
  </el-row>

  <el-table
    v-loading="loading || false"
    stripe
    scrollbar-always-on
    :data="tableData"
    :table-layout="tableLayout || 'fixed'"
  >
    <el-table-column
      v-for="item in tableColumnConfig"
      :key="item.prop"
      :label="item.label"
      :prop="item.prop"
      :width="item.width"
      :formatter="item.formatter"
      :align="item.align || 'center'"
    >
      <template
        v-if="item.onClick"
        #default="tableRow"
      >
        <div
          v-if="item?.prop in tableRow.row"
          class="cursor-pointer text-blue"
          @click="item.onClick(tableRow?.row, tableRow?.column, tableRow.row[item?.prop], tableRow?.cellIndex)"
        >
          {{ handleFomatterAndKey(tableRow.row, item) }}
        </div>
      </template>
      <template
        v-else-if="item.type === 'slot'"
        #default="tableRow"
      >
        <slot
          :name="item.prop"
          :props="tableRow"
          :row="tableRow.row"
          :index="tableRow.$index"
        />
      </template>
      <template
        v-else-if="item.type === 'slot:image'"
        #default="tableRow"
      >
        <div
          v-if="item?.prop in tableRow.row"
          flex
          items-center
        >
          <el-image
            hide-on-click-modal
            :src="slotImageSrc(item, tableRow)"
            :preview-src-list="slotImagePreImageList(item, tableRow)"
            preview-teleported
          />
        </div>
      </template>
      <template
        v-else-if="item.formatterSlot"
        #default="tableRow"
      >
        <div
          v-if="item?.prop in tableRow.row"
          flex
          flex-col
        >
          <p
            v-for="text, index in item.formatter(tableRow.row).split('，')"
            :key="text"
            @click="item.formatterSlotOnClick[index]()"
          >
            {{ text }}
          </p>
        </div>
      </template>
      <template
        v-else-if="item.key && !item.onClick"
        #default="tableRow"
      >
        {{ handleFomatterAndKey(tableRow.row, item) }}
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      align="center"
    >
      <template #default="tableRow">
        <slot
          name="lastColumns"
          :props="tableRow"
          :row="tableRow.row"
          :index="tableRow.$index"
        />
      </template>
    </el-table-column>
  </el-table>
  <el-row
    v-if="currentPage"
    mt-4
    :span="24"
  >
    <el-col :span="24">
      <el-pagination
        :current-page="currentPage"
        background
        layout="total, prev, pager, next, jumper, slot"
        :total="Number(total)"
        @current-change="$emit('currentChange', $event)"
      >
        <el-button type="primary">
          确定
        </el-button>
      </el-pagination>
    </el-col>
  </el-row>
</template>

<style scoped lang="less">
// 多个el-button并且的时候会带上margin-left: 12px
:deep(.el-button + .el-button) {
  margin-left: 0;
}
</style>
