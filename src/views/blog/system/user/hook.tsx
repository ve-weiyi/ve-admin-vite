import { getCurrentInstance } from "vue";
import { type Column, ElMessage } from "element-plus";
import { type FormField, RenderType } from "@/utils/render.tsx";
import { FixedDir } from "element-plus/es/components/table-v2/src/constants";

import {
  findUserListApi,
  updateUserRolesApi,
  updateUserStatusApi
} from "@/api/account.ts";
import { findRoleListApi } from "@/api/role.ts";
import { formatDate } from "@/utils/formatDate.ts";

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
      key: "avatar",
      title: "头像",
      dataKey: "avatar",
      width: 60,
      align: align,
      cellRenderer: (scope: any) => {
        return (
          <div>
            <img src={scope.row.avatar} width="40" height="40" />
          </div>
        );
      }
    },
    {
      key: "nickname",
      title: "昵称",
      dataKey: "nickname",
      width: 100,
      align: align
    },
    {
      key: "login_type",
      title: "登录方式",
      dataKey: "login_type",
      width: 100,
      align: align
    },
    {
      key: "roles",
      title: "角色列表",
      dataKey: "roles",
      width: 0,
      align: align,
      cellRenderer: (scope: any) => {
        return (
          <div>
            {scope.row.roles?.map((item: any) => {
              return <el-tag class="table-tag">{item.role_comment}</el-tag>;
            })}
          </div>
        );
      }
    },
    {
      key: "status",
      title: "状态",
      dataKey: "status",
      width: 0,
      align: align,
      cellRenderer: (scope: any) => {
        return (
          <el-switch
            v-model={scope.row.status}
            active-value={0}
            inactive-value={1}
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="正常"
            inactive-text="禁用"
            inline-prompt
            onChange={() => {
              let data = {
                user_id: scope.row.id,
                status: scope.row.status
              };
              updateUserStatusApi(data).then(res => {
                ElMessage.success("更新状态成功");
              });
            }}
          />
        );
      }
    },
    {
      key: "ip_address",
      title: "注册ip",
      dataKey: "ip_address",
      width: 0,
      align: align
    },
    {
      key: "ip_source",
      title: "注册地址",
      dataKey: "ip_source",
      width: 0,
      align: align
    },
    {
      key: "created_at",
      title: "创建时间",
      dataKey: "created_at",
      width: 120,
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
      key: "login_at",
      title: "最后登录时间",
      dataKey: "login_at",
      width: 140,
      align: align,
      sortable: true,
      cellRenderer: (scope: any) => {
        return (
          <div>
            <span>{formatDate(scope.row.login_at)}</span>
          </div>
        );
      }
    },
    {
      key: "operation",
      title: "操作",
      width: 120,
      align: align,
      fixed: FixedDir.RIGHT,
      cellRenderer: (scope: any) => {
        return (
          <div>
            <el-button
              type="primary"
              size="default"
              icon="edit-pen"
              onClick={() => instance.exposed.openForm(scope.row)}
            >
              编辑
            </el-button>
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
      label: "用户昵称",
      field: "nickname",

      searchRules: {
        flag: "and",
        rule: "like"
      }
    }
  ];
}

let roleOptions = [];
findRoleListApi({}).then(res => {
  res.data.list.forEach(item => {
    roleOptions.push({ label: item.role_comment, value: item.id });
  });
});

// 表单字段
function getFormFields(model: any): FormField[] {
  return [
    {
      type: RenderType.Input,
      field: "nickname",
      label: "昵称"
    },
    {
      type: RenderType.MultiSelect,
      field: "roles",
      label: "角色",
      options: roleOptions
    }
  ];
}

function handleApi(event: string, data: any) {
  console.log("event", event);
  console.log("data", data);
  switch (event) {
    case "create":
      return null;
    case "update":
      return updateUserRolesApi({ user_id: data.id, role_ids: data.roles });
    case "delete":
      return null;
    case "deleteByIds":
      return null;
    case "list":
      return findUserListApi(data);
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
