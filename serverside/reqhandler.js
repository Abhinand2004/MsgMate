import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import userSchema from "./models/User.js";
import bcrypt from 'bcrypt';
import pkg from 'jsonwebtoken';
const { sign } = pkg;
import nodemailer from 'nodemailer'; 
import ChatBox from "./models/ChatBox.js";
import chatListSchema from './models/ChatList.js';  
import { waitForDebugger } from 'inspector';
const app = express();
const server = createServer(app);
const io = new Server(server);
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('message', (data) => {
        // Handle incoming message data
        console.log('Message received: ', data);
    });
});

// Export server if needed for starting the application
export default server;



export async function register(req, res) {
    console.log(req.body);
    const { username, phone, pwd, cpwd,image,email} = req.body
    const user = await userSchema.findOne({ email })
    if (!user) {
        if (!(username && email && pwd && cpwd))
            return res.status(500).send({ msg: "fields are empty" })
        if (pwd != cpwd)
            return res.status(500).send({ msg: "pass not match" })
        bcrypt.hash(pwd, 10).then((hpwd) => {
            userSchema.create({ username, email,phone, pass: hpwd ,image,about:null})
            res.status(200).send({ msg: "Successfull" })
        }).catch((error) => {
            console.log(error);
        })
    } else {
        res.status(200).send({ msg: "email already used " })
    }
}


const transporter = nodemailer.createTransport({
    service: "gmail",
    // host: "sandbox.smtp.mailtrap.io",
    // port: 2525,
    // secure: false, // true for port 465, false for other ports
    auth: {
        user: "abhinandc293@gmail.com",
        pass: "xfrk uoxu ipfs lhjj",
    },
});

export async function verifyEmail(req, res) {
    const { email } = req.body;
    console.log(email);
    
    if (!email) {
        return res.status(500).send({ msg: "fields are empty" });
    }

    try {
        const user = await userSchema.findOne({ email });

        if (!user) {
            const info = await transporter.sendMail({
                from: 'abhinandc293@gmail.com', 
                to: email, 
                subject: "Verify Your Email", 
                text: "VERIFY! your email", 
                html: `
                    <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 40px;">
                        <div style="background-color: #fff; border-radius: 8px; padding: 30px; max-width: 500px; margin: auto; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
                            <h1 style="color: #1d55cd;">Electro-Galaxy Email Verification</h1>
                            <p style="font-size: 16px; color: #555;">Hello ,</p>
                            <p style="font-size: 16px; color: #555;">Please verify your email address by clicking the button below:</p>
                            <a href="http://localhost:5173/changepass" 
                               style="display: inline-block; padding: 12px 25px; color: #fff; background-color: #1d55cd; text-decoration: none; font-size: 16px; border-radius: 5px; margin-top: 20px;">
                               Verify Email
                            </a>
                            <p style="font-size: 14px; color: #888; margin-top: 20px;">If you did not request this, please ignore this email.</p>
                        </div>
                    </div>
                `,
            });
            console.log("Message sent: %s", info.messageId);
            res.status(200).send({ msg: "Verification email sent" });
        } else {
            return res.status(500).send({ msg: "Email doesn't exist" });
        }
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send({ msg: "Error sending email" });
    }
}



export async function login(req, res) {
    // console.log(req.body);
    const { email, pass } = req.body
    if (!(email && pass))
        return res.status(500).send({ msg: "fields are empty" })
    const user = await userSchema.findOne({ email })
    if (!user)
        return res.status(500).send({ msg: "email donot exist" })
    const success = await bcrypt.compare(pass, user.pass)
    // console.log(success);
    if (success !== true)
        return res.status(500).send({ msg: "email or password not exist" })
    const token = await sign({ UserID: user._id }, process.env.JWT_KEY, { expiresIn: "24h" })
    // console.log(token);
    res.status(200).send({ token })
}



