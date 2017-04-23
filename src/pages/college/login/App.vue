<template>
<el-row :gutter="24">
  <el-col :span="8"><label></label></el-col>
  <el-col :span="8"><el-tabs type="border-card">
      <el-tab-pane label="登陆">
          <el-form ref="form" :model="login" label-width="80px">
              <el-form-item label="用户名">
                  <el-input v-model="login.username"></el-input>
              </el-form-item>
              <el-form-item label="密码">
                  <el-input v-model="login.password"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="onLogin">登陆</el-button>
              </el-form-item>
          </el-form>
      </el-tab-pane>
      <el-tab-pane label="注册">
          <el-form ref="form" :model="form" label-width="80px">

              <el-form-item label="学院名">
                  <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="组织机构代码">
                  <el-input v-model="form.code"></el-input>
              </el-form-item>
              <el-form-item label="管理人姓名">
                  <el-input v-model="form.user"></el-input>
              </el-form-item>
              <el-form-item label="身份证号">
                  <el-input v-model="form.id_num"></el-input>
              </el-form-item>
              <el-form-item label="手机号">
                  <el-input v-model="form.phone"></el-input>
              </el-form-item>
              <el-form-item label="QQ">
                  <el-input v-model="form.qq"></el-input>
              </el-form-item>
              <el-form-item label="email">
                  <el-input v-model="form.email"></el-input>
              </el-form-item>

              <el-input v-show="" v-model="form.fileList"></el-input>

              <el-upload :action="uploadFileUrl" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-success="successUpload" :on-remove="handleRemove" id="upload_image">
                  <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog v-model="dialogVisible" size="tiny">
                  <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
              <el-form-item>
                  <el-button type="primary" @click="onRegister">注册</el-button>
              </el-form-item>
          </el-form>
      </el-tab-pane>
  </el-tabs>
</el-col>
  <el-col :span="8"></el-col>
</el-row>
</template>

<script>
export default {
    methods: {
        onLogin() {
            window.location.href = "/college/indexPage";
        },
        onRegister() {
            if (!this.form._csrf) {
                alert('没有修改数据！');
            }
            let that = this;
            axios({
                method: 'post',
                url: API_PATH + "/college",
                data: this.form
            }).then(function(response) {
                if (response.status !== 200) {
                    console.log("存在一个问题，状态码为：" + response.status);
                    return;
                }
                alert('注册成功');
                history.go(0);
            });
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        successUpload(response, file, fileList) {
            console.log(response, file, fileList);
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
            login: {},
            _csrf: '',
            dialogImageUrl: '',
            dialogVisible: false,
            fileList: []
        }
    },
    created: function() {
        this._csrf = document.getElementById('csrf').value;
        this.form._csrf = this._csrf;
        this.login._csrf = this._csrf;
        this.uploadFileUrl = '/college/upload?_csrf=' + this._csrf;
    }
}
</script>

<style>
body {
    font-family: Helvetica, sans-serif;
}
</style>
