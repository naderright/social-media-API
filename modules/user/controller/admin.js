const userModel = require("../../../DB/model/User");
const sendEmail = require("../../../service/sendEmail");

const blockUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findByIdAndUpdate({ _id: id }, { isBlocked: true });
        if (!user) {
            res.status(404).json({ message: "not found user" });
        } else {
            res.status(200).json({ message: 'user is blocking now' })
        }
    } catch (error) {
        res.json({ message: 'err', error })
    }
};


const messagesAdmin = async (req, res) => {
    try {
        const usersId = [req.params.users].concat(req.params[0].split('/').slice(1));
        usersId.forEach(async (userId) => {
            const user = await userModel.findById(userId);
            if (!user) {
                res.status(404).json({ message: "not valid userr" })
            } else {
                await sendEmail(user.email, "I am happy for you");
                res.status(200).json({ message: "don message recived" })
            }
        })
    } catch (error) {
        res.json({ message: 'err', error })
    }
}





module.exports = {
    blockUser, messagesAdmin
}