export async function verifyforpasschange(req, res) {
    const { email } = req.body;
    console.log(email);
    
    if (!email) {
        return res.status(500).send({ msg: "Fields are empty" });
    }

    try {
        const user = await userSchema.findOne({ email });

        if (user) {
            const info = await transporter.sendMail({
                from: 'support@msgmate.com', 
                to: email, 
                subject: "Password Change Request - MsgMate", 
                text: "Reset Your Password", 
                html: `
                    <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 40px;">
                        <div style="background-color: #fff; border-radius: 8px; padding: 30px; max-width: 500px; margin: auto; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
                            <h1 style="color: #1d55cd;">MsgMate Password Reset</h1>
                            <p style="font-size: 16px; color: #555;">Hello ${user.username},</p>
                            <p style="font-size: 16px; color: #555;">
                                We received a request to reset your password for your MsgMate account. Please click the button below to proceed with changing your password:
                            </p>
                            <a href="http://localhost:5173/passchange" 
                               style="display: inline-block; padding: 12px 25px; color: #fff; background-color: #1d55cd; text-decoration: none; font-size: 16px; border-radius: 5px; margin-top: 20px;">
                               Reset Password
                            </a>
                            <p style="font-size: 14px; color: #888; margin-top: 20px;">
                                If you did not request this change, please ignore this email or contact support.
                            </p>
                        </div>
                    </div>
                `,
            });
            console.log("Message sent: %s", info.messageId);
            res.status(200).send({ msg: "Password reset email sent" });
        } else {
            return res.status(500).send({ msg: "Email doesn't exist" });
        }
    } catch (error) {
        res.status(500).send({ msg: "Error sending email" });
    }
}



export async function passchange(req, res) {
    const { email, pwd, cpwd } = req.body; 
    if (!email || !pwd || !cpwd) {
        return res.status(400).send({ msg: "Email and both passwords are required" });
    }
    if (pwd !== cpwd) {
        return res.status(400).send({ msg: "Passwords do not match" });
    }

    try {
        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(404).send({ msg: "User not found" });
        }
        const hashedPassword = await bcrypt.hash(pwd, 10);
        const result = await userSchema.updateOne(
            { email: email },
            { $set: { pass: hashedPassword } }
        );
        if (result.modifiedCount === 0) {
            return res.status(500).send({ msg: "Password update failed" });
        }
        res.status(200).send({ msg: "Password updated successfully" });
    } catch (error) {
        res.status(500).send({ msg: "Something went wrong" });
    }
}


export async function showContacts(req, res) {
    try {
        const userId = req.user.UserID; // Get the authenticated user's ID

        // Fetch all contacts, but exclude the authenticated user's own data
        const contacts = await userSchema.find({ _id: { $ne: userId } });

        return res.status(200).send({ contacts });
    } catch (error) {
        return res.status(500).send({ error: "An error occurred while fetching contacts." });
    }
}


export async function message(req, res) {
    try {
        const { message } = req.body;
        const sender_id = req.user?.UserID;
        const { id } = req.params;
        const time = new Date().toISOString(); 
        if (!message || !sender_id || !id) {
            return res.status(400).send({  msg: "Missing required fields" });
        }

        const data = await ChatBox.create({ message, sender_id, receiver_id: id, time });

        if (data) {
            return res.status(200).send({ msg:"success"});
        } else {
            return res.status(500).send({ msg: "Failed to create message" });
        }
    } catch (error) {
        return res.status(500).send({ msg: "Internal Server Error" });
    }
}


