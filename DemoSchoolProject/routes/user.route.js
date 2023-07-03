const express = require('express');
const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken')
const VerifyUserWithToken = require ('../middleware/UserAuth')

const mongoose = require('mongoose');

const router = express.Router();

router.post('/createUser', async (req, res) => {

    try {
        let user = await UserModel.findOne({ _id: req.body.id });
        console.log(user, ">>>>>>>>>>>>>>>>>>>")
        if (user && user.role == 'Teacher') {
            const newCreate = new UserModel({
                fName: req.body.fName,
                lName: req.body.lName,
                email: req.body.email,
                role: req.body.role,
                password: req.body.password
            })
            const data = await newCreate.save();
            console.log(data, ".................")
            res.status(200).json(data)

        } else res.json({
            message: " Only a teacher can do this"
        })
    } catch (error) {
        console.log(error)
    }
})


router.post('/login', async (req, res) => {
    try {
        let userBibhu = await UserModel.findOne({ email: req.body.email });// only return one object
        // let loginPassword= await UserModel.findOne({password: req.body.password})
        console.log(userBibhu)
        if (userBibhu && userBibhu.password == req.body.password) {
            const payLoad={userBibhu}
            const token= jwt.sign(payLoad,process.env.TOKEN_SECRET)
            let newData = {
                fName: userBibhu.fName,
                lName: userBibhu.lName,
                email: userBibhu.email,
                role: userBibhu.role,
                id: userBibhu.id
            }
            const data ={token,newData}
            res.json(data)


        }
        else res.json({
            message: "invalid credentials"
        })
    } catch (error) {
        console.log(error)
    }
})

// router.post('/createIfTeacher',async (req,res)=>{
//     try{
//         let user= await UserModel.findOne({_id: req.body.id});
//         console.log(user,">>>>>>>>>>>>>>>>>>>")
//         if(user && user.role=='Teacher'){
//             let newData={
//                fname: user.fName
//             }
//             res.json(newData)
//         }else res.json({
//             message:" Only a teacher can do this"
//         })

//     }catch(error){
//         console.log(error)
//     }
// })

// A teacher can view all the daata but a a student can only view his/her data

router.post('/viewData',VerifyUserWithToken, async (req, res) => {
    try {
        let user = await UserModel.findOne({ _id: req.body.id })
        console.log(user)
        if (user && user.role == 'Teacher') {
            const data = await UserModel.find();
            res.json(data)
        }
        if (user && user.role == 'Student') {
            // const data = await UserModel.findById(user);
            res.json(user)
        }
    } catch (error) {
        console.log(error)
    }
})

router.delete('/deleteData',VerifyUserWithToken, async (req, res) => {
    try {
        let user = await UserModel.findOne({ _id: req.body.id })
        console.log(user)

        if (user && user.role == 'Teacher') {

            const dataId = await UserModel.findOne({ _id: req.body._id })
            console.log(dataId)
            const deleteId = await UserModel.findByIdAndDelete(dataId)
            res.json({ message: 'data deleted' })
        }
        console.log("user._id", req.body)
        if (user && user.role == 'Student' && user._id == req.body.id) {
            try {
                const data = await UserModel.findByIdAndDelete(user);
                res.json({ message: 'data deleted' })
            }
            catch (error) {
                console.log(error)
            }
        }
    } catch (error) { console.log(error) }
})

router.post('/upadteData',VerifyUserWithToken, async (req, res) => {
    try {
        let user = await UserModel.findOne({ _id: req.body.id })
        console.log(user)

        if (user && user.role == 'Teacher') {
                const id = await UserModel.findByIdAndUpdate({ _id: req.body._id })
                //console.log(id)
                const updateData = ({
                    fName: req.body.fName,
                    lName: req.body.lName,
                    email: req.body.email,
                    role: req.body.role,
                    password: req.body.password
                })
               

                const data = await UserModel.findByIdAndUpdate(id, updateData)
                res.json(data)
            } 
            if (user && user.role == 'Student' && user._id == req.body.id) {

                
                    const updateData = ({
                        fName: req.body.fName,
                        lName: req.body.lName,
                        email: req.body.email,
                        role: req.body.role,
                        password: req.body.password

                    })
                    const options = { new: true }

                    const result = await UserModel.findByIdAndUpdate(user, updateData, options)
                    res.json(result)
                
            
        }
    } catch (error) { console.log(error) }
})

module.exports = router