const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
},
email: {
    type:String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true
},
password: {
    type: String,
    required: true,
    minlength: 8
},
balance: {
    type: Number,
    default: 0
},
createAt: {
    type: Date,
    default: Date.now
}, 

transactions: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Transaction'
}]  
});

userSchema.statics.findByCredentials = async function (email, password) {
const user = await this.findOne({email});
if(!user) {
    throw new Error('Invalid login credentials');
}
if (user.password !== password) {
    throw new Error('Invalid login credentials');
}
return user;
}





const transasactionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['deposit', 'withdraw']
    }, 
    amount: {
        type: Number,
        required: true,
        min: 0
    }, 
    date: {
        type: Date,
        default: Date.now
    }
    });












const User = mongoose.model('User', userSchema);
const Transaction = mongoose.model('Transaction', transasactionSchema);

module.exports = { User, Transaction };