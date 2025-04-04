import jwt from 'jsonwebtoken';

const signInToken = (userId) => {
    return jwt.sign(
        {
            userId
        },
        process.env.JWT_SECRET,
    );
};

const isAuth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) return res.status(401).send({
            message: 'Authorization required',
            status: 0,
            data: null,
        });

        const token = authorization?.split(' ')[1];
        if (!token) return res.status(401).send({
            message: 'Authorization token missing',
            status: 0,
            data: null,
        });
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId
        next();
    } catch (error) {
        console.log(error)
        return res.status(200).send({ status: 0, message: error.message, data: null });
    }
};

const authenticateUser = (token) => {
    try {
        if (!token) {
            return res.status(200).send({ status: 0, message: "token is required!" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.userId;
    } catch (error) {
        console.error("Authentication Error:", error);
        return null;
    }
};

export { signInToken, isAuth, authenticateUser };