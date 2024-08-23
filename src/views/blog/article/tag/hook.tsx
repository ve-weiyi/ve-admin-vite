import { getCurrentInstance } from "vue";
import type { Column } from "element-plus";
import { type FormField, RenderType } from "@/utils/render";

import {
  addTagApi,
  batchDeleteTagApi,
  deleteTagApi,
  findTagListApi,
  updateTagApi
} from "@/api/tag";
import type { TagBackDTO } from "@/api/types";
import { formatDate } from "@/utils/date.ts";

const align = "center";

// 表格展示列信息
function getColumnFields(): Column[] {
  const instance = getCurrentInstance();
  return [
    {
      key: "selection",
      type: "selection",
      title: "批量操作",
      width: 60,
      align: align
    },
    {
      key: "id",
      title: "id",
      dataKey: "id",
      width: 70,
      align: align,
      sortable: true
    },
    {
      key: "tag_name",
      title: "标签名称",
      dataKey: "tag_name",
      width: 0,
      align: align,
      cellRenderer: (scope: any) => {
        return (
          <div>
            <el-tag>{scope.row.tag_name}</el-tag>
          </div>
        );
      }
    },
    {
      key: "article_count",
      title: "文章数量",
      dataKey: "article_count",
      width: 0,
      align: align
    },
    {
      key: "created_at",
      title: "创建时间",
      dataKey: "created_at",
      width: 170,
      align: align,
      sortable: true,
      cellRenderer: (scope: any) => {
        return (
          <div>
            <span>{formatDate(scope.row.created_at)}</span>
          </div>
        );
      }
    },
    {
      key: "operation",
      title: "操作",
      width: 160,
      align: align,
      cellRenderer: (scope: any) => {
        return (
          <div>
            {
              <el-button
                type="primary"
                size="default"
                onClick={() => instance.exposed.openForm(scope.row)}
              >
                编辑
              </el-button>
            }
            <el-popconfirm
              title="确定删除吗？"
              onConfirm={() => instance.exposed.onDelete(scope.row)}
            >
              {{
                reference: () => (
                  <el-button type="danger" size="default">
                    删除
                  </el-button>
                )
              }}
            </el-popconfirm>
          </div>
        );
      }
    }
  ];
}

// 搜索条件
function getSearchFields(): FormField[] {
  return [
    {
      type: RenderType.Input,
      label: "标签名称",
      field: "tag_name",
      searchRules: {
        flag: "and",
        rule: "like"
      }
    }
  ];
}

// 表单字段
function getFormFields(model: TagBackDTO): FormField[] {
  return [
    {
      type: RenderType.Input,
      field: "tag_name",
      label: "标签名称"
    }
  ];
}

function handleApi(event: string, data: any) {
  console.log("event", event);
  switch (event) {
    case "create":
      return addTagApi(data);
    case "update":
      return updateTagApi(data);
    case "delete":
      return deleteTagApi(data);
    case "deleteByIds":
      return batchDeleteTagApi(data);
    case "list":
      return findTagListApi(data);
    default:
      return;
  }
}

export function useTableHook() {
  return {
    getColumnFields,
    getSearchFields,
    getFormFields,
    handleApi
  };
}
