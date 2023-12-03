const userModel = require("../../../DB/model/User")
const bcrypt = require("bcryptjs")

const displayProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id)
        res.status(200).json({ message: "Done", user })
    } catch (error) {
        res.status(500).json({ message: "catch error", error })
    }

}

const updateProfilePic = async (req, res) => {
    try {
        if (req.fileValidation) {
            res.json({ message: "in-valid file format" })
        } else {
            const olduser = await userModel.findById(req.user._id);
            const oldImg = olduser.profilePic;

            if (oldImg) {
                await fs.unlinkSync(oldImg);

            };

            const imageUrl = `${req.destinationFile}/${req.file.filename}`
            const user = await userModel.findOneAndUpdate({ _id: req.user._id }, { profilePic: imageUrl }, { new: true })
            res.status(200).json({ message: "Done", user })



        }
    } catch (error) {
        res.json({ message: 'err', error })
    }
};


const updateProfileCoverPic = async (req, res) => {
    try {
        if (req.fileValidation) {
            res.json({ message: "in-valid file format" })
        } else {
            const imageUrls = []
            for (let i = 0; i < req.files.length; i++) {
                imageUrls.push(`${req.destinationFile}/${req.files[i].filename}`)
            }
            const user = await userModel.findOneAndUpdate({ _id: req.user._id }, { coverPic: imageUrls }, { new: true })
            res.json({ message: "Done", user })
        }
    } catch (error) {
        res.status(500).json({ message: 'err', error })
    }
};

const DeactivateUser = async (req, res) => {
    try {
        const user = await userModel.findOneAndUpdate({ _id: req.user._id }, { Deactivate: true });
        if (!user) {
            res.status(403).json({ message: 'in valid usre' })
        } else {
            res.status(200).json({ message: "Done", user })
        }

    } catch (error) {
        res.status(500).json({ message: "catch error", error })
    }
};
const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await userModel.findById(req.user._id)
        if (oldPassword == newPassword) {
            res.status(400).json({ message: "new password cannot equal old password" })
        } else {
            const match = await bcrypt.compare(oldPassword, user.password)
            if (!match) {
                res.status(400).json({ message: "in-valid old password" })
            } else {
                const hashedPassword = await bcrypt.hash(newPassword,
                    parseInt(process.env.saltRound))
                await userModel.findByIdAndUpdate(user._id, { password: hashedPassword })
                res.status(200).json({ message: "Done" })
            }

        }
    } catch (error) {
        res.status(500).json({ message: "catch error", error })
    }
}

const allUser = async (req, res) => {
    try {
        const users = await userModel.find({}).populate([
            {
                path: 'posts',
                match: { isDeleted: false },
                populate: [
                    {
                        path: 'text'
                    },
                    {
                        path: 'image'
                    },
                    {
                        path: 'createdBy',
                        select: 'userName email'
                    },
                    {
                        path: 'likes',
                        select: 'userName email'
                    },
                    {
                        path: 'comments',
                        match: { isDeleted: false },
                        populate: [
                            {
                                path: 'createdBy',
                                select: 'userName email'
                            },
                            {
                                path: 'text'
                            },
                            {
                                path: 'likes',
                                select: 'userName email'
                            },
                            {
                                path: "replys",
                                populate: [
                                    { path: 'text' },
                                    {
                                        path: 'createdBy',
                                        select: 'userName email'
                                    },
                                    {
                                        path: 'replys',
                                        populate: [
                                            {
                                                path: 'createdBy',
                                                select: 'userName email'
                                            },
                                            {
                                                path: 'text'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]);

        if (!users) {
            res.status(404).json({ message: 'not found users' })
        } else {
            res.status(200).json({ message: 'all users', users })
        }
    } catch (error) {
        res.status(400).json({ message: 'err', error })
    }
}

module.exports = {
    displayProfile,
    updateProfilePic,
    updateProfileCoverPic,
    DeactivateUser,
    updatePassword,
    allUser
}