<template>
  <div class="flex items-center justify-center">
    <div class="w-full">
      <div class="flex justify-between items-center">
        <h2 class="text-xl text-gray-800">
          邮箱列表
          <span class="text-sm text-gray-700 ml-1">获取引导邮件</span>
        </h2>
        <div>
          <select
            v-model="form.code"
            @change="filterCodeHandle"
            name="filter"
            id="filter-status"
            :class="selectClass"
            class="form-select py-1"
          >
            <option :value="0">选择状态过滤</option>
            <option
              v-for="(text, code) in statusList"
              :value="code"
              v-text="code + text"
              :key="code"
            ></option>
          </select>

          <select
            name="trashed"
            v-model="form.trashed"
            @change="filterTrashedHandle"
            :class="selectClass"
            class="form-select py-1"
          >
            <option
              :value="trashed.value"
              v-text="trashed.label"
              v-for="(trashed, key) in trashedList"
              :key="key"
            ></option>
          </select>
        </div>
      </div>
      <div class="mt-3">
        <table class="w-full border border-gray-300">
          <thead>
            <tr class="bg-gray-100 text-gray-800">
              <th class="p-2 text-center border">ID</th>
              <th class="p-2 text-center border">邮箱地址</th>
              <th class="p-2 text-center border">响应码</th>
              <th class="p-2 text-center border">对应内容</th>
              <th class="p-2 text-center border">注册页面</th>
              <th class="p-2 text-center border">创建时间</th>
              <th class="p-2 text-center border">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="hover:bg-gray-100 text-gray-700"
              :class="{'opacity-50' : item.is_delete}"
              v-for="item in data.data"
              :key="item.id"
            >
              <td class="p-2 border border-gray-300 text-center" v-text="item.id"></td>
              <td class="p-2 border border-gray-300" v-text="item.email"></td>
              <td class="p-2 border border-gray-300">
                <span
                  class="inline-block rounded-full w-2 h-2"
                  :class="{'bg-green-500': item.status, 'bg-red-500': !item.status}"
                ></span>
                <span class="ml-1" v-text="item.code"></span>
              </td>
              <td class="p-2 border border-gray-300" v-text="item.message"></td>
              <td class="p-2 border border-gray-300">
                <a
                  class="text-blue-500 hover:underline"
                  :href="item.request_url"
                  v-text="item.request_name"
                  target="_blank"
                ></a>
              </td>
              <td class="p-2 border border-gray-300" v-text="item.created_at"></td>
              <td class="p-2 border border-gray-300">
                <a
                  class="text-red-400 hover:text-red-500 hover:underline"
                  href="javascript:void(0);"
                  v-if="!item.is_delete"
                  v-show="canDestroyResource"
                  @click.prevent="destroy(item.id)"
                >删除</a>
                <a
                  class="text-blue-400 hover:text-blue-500 hover:underline"
                  href="javascript:void(0);"
                  v-show="canRestoreResource"
                  v-else
                  @click.prevent="restore(item.id)"
                >恢复</a>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="mt-2 flex items-center justify-center">
          <pagination :data="data" @pagination-change-page="createRequest">
            <span slot="prev-nav">上一页</span>
            <span slot="next-nav">下一页</span>
          </pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Form from "form-backend-validation";
import Pagination from "./commons/Pagination.vue";

export default {
  components: {
    Pagination
  },
  props: {
    action: {
      type: String,
      required: true
    },
    statusList: {
      type: Array | Object,
      required: true
    },
    selectClass: {
      type: String,
      default: ""
    },
    canRestoreResource: {
      type: Boolean,
      default: false
    },
    canDestroyResource: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      data: {},
      form: new Form({
        email: "",
        code: 0,
        page: 1,
        trashed: ""
      }).withOptions({ resetOnSuccess: false }),

      trashedList: [
        { value: "", label: "—" },
        { value: "with", label: "包含已删除" },
        { value: "only", label: "只有已删除的" }
      ]
    };
  },

  beforeMount() {
    this.createRequest();
  },

  methods: {
    async createRequest(page = 1) {
      try {
        this.form.page = page;

        let response = await this.form.post(this.action);
        this.data = response;
        // console.log(response);
      } catch (e) {
        console.log(e);
      }
    },

    filterCodeHandle() {
      this.createRequest(this.page);
    },

    filterTrashedHandle() {
      this.createRequest();
    },

    destroy(id) {
      this.$swal({
        type: "question",
        html: "确认执行删除操作吗？",
        toast: false,
        showConfirmButton: true,
        confirmButtonText: "是"
      }).then(result => {
        if (result.value) {
          this.destroyHandle(id);
        }
      });
    },

    destroyHandle(id) {
      axios
        .delete(`${this.action}/${id}`)
        .then(data => {
          this.createRequest();
          this.$swal({
            type: "success",
            title: "删除成功",
            toast: true,
            showConfirmButton: false,
            timer: 5000
          });
        })
        .then(e => {
          this.$swal({
            type: "error",
            title: e.response.error,
            toast: true,
            showConfirmButton: false,
            timer: 5000
          });
        });
    },

    restore(id) {
      axios
        .put(`${this.action}/${id}`)
        .then(data => {
          this.createRequest();
          this.$swal({
            type: "success",
            title: "恢复成功",
            toast: true,
            showConfirmButton: false,
            timer: 5000
          });
        })
        .then(e => {
          this.$swal({
            type: "error",
            title: e.response.error,
            toast: true,
            showConfirmButton: false,
            timer: 5000
          });
        });
    }
  }
};
</script>
