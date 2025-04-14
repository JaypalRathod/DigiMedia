import Messages from "../../models/message";
import { fail, success } from "../../utils/helper";

const getUnReceivedMsgs = async (req, res) => {
    try {
        const userId = req.userId;
        let { syncDate } = req.body

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        if (syncDate && syncDate.length > 0) {
            const query = { members: userId, updatedAt: { $gt: new Date(syncDate) } };
            let messages = await Messages.find(query).select({ __v: 0, updatedAt: 0 }).sort({ createdAt: -1 })
            return success(res, "Success", messages)
        }

    } catch (error) {
        console.log("error", error)
        return fail(res, error.message);
    }
}

export { getUnReceivedMsgs }