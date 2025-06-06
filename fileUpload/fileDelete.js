import cloudinary from 'cloudinary'

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_USER_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_USER_SECRET,
    secure: true,
});

export const deleteFile = async (imgURL) => {
    try {
        const urlArr = imgURL.split("/")
        const image = urlArr[urlArr.length - 1]
        const publicId = image.split(".")[0]

        const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }, (error, result) => {
            console.log(error, result)
        });
        return result
    } catch (error) {
        console.log('Upload error', error.message);
        console.log('Upload error', error);
        throw error;
    }
}