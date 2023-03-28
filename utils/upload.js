import qiniuUploader from './qiniu.js'
import {
    qiniuUptokenURL
} from './../config/config.js'
// token 优先使用，不传入则根据uptokenURL获取
export function qiniuUploadStart({
    region,
    token,
    uptokenURL = qiniuUptokenURL,
    tempFilePaths,
    progress
}) {
    const tasks = [];
    tempFilePaths.forEach((filePath, index) => {
        tasks.push(
            qiniuUploader.upload({
                filePath,
                options: {
                    region,
                    token,
                    uptokenURL
                },
                progress: (res) => progress && progress(index, res)
            })
        )
    })
    return Promise.all(tasks)
}