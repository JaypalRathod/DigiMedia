import { sendPush } from "../controllers/notification/FcmController.js"
import Messages from "../models/message.js"

const insertMessage = async (obj) => {
    let msgObj = {
        id: obj._id,
        chatId: obj.chatId,
        msg: obj.text,
        type: obj.type,
        audioDuration: obj.audioDuration,
        image: obj.image,
        user: {
            _id: obj.user._id,
            name: obj.user.name,
            Image: obj.user.Image,
        },
        members: obj.members,
        receivers: obj.receivers,
        seenBy: obj.seenBy,
        date: obj.createdAt
    }
    let newMsg = await Messages.create(msgObj)
    let userIds = obj.members.filter(item => item !== obj.user._id)
    let notificationObj = {
        title: obj.user.name,
        body: obj.text,
        image: obj.user.Image,
        userIds: userIds,
        data: newMsg
    }
    await sendPush(notificationObj)
}


const updateReceivers = async (obj) => {
    obj.forEach(async element => {
        let res = await Messages.findOne({ id: element._id })
        if (res) {
            let updated = await Messages.findOneAndUpdate({ id: element._id }, { receivers: element.receivers }, { new: true })
        }
    })
}

const updateSeens = async (obj) => {
    obj.forEach(async element => {
        let res = await Messages.findOne({ id: element._id })
        if (res) {
            let updated = await Messages.findOneAndUpdate({ id: element._id }, { seenBy: element.seenBy }, { new: true })
            console.log("Seen updated : ", JSON.stringify(updated))
        }
    })
}

export { updateReceivers, updateSeens, insertMessage };