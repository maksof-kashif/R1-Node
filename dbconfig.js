const mongoose=require('mongoose')

// mongoose.connect('mongodb+srv://glume_proj:Abcd1234@cluster0.79ekf.mongodb.net/mernstack?retryWrites=true&w=majority').then(re=>{
mongoose.connect('mongodb+srv://testuser1:Ka$hif@testcluster1.rrc39.mongodb.net/taxi?retryWrites=true&w=majority').then(re=>{
    console.log("database connected")
}).catch(err=>{
    console.log(err)
});