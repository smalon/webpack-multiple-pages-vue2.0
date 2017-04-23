<template>
<el-form ref="form" :model="form" label-width="80px">
  
  首页

</el-form>
</template>

<script>
export default {
    methods: {
        onRegister() {

          if(!this.form._csrf){
            alert('没有修改数据！');
          }
          let that = this;
          if(!this.form.id){
             axios({
              method: 'post',
              url: API_PATH+"/college",
              data: this.form
            }).then(function(response){
                if(response.status!==200){
                    console.log("存在一个问题，状态码为："+response.status);
                    return;
                }
                //检查响应文本
                if(response.data == '新增成功'){
                  that.tableData.push(that.form)
                  alert('新增成功');
                  that.getRows();
                }
            });
          }else{
            axios({
              method: 'put',
              url: API_PATH + '/college/' + this.form.id,
              data: this.form
            }).then(function(response){
                if(response.status!==200){
                    console.log("存在一个问题，状态码为："+response.status);
                    return;
                }
                //检查响应文本
                if(response.data.id){
                  alert('修改成功');
                  that.getRows();
                }
            });
          }
        },
        handleRemove(file, fileList) {
          console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
          this.dialogImageUrl = file.url;
          this.dialogVisible = true;
        },
        successUpload(response, file, fileList){
          console.log(response,file,fileList);
          var files = [];
          fileList.forEach(function(d) {
              files.push(d.response.id);
          });
          this.form.fileList = files;
        }
    },
    data() {
        return {
            form: {},
            _csrf: '',
            dialogImageUrl: '',
            dialogVisible: false,
            fileList: []
        }
    },
    created: function() {
      this._csrf  = document.getElementById('csrf').value;
      this.form._csrf  = this._csrf;
      this.uploadFileUrl  =  '/college/upload?_csrf='+this._csrf;
    }
}
</script>

<style>
body {
    font-family: Helvetica, sans-serif;
}
</style>
