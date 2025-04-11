import { fail, success } from "../../utils/helper.js";
import path from "path";
import fs from "fs";

const scpClient = await import('scp2');
const client = scpClient.default || scpClient;

const imageUpload = async (req, res) => {
    try {
        const files = req.files;
        if (!files) {
            return fail(res, "please upload image")
        }
        if (!files.length) {
            return fail(res, "please upload proper image")
        }

        const localPath = files[0].path;
        const fileName = path.basename(localPath);

        const remotePath = `/var/www/friendly_backend/uploads/${fileName}`;

        client.scp(localPath, {
            host: 'friendzy.world',
            username: 'your_ssh_user',
            password: 'your_password',
            path: remotePath,
        }, async (err) => {
            fs.unlinkSync(localPath);
            if (err) {
                console.error("SCP Upload error:", err);
                return fail(res, "Failed to upload image to server");
            }

            const imageUrl = `https://friendzy.world/friendly_backend/uploads/${fileName}`;
            return success(res, "Image uploaded successfully", imageUrl);
        });
    } catch (error) {
        return fail(res, error.message);
    }
}

export { imageUpload }