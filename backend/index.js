const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { User, Transaction } = require("./models/User.js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const cors = require('cors'); 
const admin = require('firebase-admin'); // Add this line

app.use(express.json());
app.use(cors()); 

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'bankingapplicationfireba-29135'
});

const secretKey = crypto.randomBytes(32).toString("hex")

const blacklistedTokens = new Set(); // Store blacklisted tokens


const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if(!token) {
    return res.status(401).send({error: "You're not authorized to access this resource"})
  }
  try {
  const decoded = jwt.verify(token, secretKey)
  req.user = decoded;
  next()
  } catch (error) {
  res.status(401).send({error: "Invalid token!"})
  } 
}



app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Create a new user
app.post("/api/users/create", async (req, res) => {
  try {
    const { name, email, password, balance } = req.body;
    console.log("escupe", req.body);
    const user = await User.create({ name, email, password, balance });
    res.status(201).send(user);
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err.message });
  }
});

// Login a user
app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    if (user) {
    const token = jwt.sign({_id: user._id.toString()}, secretKey)
    console.log("User logged in successfully");
    res.status(200).send({
      message: 'User logged in successfully',
      user, 
      token,  
    });
    } else {
    console.log("Invalid credentials");
    res.status(400).send({ error: 'Invalid credentials' });
    }

  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err.message });
  }
});

// Add Google login endpoint
app.post("/api/users/google-login", async (req, res) => {
  try {
    const { idToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name } = decodedToken;

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name,
        password: crypto.randomBytes(20).toString('hex'), // random password for Google users
        balance: 0
      });
    }

    const token = jwt.sign({_id: user._id.toString()}, secretKey);
    res.status(200).send({
      message: 'Google login successful',
      user,
      token
    });
  } catch (err) {
    console.error(err);
    res.status(400).send({ error: 'Google authentication failed' });
  }
});

//transaction

app.put('/api/user/transactions', authenticateToken ,  async (req, res) => {
    try {
       const { amount, type } = req.body;
       const userId = req.user._id;

       const user = await User.findById(userId);
         if(!user){
              throw new Error('User not found');
         }
         if(amount <= 0){
             throw new Error('Amount must be greater than 0');
         }
         if(type!=='deposit' && type!=='withdraw'){
             throw new Error('Invalid transaction type');
         }

         let newBalance;
            if(type === 'deposit'){
                newBalance = user.balance + amount;
            }else if(type === 'withdraw'){
                if(user.balance < amount){
                    throw new Error('Insufficient balance');
                }
                newBalance = user.balance - amount;
            } else {
                throw new Error('Invalid transaction type');
            }
          
            user.balance = newBalance;
            await user.save();

            const transaction = new Transaction({
                amount, 
                type, 
                date: new Date(),
                userId
            })

            await transaction.save();
            const populateUser = await User.findById(userId).populate(
              "transactions"
            );
            user.transactions.push(transaction._id); 
            await user.save();
            res.status(200).send({
            message: 'Transaction successful',
            user: populateUser,
            }
            );


    }catch(err){
        console.log(err);
        res.status(400).send({ error: err.message });
    }
});

// Add this new endpoint for token validation
app.get("/api/users/validate", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).send({ user });
  } catch (err) {
    console.log(err);
    res.status(401).send({ error: "Invalid token" });
  }
});

// Update the logout endpoint to handle token removal
app.post('/api/user/logout', authenticateToken, async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    blacklistedTokens.add(token);
    res.send({message: "User logged out successfully"});
  } catch (err) {
    console.log(err);
    res.status(400).send({error: err.message });
  }
})

// Get All Users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err.message });
  }
});

//Database Connection
mongoose
  .connect(
    "mongodb+srv://lucabrizuela02:maVHrSqoVbt0U1uc@bankingdb.1zfdj.mongodb.net/?retryWrites=true&w=majority&appName=Bankingdb"
  )
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => console.error("Could not connect to MongoDB Atlas", err));

 //hola Luca :)


 //store tokens in local storage and blacklist them after 24 hours / this has to be implemented in authenticateToken middleware setting req.user._id as a key in the blacklistedTokens set.