export async function displaymessage(req, res) {
    try {
        const sender_id = req.user.UserID; 
        const { id } = req.params;  
        const messages = await ChatBox.find({ $or: [ { sender_id, receiver_id: id }, { sender_id: id, receiver_id: sender_id } ]
        }).sort({ time: 1 }); 
        // console.log(messages);
        
        if (!messages) {
            return res.status(404).send({ msg: "No messages found" });
        }

        return res.status(200).send({ messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).send({ msg: "Failed to fetch messages", error });
    }
}



export async function showuser(req, res) {
    const { id } = req.params;
    // Log the UserID from the JWT token for debugging purposes
    console.log(req.user.UserID);

    try {
        // Fetch the user from the database
        const user = await userSchema.findById(id);

        // If user not found, send a 404 response
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Send the user data along with 'my_id' (user's ID from the token) separately
        res.status(200).send({ user, my_id: req.user.UserID });

    } catch (error) {
        // Handle any server errors
        console.error(error);
        res.status(500).send({ message: 'Server error' });
    }
}


export async function navdata (req, res){
    console.log(req.user.UserID);
    
    const data = await userSchema.findById(req.user.UserID);

if (data) {
    return res.status(200).send({
       data
      });
      
    
}else{
    return res.status(500).send({msg:"error"})
}
  
};

export async function editprofile(req, res) {
    try {
      const { ...data } = req.body; 
      
      const update = await userSchema.updateOne(
        { _id: req.user.UserID }, 
        { $set: data } 
      );
  
      if (!update) {
        return res.status(400).send({ msg: 'No fields were updated.' });
      }
  
      res.status(200).send({ msg: 'Profile updated successfully!' });
  
    } catch (error) {
      res.status(500).send({ msg: 'An error occurred while updating the profile.' });
    }
  }

  export async function reciverdetails(req, res) {
    const { id } = req.params;

    try {
        const data = await userSchema.findById(id); 
        if (!data) {
            return res.status(404).send({ message: "User not found" }); 
        }
        return res.status(200).send(data);
    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error" });
    }
}




export async function seemsg(req, res) {
    try {
        const sender_id = req.user.UserID; // The user who is viewing the messages
        const { id: receiver_id } = req.params; // The other user in the chat

        const result = await ChatBox.updateMany(  { sender_id: receiver_id, receiver_id: sender_id, seen: { $ne: true } },{ $set: { seen: true } } );

        if (!result) {
            return res.status(404).send({ msg: "No unseen messages found" });
        }

        return res.status(200).send({ msg: "Messages marked as seen" });
    } catch (error) {
        console.error("Error marking messages as seen:", error);
        return res.status(500).send({ msg: "Failed to mark messages as seen", error });
    }
}


export async function createChatList(req, res) {
    try {
        const sender_id = req.user.UserID;
        const { id: receiver_id } = req.params;

        // Ensure sender and receiver IDs are not the same
        if (sender_id === receiver_id) {
            return res.status(400).send({ msg: "Sender and receiver cannot be the same user." });
        }

        // Check if chatList already exists
        const existingChatList = await chatListSchema.findOne({
            $or: [
                { sender_id: sender_id, receiver_id: receiver_id },
                { sender_id: receiver_id, receiver_id: sender_id }
            ]
        });

        if (existingChatList) {
            return res.status(400).send({ msg: "Chat list already exists between these users." });
        }

        const sender = await userSchema.findOne({ _id: sender_id });
        const receiver = await userSchema.findOne({ _id: receiver_id });

        if (!sender || !receiver) {
            return res.status(404).send({ msg: "Sender or receiver not found." });
        }

        // Create chatList
        const chatList = await chatListSchema.create({
            sender_id,
            receiver_id,
            background: null,
            sender: { username: sender.username, image: sender.image },
            receiver: { username: receiver.username, image: receiver.image },
            count:0
        });

        return res.status(200).send({ msg: "Chat list created successfully", chatList });
    } catch (error) {
        return res.status(500).send({ msg: "Internal server error." });
    }
}


export async function setcount(req, res) {
    try {
        const sender_id = req.user.UserID;
        const { id: receiver_id } = req.params;

        const unseenMessagesCount = await ChatBox.countDocuments({
            sender_id: receiver_id,
            receiver_id: sender_id, 
            seen: false,
        });
        console.log(unseenMessagesCount);
        
        const result = await chatListSchema.findOneAndUpdate(
            {
                $or: [
                    { sender_id: sender_id, receiver_id: receiver_id },
                    { sender_id: receiver_id, receiver_id: sender_id }  
                ]
            },
            { $set: { count: unseenMessagesCount } }
        );


        if (!result) {
            return res.status(404).send({ msg: "Chat list not found" });
        }

        return res.status(200).send({
            msg: "Unseen message count updated successfully",
            count: unseenMessagesCount,
        });
    } catch (error) {
        return res.status(500).send({ msg: "Failed to update unseen message count", error });
    }
}



export async function displayChatList(req, res) {
    try {
        const userId = req.user.UserID;
        const chatLists = await chatListSchema.find({ $or: [{ sender_id: userId },{ receiver_id: userId }  ]  });

        const chatListData = chatLists.map(chat => {
            if (chat.sender_id === userId) {
                return {
                    username: chat.receiver.username,
                    image: chat.receiver.image,
                    chatId: chat._id,
                    otherUserId: chat.receiver_id 
                };
            } else {
                return {
                    username: chat.sender.username,
                    image: chat.sender.image,
                    chatId: chat._id,
                    otherUserId: chat.sender_id 
                };
            }
        });

        return res.status(200).send(chatListData);
    } catch (error) {
        return res.status(500).send({ msg: "Internal server error." });
    }
}
