<template>
  <div>
    <el-button type="text" size="small" @click="editRow({})">新增</el-button>
    <el-dialog title="编辑窗口" v-model="dialogFormVisible">
    <el-form :model="form">
    <el-form-item label="姓名" :label-width="formLabelWidth">
      <el-input v-model="form.name" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" :label-width="formLabelWidth">
      <el-input v-model="form.password" auto-complete="off"></el-input>
    </el-form-item>
    <el-input type="hidden" v-model="form.id" auto-complete="off"></el-input>
    <el-input type="hidden" v-model="form._csrf"></el-input>
    </el-form>
    <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="updateRow">确 定</el-button>
    </div>
  </el-dialog>
  <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      fixed
      prop="id"
      label="id"
      width="150">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="120">
    </el-table-column>
    <el-table-column
      prop="password"
      label="密码"
      width="120">
    </el-table-column>
    
    <el-table-column
      label="操作"
      width="100">
      <template scope="scope">
        <el-button  @click.native.prevent="deleteRow(scope.$index, tableData, scope.row)" type="text" size="small" >移除 </el-button>
        <el-button type="text" size="small" @click="editRow(scope.row)">编辑</el-button>
      </template>
    </el-table-column>

  </el-table>
  <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[3, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
  </div>
</template>

<script>
 export default {
    methods: {
      addRow(rows){
        let that = this;
        this.form = {
          name: '',
          id: '',
          password: '',
        }
        
      },
      deleteRow(index, rows, row) {
        let that = this;
        axios({
          method: 'delete',
          url: API_PATH + '/' + row.id,
          data: this.form
        }).then(function(response){
            if(response.status!==200){
                console.log("存在一个问题，状态码为："+response.status);
                return;
            }
            //检查响应文本
            if(response.data == '删除成功'){
              that.dialogFormVisible = false;
              alert('删除成功');
              rows.splice(index, 1);
              that.getRows();
            }
        });

        

      },
      editRow(row){
        this.dialogFormVisible = true;
        this.form.id = row.id;
        this.form.name = row.name;
        this.form.password = row.password;

      },
      updateRow(){
        this.form._csrf  = document.getElementById('csrf').value;
        if(!this.form._csrf){
          alert('没有修改数据！');
        }
        let that = this;
        if(!this.form.id){
           axios({
            method: 'post',
            url: API_PATH,
            data: this.form
          }).then(function(response){
              if(response.status!==200){
                  console.log("存在一个问题，状态码为："+response.status);
                  return;
              }
              //检查响应文本
              if(response.data == '新增成功'){
                that.dialogFormVisible = false;
                that.tableData.push(that.form)
                alert('新增成功');
                that.getRows();
              }
          });
        }else{
          axios({
            method: 'put',
            url: API_PATH + '/' + this.form.id,
            data: this.form
          }).then(function(response){
              if(response.status!==200){
                  console.log("存在一个问题，状态码为："+response.status);
                  return;
              }
              //检查响应文本
              if(response.data.id){
                that.dialogFormVisible = false;
                alert('修改成功');
                that.getRows();
              }
          });
        }
        
        
        
      },
      handleSizeChange(size){
        this.pageSize = size;
        this.getRows();
      },
      handleCurrentChange(currentPage){
        this.currentPage = currentPage
        this.getRows();
      },
      getRows(){
        let start  = (this.currentPage-1) * this.pageSize;
        let that = this;
        fetch(API_PATH + "/?start="+ start + '&length=' + this.pageSize,{mode: "no-cors", header:{"Content-Type": "application/json"}}).then(function(response){
            if(response.status!==200){
                console.log("存在一个问题，状态码为："+response.status);
                return;
            }
            //检查响应文本
            response.json().then(function(data){
                that.tableData = data.tableData;
                that.total = data.total;
                that._csrf = data.csrfToken;
            });
        }).catch(function(err){
            console.log("Fetch错误:"+err);
        })   
      },
      querystring(json){
        let string = ''
        let index = 0;
        for(let i in json){
          if(index == 0){
            string += i + '=' + json[i];
          }else{
            string += '&' + i + '=' + json[i];
          }
          index++;
        }

        return string;
      }
    },

    data() {
      return {
        tableData: [],
        total: 30,
        currentPage: 1,
        pageSize:3,
        dialogFormVisible: false,
        form: {
          name: '',
          id: '',
          password: '',
        },
        formLabelWidth: '120px',
        _csrf:''
      }
    },
    created: function (){
      this.getRows();
    }
  }
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
</style>
