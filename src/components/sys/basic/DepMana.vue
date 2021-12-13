<template>
  <div style="width: 500px">
    <el-input placeholder="请输入部门名称进行搜索..." prefix-icon="el-icon-search" v-model="filterText">
    </el-input>
    <!--:expand-on-click-node="false" 点击小三角箭头才会展开
    :default-expand-all="false"	设置默认不展开所有节点 -->
    <el-tree class="filter-tree" :data="deps" node-key="id" :props="defaultProps" :expand-on-click-node="false"
             default-expand-all
             :filter-node-method="filterNode"
             ref="tree">
      <span class="custom-tree-node" slot-scope="{ node, data }"
            style="display: flex;justify-content: space-between;width: 100%">
        <span>{{ data.name }}</span>
        <span>
          <el-button plain type="primary" size="mini" class="depBtn" @click="() => showAddDep(data)">
            添加部门
          </el-button>
          <el-button plain type="danger" size="mini" class="depBtn" @click="() => delDep(data)">
            删除部门
          </el-button>
        </span>
      </span>
    </el-tree>
    <!-- 13、对话弹框 -->
    <el-dialog title="添加部门" :visible.sync="dialogVisible" width="30%">
      <!-- 16 -->
      <div>
        <table>
          <tr>
            <td>
              <el-tag>上级部门</el-tag>
            </td>
            <td>{{ pname }}</td>
          </tr>
          <tr>
            <td>
              <el-tag>部门名称</el-tag>
            </td>
            <td>
              <el-input v-model="dep.name" placeholder="请输入部门名称..." size="small"></el-input>
            </td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddDep">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
let id = 1000;
export default {
  name: "DepMana",
  data() {
    return {
      filterText: '',
      deps: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dep: { // 15、添加部门数据象
        name: '',
        parentId: -1,
        isParent: ''
      },
      pname: '', // 15、上级部门名称
      dialogVisible: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.initDeps()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    initDeps() {
      this.getRequest('/system/basic/department/').then(resp => {
        if (resp) {
          this.deps = resp
        }
      })
    },
    // 11、17、添加部门弹框
    showAddDep(data) {
      // console.log(data)
      this.dep.parentId = data.id
      this.pname = data.name
      this.dialogVisible = true
    },
    doAddDep() {
      this.postRequest('/system/basic/department/', this.dep).then(resp => {
            if (resp) {
              console.log(resp)
              this.dialogVisible = false // 关闭对话框
              // this.addDep2Deps(this.deps, resp.data) // 23、【无效】手动插入部门 显示添加后的数据
              if (resp.code === 200) {
                this.addDep2Deps(this.deps, this.dep) // 21、调用初始化方法 清空数据
              }
              this.initDep()
            }
          }
      )
    },
    addDep2Deps(deps, dep) {
      for (let i = 0; i < deps.length; i++) {
        let d = deps[i] // 父部门
        //找到添加元素的parentId位置  将此元素挂载在下方
        if (d.id === dep.parentId) {
          d.children = d.children.concat(dep) // 把 dep 加为 d 的子部门
          if (d.children.length > 0) {
            d.isParent = true
          }
          return;
        } else {
          this.addDep2Deps(d.children, dep) // 递归调用此方法 以查询结果为条件 继续查询子部门
        }
      }
    },
    initDep() {
      //dep数据重置
      this.dep = {
        name: '',
        parentId: -1
      }
    },
    delDep(data) {
      if (data.isParent) {
        this.$message.error('父部门不能被删除！')
      } else {
        this.$confirm('此操作将永久删除该[' + data.name + ']部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest('/system/basic/department/' + data.id).then(resp => {
            if (resp) {
              this.removeDepFromDeps(null, this.deps, data.id)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    // 删除部门调用的方法
    removeDepFromDeps(p, deps, id) {
      for (let i = 0; i < deps.length; i++) {
        //遍历所有的deps
        let d = deps[i]
        //如果该id 与 指定的id相同 执行以下方法
        if (d.id === id) {
          deps.splice(i, 1)
          if (deps.length === 0) {
            p.isParent = false
          }
          return;
        } else {
          //不同 则递归遍历该节点的子节点信息
          this.removeDepFromDeps(d, d.children, id)
        }
      }
    }
  }
}
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

/* 8 */
.depBtn {
  padding: 2px;
}
</style>