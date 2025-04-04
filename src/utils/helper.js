import crypto from 'crypto';
function fail(res, msg) {
    return res.status(200).send({ status: 0, message: msg, data: null });
}

function success(res, msg, data) {
    return res.status(200).send({ status: 1, message: msg, data: data });
}

function md5Hash(data) {
    return crypto.createHash('md5').update(data).digest('hex');
}

export {
    fail,
    success,
    md5Hash
};
