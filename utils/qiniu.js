export default class Qiniu {
  static config = {};

  static updateConfigWithOptions(options) {
    if (options.region) {
      this.config.qiniuRegion = options.region;
    }
    if (options.token) {
      this.config.qiniuUploadToken = options.token;
    } else if (options.uptokenURL) {
      this.config.qiniuUploadTokenURL = options.uptokenURL;
    }
  }

  static get url() {
    return this.uploadURLFromRegionCode(this.config.qiniuRegion);
  }


  // 正式上传的前置方法，做预处理，应用七牛云配置
  static async upload({
    options,
    filePath,
    progress,
    cancelTask
  }) {
    if (null == filePath) {
      console.error('qiniu uploader need filePath to upload');
      return;
    }

    if (options) {
      this.updateConfigWithOptions(options);
    }

    if (this.config.qiniuUploadToken) {
      return this.doUpload({
        options,
        filePath,
        progress,
        cancelTask
      });
    } else if (this.config.qiniuUploadTokenURL) {
      await this.getQiniuToken();
      return this.doUpload({
        options,
        filePath,
        progress,
        cancelTask
      });
    }
  }

  // 正式上传
  static async doUpload({
    options,
    filePath,
    progress,
    cancelTask
  }) {
    if (null == this.config.qiniuUploadToken && this.config.qiniuUploadToken.length > 0) {
      console.error('qiniu UploadToken is null, please check the init config or networking');
      return
    }
    let fileName = filePath.split('//')[1];
    if (options && options.key) {
      fileName = options.key;
    }
    let formData = {
      token: this.config.qiniuUploadToken,
      key: "grj/upload/" + fileName
    };
    return new Promise((resolve, reject) => {
      const uploadTask = wx.uploadFile({
        url: this.url,
        filePath: filePath,
        name: 'file',
        formData: formData,
        success: function (res) {
          let dataString = res.data
          // this if case is a compatibility with wechat server returned a charcode, but was fixed
          //   if(res.data.hasOwnProperty('type') && res.data.type === 'Buffer'){
          //     dataString = String.fromCharCode.apply(null, res.data.data)
          //   }
          try {
            let dataObject = JSON.parse(dataString);
            resolve(dataObject);
          } catch (e) {
            console.log('parse JSON failed, origin String is: ' + dataString)
            reject(e);
          }
        },
        fail: function (error) {
          console.error(error);
          reject(error);
        }
      });
      // 文件上传进度
      uploadTask.onProgressUpdate((res) => {
        progress && progress(res)
      })

      // 中断文件上传
      cancelTask && cancelTask(() => {
        uploadTask.abort()
      })
    })
  }

  static async getQiniuToken() {
    const [err, res] = await wx.$request({
      url: this.config.qiniuUploadTokenURL
    });
    if (!err) {
      let token = res.data;
      if (token && token.length > 0) {
        this.config.qiniuUploadToken = token;
        return token
      }
    } else {
      console.error('qiniuUploader cannot get your token, please check the uptokenURL or server')
      return err
    }
  }
  // 选择七牛云文件上传接口，文件向匹配的接口中传输。ECN, SCN, NCN, NA, ASG，分别对应七牛云的：华东，华南，华北，北美，新加坡 5 个区域
  static uploadURLFromRegionCode(code = 'ECN') {
    let uploadURL = null;
    switch (code) {
      case 'ECN':
        uploadURL = 'https://up.qbox.me';
        break;
      case 'NCN':
        uploadURL = 'https://up-z1.qiniup.com';
        break;
      case 'SCN':
        uploadURL = 'https://up-z2.qiniup.com';
        break;
      case 'NA':
        uploadURL = 'https://up-na0.qiniup.com';
        break;
      case 'ASG':
        uploadURL = 'https://up-as0.qiniup.com';
        break;
      default:
        console.error('please make the region is with one of [ECN, SCN, NCN, NA, ASG]');
    }

    return uploadURL;
  }
}