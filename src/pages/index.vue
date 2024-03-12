<script setup lang="ts" generic="T extends any, O extends any">
import { ElMessage, dayjs } from 'element-plus'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { data } from '../../export/data'
import type { ITableColumnConfig } from '~/components/JsonTableForm/types'
import 'element-plus/es/components/message/style/css'

defineOptions({
  name: 'IndexPage',
})
const activeKey = ref('2024')
const tabList = Object.keys(data)

interface ITableData {
  date: string
  currentWeekWork: string
  nextWeekWork: string
  question?: string
}
const tableData = ref<Record<string, ITableData[]>>(data)

function deleteRow(index: number) {
  tableData.value[activeKey.value].splice(index, 1)
}

function onAddItem() {
  const currentYear = tableData.value[activeKey.value]
  const lastWeek = currentYear[currentYear.length - 1]
  const [startDay, endDay] = lastWeek.date.split('，')
  tableData.value[activeKey.value].push({
    date: `${dayjs(startDay).startOf('week').add(8, 'day').format('YYYY-MM-DD')}，${dayjs(endDay).startOf('week').add(12, 'day').format('YYYY-MM-DD')}`,
    currentWeekWork: '',
    nextWeekWork: '',
    question: '',
  })
}

const tableConfig: ITableColumnConfig<ITableData>[] = [{
  prop: 'date',
  label: '日期',
  formatterSlot: true,
  formatter: (row) => {
    return row.date
  },
}, {
  prop: 'currentWeekWork',
  label: '本周工作',
  type: 'slot',
  width: '600px',
}, {
  prop: 'nextWeekWork',
  label: '下周工作',
  type: 'slot',
  width: '300px',
}, {
  prop: 'question',
  label: '问题收集',
}]

function exportTable() {
  const content = `export const data = ${JSON.stringify(tableData.value)}`
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `data.ts`
  a.click()

  URL.revokeObjectURL(url)
  ElMessage.success('写入成功')
}

/** Quill的对key的设计估计有问题，必须要这么处理去主动清楚数据错误 */
const showQuill = ref(true)
function hackQuill() {
  showQuill.value = false
  nextTick(() => {
    showQuill.value = true
  })
}
</script>

<template>
  <div>
    <JsonTableForm :table-column-config="tableConfig" :table-data="tableData[activeKey]">
      <template #tableTab>
        <el-tabs v-model="activeKey" @tab-change="hackQuill">
          <el-tab-pane v-for="year in tabList" :key="year" :name="year" :label="year" />
        </el-tabs>
      </template>

      <template #currentWeekWork="{ row }">
        <QuillEditor v-if="showQuill" v-model:content="row.currentWeekWork" toolbar="#my-toolbar" theme="snow" content-type="html">
          <template #toolbar>
            <div id="my-toolbar" />
          </template>
        </QuillEditor>
      </template>
      <template #nextWeekWork="{ row }">
        <QuillEditor v-if="showQuill" v-model:content="row.nextWeekWork" theme="snow" content-type="html" toolbar="#my-toolbar">
          <template #toolbar>
            <div id="my-toolbar" />
          </template>
        </QuillEditor>
      </template>
      <template #lastColumns="{ index }">
        <el-button
          link
          type="primary"
          size="small"
          @click.prevent="deleteRow(index)"
        >
          Remove
        </el-button>
      </template>
    </JsonTableForm>
    <el-button
      type="info"
      class="mt-4"
      @click="exportTable"
    >
      Export
    </el-button>
    <el-button type="primary" class="mt-4" @click="onAddItem">
      Add Item
    </el-button>
  </div>
</template>
