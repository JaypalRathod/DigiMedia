import crypto from 'crypto';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

function fail(res, msg) {
    return res.status(200).send({ status: 0, message: msg, data: null });
}

function success(res, msg, data) {
    return res.status(200).send({ status: 1, message: msg, data: data });
}

function md5Hash(data) {
    return crypto.createHash('md5').update(data).digest('hex');
}

function generateOTP() {
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp.toString();
}

async function sendEmail(email, otp) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'creativejaypal@gmail.com',
            pass: 'xqlm fjon tfur rjcg'
        }
    });

    const mailOptions = {
        from: 'creativejaypal@gmail.com',
        to: email,
        subject: 'Your Digimedia Verification Code:',
        text: `Dear User,\n\n Your Otp ${otp} for Friendzy.`
    }

    await transporter.sendMail(mailOptions);
}


function lookup(
    from,
    local,
    foreign,
    as,
    project = null,
    customPipeline = null
) {
    let obj = {
        $lookup: {
            from: from,
            localField: local,
            foreignField: foreign,
            as: as,
        },
    };

    if (project) {
        obj.$lookup.pipeline = [{ $project: project }];
    }

    if (customPipeline) {
        obj.$lookup.pipeline = customPipeline;

        if (project) {
            obj.$lookup.pipeline.push({ $project: project });
        }
    }

    return obj;
}

function unwind(property, preserveNullAndEmptyArrays = true) {
    if (preserveNullAndEmptyArrays) {
        return {
            $unwind: {
                path: property,
                preserveNullAndEmptyArrays: true,
            },
        };
    } else {
        return {
            $unwind: property,
        };
    }
}

function match(conditions) {
    return { $match: conditions };
}

function project(fields) {
    return { $project: fields };
}

function projecter(fields, flag = true) {
    let projection = {};
    for (let field of fields) {
        projection[field] = flag ? 1 : 0;
    }

    for (let field of excludedFields) {
        projection[field] = 0;
    }

    return { $project: projection };
}


function addFields(fieldsToAdd) {
    if (typeof fieldsToAdd !== "object" || fieldsToAdd === null) {
        console.error("Parameter to addFields must be a non-null object");
        return;
    }

    return {
        $addFields: fieldsToAdd,
    };
}

function ObjectId(value) {
    return new mongoose.Types.ObjectId(value);
}

export {
    fail,
    success,
    md5Hash,
    generateOTP,
    sendEmail,
    lookup,
    unwind,
    match,
    project,
    projecter,
    addFields,
    ObjectId
};
