import Seller from '../../models/SellerModel.js';
import { signInToken } from '../../utils/auth.js';
import { fail, generateOTP, md5Hash, sendEmail, success } from '../../utils/helper.js';

const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return fail(res, "Email and password are required.");
        }

        let findSeller = await Seller.findOne({ email });
        if (!findSeller) {
            return fail(res, "Seller not found.");
        }

        if (findSeller.isDeactive) {
            return fail(res, "Account is deactivated. Please contact support.");
        }

        const hashedPassword = md5Hash(password);
        if (findSeller.password !== hashedPassword) {
            return fail(res, "Invalid email or password.");
        }

        let token = signInToken(findSeller._id);

        const data = findSeller.toObject();
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

const sellerSignUp = async (req, res) => {
    try {
        const { name, email, password, phone, address, image, shopName } = req.body;

        if (!email || !password || !name) {
            return fail(res, "Email and password are required.");
        }

        const existingSeller = await Seller.findOne({ email });
        if (existingSeller) {
            return fail(res, "Email is already registered.");
        }

        const hashedPassword = md5Hash(password);

        let newSeller = await Seller.create({
            name: name,
            email: email,
            password: hashedPassword,
            phone: phone,
            address: address,
            image: image,
            shopName: shopName
        });

        if (newSeller) {
            let token = signInToken(newSeller._id);

            const data = newSeller.toObject();
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

const updateSellerProfile = async (req, res) => {
    try {
        const sellerId = req.userId;
        const { name, email, password, image, address, phone, shopName } = req.body;

        const seller = await Seller.findById(sellerId);
        if (!seller) {
            return fail(res, "Seller not found.");
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = md5Hash(password);
        if (phone) user.phone = phone;
        if (address) user.address = address;
        if (image) user.image = image;
        if (shopName) user.shopName = shopName;

        await seller.save();

        return success(res, "Profile updated successfully.", {
            seller: {
                _id: seller._id,
                name: seller.name,
                email: seller.email,
                phone: seller.phone,
                address: seller.address,
                image: seller.image,
                shopName: seller.shopName
            }
        });

    } catch (err) {
        console.error(err);
        return fail(res, "Something went wrong.");
    }
};

const deleteSellerProfile = async (req, res) => {
    try {
        const sellerId = req.userId;

        const seller = await Seller.findById(sellerId);
        if (!seller) {
            return fail(res, "Seller not found.");
        }

        await Seller.findByIdAndDelete(sellerId);

        return success(res, "Seller deleted successfully", seller);
    } catch (error) {
        return fail(res, error.message);
    }
};

const getSellerProfile = async (req, res) => {
    try {
        const sellerId = req.userId;

        const seller = await Seller.findById(sellerId).select("-password -__v -updatedAt");
        if (!seller) {
            return fail(res, "Seller not found.");
        }

        return success(res, "Seller profile fetched successfully", seller);
    } catch (error) {
        return fail(res, error.message);
    }
};

const changeSellerPassword = async (req, res) => {
    try {
        const sellerId = req.userId;
        if (!sellerId) return fail(res, "Seller not found.");

        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return fail(res, "All password fields are required.");
        }

        if (newPassword !== confirmPassword) {
            return fail(res, "New password and confirm password do not match.");
        }

        if (currentPassword === newPassword) {
            return fail(res, "New password cannot be the same as current password.");
        }

        const seller = await Seller.findById(sellerId);
        if (!seller) {
            return fail(res, "Seller not found.");
        }


        const hashedCurrentPassword = md5Hash(currentPassword);
        if (seller.password !== hashedCurrentPassword) {
            return fail(res, "Current password is incorrect.");
        }

        seller.password = md5Hash(newPassword);
        await seller.save();

        return success(res, "Password changed successfully.");
    } catch (error) {
        return fail(res, error.message);
    }
};

const sellerSendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return fail(res, "Email is required");
        }

        const otp = generateOTP();

        const seller = await Seller.findOne({ email });
        if (!seller) {
            return fail(res, "This email is not registered.");
        }

        seller.otp = otp;
        seller.otpExpiresAt = Date.now() + 10 * 60 * 1000;
        await seller.save();

        await sendEmail(email, otp);

        return success(res, "OTP has been sent to your email address.");
    } catch (error) {
        return fail(res, error.message);
    }
}

const sellerEmailVerify = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return fail(res, "Email and OTP are required.");
        }

        const seller = await Seller.findOne({ email });
        if (!seller) {
            return fail(res, "Seller not found.");
        }

        if (seller.otp !== otp) {
            return fail(res, "Invalid OTP.");
        }

        if (seller.otpExpiresAt < Date.now()) {
            return fail(res, "OTP has expired.");
        }

        seller.otp = undefined;
        seller.isVerified = true;
        await seller.save();

        return success(res, "Email verified successfully!");
    }
    catch (error) {
        return fail(res, error.message);
    }
}

const sellerResetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;
        if (!email || !newPassword || !confirmPassword) {
            return fail(res, "All fields are required.");
        }

        if (newPassword !== confirmPassword) {
            return fail(res, "New password and confirm password do not match.");
        }

        const seller = await Seller.findOne({ email });
        if (!seller) {
            return fail(res, "Seller not found.");
        }

        seller.password = md5Hash(newPassword);
        await seller.save();

        return success(res, "Password reset successfully!");
    } catch (error) {
        return fail(res, error.message);
    }
};

export {
    sellerLogin,
    sellerSignUp,
    updateSellerProfile,
    deleteSellerProfile,
    getSellerProfile,
    changeSellerPassword,
    sellerSendOtp,
    sellerEmailVerify,
    sellerResetPassword
};