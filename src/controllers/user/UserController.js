import User from '../../models/UserModel.js';
import { signInToken } from '../../utils/auth.js';
import { fail, md5Hash, success } from '../../utils/helper.js';

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return fail(res, "Email and password are required.");
        }

        let findUser = await User.findOne({ email });
        if (!findUser) {
            return fail(res, "User not found.");
        }

        if (findUser.isDeactive) {
            return fail(res, "Account is deactivated. Please contact support.");
        }

        const hashedPassword = md5Hash(password);
        if (findUser.password !== hashedPassword) {
            return fail(res, "Invalid email or password.");
        }

        let token = signInToken(findUser._id);

        const data = findUser.toObject();
        data['isSignup'] = false;
        data['token'] = token;

        delete data.password;
        delete data.__v;
        delete data.updatedAt;

        return success(res, "Login Success", data);
    } catch (error) {
        return fail(res, error.message);
    }
};

const signUp = async (req, res) => {
    try {
        const { name, password, email, phone, address, image } = req.body;
        if (!name || !email || !password) {
            return fail(res, "Name, email, and password are required.");
        }

        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return fail(res, "Email already in use.");
        }

        const hashedPassword = await md5Hash(password);

        let newUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
            phone: phone,
            address: address,
            image: image,
        });
        if (newUser) {
            let token = signInToken(newUser._id);

            const data = newUser.toObject();
            data['isSignup'] = true;
            data['token'] = token;

            delete data.password;

            return success(res, "Signup Successfully", data);
        }

        return fail(res, "Something went wrong. Please try again.");
    }
    catch (error) {
        return fail(res, error.message);
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, email, password, image, address, phone } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return fail(res, "User not found.");
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = md5Hash(password);
        if (phone) user.phone = phone;
        if (address) user.address = address;
        if (image) user.image = image;

        await user.save();

        return success(res, "Profile updated successfully.", {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                image: user.image
            }
        });
    } catch (err) {
        console.error(err);
        return fail(res, "Something went wrong.");
    }
};

const deleteProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) {
            return fail(res, "User not found.");
        }

        await User.findByIdAndDelete(userId);

        return success(res, "user  deleted successfully", user);
    } catch (error) {
        return fail(res, error.message);
    }
};

export { login, signUp, updateProfile, deleteProfile };