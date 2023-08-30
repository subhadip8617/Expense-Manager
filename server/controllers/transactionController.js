const transactionModel = require('../models/transactionModel');
const moment = require('moment');

const getAllTransaction = async (req, res) => {
    try {
        const {userId, frequency, selectedDate, type} = req.body;
        // console.log(frequency, selectedDate)
        const transactions = await transactionModel.find({
            userId,
            ...(
                frequency === 'custom' ? {
                    date : {
                        $gte : selectedDate[0],
                        $lte : selectedDate[1]
                    }
                } : {
                    date : {
                        $gt : moment().subtract(Number(frequency), 'd').toDate()
                    }
                }
            ),
            ...(type !== 'all' && {type})
        });
        res.status(200).send({
            success : true,
            transactions
        })
    } catch (error) {
        res.status(400).send({
            success : false,
            msg : error
        })
    }
}

const addTransaction = async (req, res) => {
    try {
        const newTransaction = new transactionModel(req.body);
        await newTransaction.save();
        res.status(200).send({
            success : true,
            msg : "New Transaction Created"
        })
    } catch (error) {
        res.status(400).send({
            success : false,
            msg : error
        })
    }
}

const editTransaction = async(req, res) => {
    try {
        await transactionModel.findByIdAndUpdate(req.body.transactionId, req.body)
        res.status(200).send({
            success : true,
            msg : "Transaction Updated Successfully"
        })
    } catch (error) {
        res.status(400).send({
            success : false,
            msg : error
        })
    }
}

const deleteTransaction = async(req, res) => {
    try {
        await transactionModel.findByIdAndDelete(req.body.transactionId)
        res.status(200).send({
            success : true,
            msg : "Transaction Deleted Successfully"
        })
    } catch (error) {
        res.status(400).send({
            success : false,
            msg : error
        })
    }
}

module.exports = {
    getAllTransaction,
    addTransaction,
    editTransaction,
    deleteTransaction
}