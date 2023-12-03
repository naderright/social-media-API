const userModel = require("../../../DB/model/User");
const sendEmail = require("../../../service/sendEmail");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        const { userName, password, email, age, gender } = req.body
        const newUser = new userModel({ userName, password, email, age, gender });
        const savedUser = await newUser.save();
        const token = jwt.sign({ id: savedUser._id }, process.env.emailTokenSecreat, { expiresIn: 5 * 60 })
        const URL = `${req.protocol}://${req.headers.host}/api/v1/auth/confirmEmail/${token}`
        const message = `<a href=${URL}> plz follow me to confirm u email</a>`
        await sendEmail(savedUser.email, message)
        res.status(201).json({ message: "Done" })
    } catch (err) {
        if (err.keyValue?.email) {
            res.status(409).json({ message: "email exist" })
        } else {
            res.status(500).json({ message: "catch error", err })
        }
    }

}


const confirmEmail = async (req, res) => {
    try {
        const token = req.params.token

        const decoded = jwt.verify(token, process.env.emailTokenSecreat);

        if (!decoded) {
            res.status(400).json({ message: "in-valid decoded token" })
        } else {
            const findUser = await userModel.findById({ _id: decoded.id }).select('confirmEmail')
            if (!findUser) {
                res.status(400).json({ message: "in-valid account" })
            } else {
                if (findUser.confirmEmail) {
                    res.status(400).json({ message: "account already confirmed plz login" })
                } else {
                    await userModel.findByIdAndUpdate({ _id: findUser._id },
                        { confirmEmail: true })
                   // res.status(200).json({ message: "confirmed succress plz login" })
                    //redirect html login page 
                    res.redirect('/redirect');
                }
            }

        }

    } catch (error) {
        res.status(500).json({ message: "catch err", error })

    }

}


const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        if(user.isBlooked  || user.Deactivate ||!user ){
            res.status(403).json({message : 'not valid user '})
        }else{
          
              //  console.log(!user.confirmEmail);
                if (!user.confirmEmail ) {
                    res.status(400).json({ message: "plz confirm u email first" })
                } else {
                    const match = await bcrypt.compare(password, user.password);
                    if (!match) {
                        res.status(404).json({ message: "in-valid account details" })
                    } else {
                        await userModel.findOneAndUpdate({email},{onLine:true},{new:true});
                        const token = jwt.sign({ id: user._id, isLoggedIn: true }, process.env.TokenSecreat, { expiresIn: '24h' })
                        res.status(200).json({ message: "login Success", token })
                    }
                }
    
            
        }
       
    } catch (error) {
        res.status(500).json({ message: "catch error", error })

    }

};


const logout = async(req,res)=>{
          const user = await userModel.findByIdAndUpdate(req.user._id,{onLine:false});
          if (!user) {
              res.status(400).json({message:"some thing wrong please again"});
          } else {
              const lastCine = new Date(Date.now());
              res.status(200).json({message:"done",lastCine})
          }
};

const sendCode = async (req, res) => {

    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        res.status(404).json({ message: "in-valid account" })
    } else {
        const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
        message = `<p> use this code to update u password  : ${code} </p>`
        await userModel.findByIdAndUpdate(user._id, { code })
        sendEmail(email, message)
        res.status(200).json({ message: "Done" })
    }
}


const forgetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "in-valid account" })
        } else {
            if (user.code.toString() != code.toString()) {
                res.status(409).json({ message: "wrong code" })
            } else {
                const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.saltRound))
                await userModel.findByIdAndUpdate(user._id, { password: hashedPassword, code: "" })
                res.status(200).json({ message: "Done plz go login" })
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'catch error ', error })

    }

}
module.exports = {
    signup,
    confirmEmail,
    login,
    logout,
    sendCode,
    forgetPassword
}