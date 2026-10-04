const mongoose=require("mongoose");

const settingsSchema=new mongoose.Schema({
    cooperativeName:{type:String,default:""},
    cooperativeCode:{type:String,default:""},
    fiscalYearStart:{type:String,default:"January"},
    defaultCurrency:{type:String,default:"LKR - Sri Lankan Rupee"},
    contactEmail:{type:String,default:""},
    contactPhone:{type:String,default:""},
    address:{type:String,default:""},
    dateFormat:{type:String,default:"mm/dd/yyyy"},
    defaultLanguage:{type:String,default:"English"},
    itemsPerPage:{type:String,default:"10"}
},{timestamps:true});

module.exports=mongoose.model("Settings",settingsSchema);