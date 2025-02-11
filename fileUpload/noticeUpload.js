import cloudinary from 'cloudinary'

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_USER_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_USER_SECRET,
    secure: true,
});


const noticeUpload = async (file) => {
    try {
        const result = await cloudinary.v2.uploader.upload(file, {
            resource_type: 'auto'
        })
        return result
    } catch (error) {
        console.error('Error uploading PDF:', error);
    }
}

export default noticeUpload