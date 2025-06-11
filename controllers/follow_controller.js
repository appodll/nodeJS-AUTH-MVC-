const FollowModel = require('../models/FollowModels/follow_model.js');
const NotificationModel = require('../models/NotificationModels/notification_model.js');
const { getTokenInfo } = require("../utils/helpers.js");

const follow_unfollow = async (req, res) => {
    const { token, followed_id } = req.body;
    const tokenValue = getTokenInfo(token);
    const exisitingFollow = await FollowModel.findOne({
        where: {
            follower_id: tokenValue.user_id,
            followed_id: followed_id
        }
    })
    if (!exisitingFollow) {
        await FollowModel.create({
            follower_id: tokenValue.user_id,
            followed_id: followed_id
        })
        await NotificationModel.create({
            receive_id: followed_id,
            sender_id: tokenValue.user_id,
            status: "pending",
            title: "Dostluq istəyi",
            content: `${tokenValue.username} sizə dost istəyi göndərdi`
        })
    } else {
        await FollowModel.destroy({
            where: {
                follower_id: tokenValue.user_id,
                followed_id: followed_id
            }
        })
        await NotificationModel.create({
            receive_id: followed_id,
            sender_id: tokenValue.user_id,
            status: "pending",
            title: "Dostluq istəyi",
            content: `${tokenValue.username} sizi dostluq listindən sildi`
        })
    }
    res.status(200).send({
        "status": "success",
        "message": "Takip edildi"
    })
}

module.exports = { follow_unfollow }