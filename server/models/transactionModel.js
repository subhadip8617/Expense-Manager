const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId : {
        type : String,
        required : [true, 'UserId is required']
    },
    amount : {
        type: Number,
        required: [true, 'Amount is required']
    },
    type : {
        type : String,
        required : [true, 'Type is required']
    },
    category : {
        type: String,
        required: [true, 'Catagory is required']
    },
    reference : {
        type: String,
    },
    description : {
        type: String,
        required : [true, 'Description is required']
    },
    date : {
        type: Date,
        required : [true, 'Date is required']
    }
}, {timestamps: true});

const transactionModel = mongoose.model('transactions', TransactionSchema);

module.exports = transactionModel;