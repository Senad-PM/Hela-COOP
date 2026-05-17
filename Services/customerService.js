const { Query } = require("mongoose");
const Customer=require("../Models/customer");
const { countDocuments } = require("../Models/user");
const { update } = require("./userService");
const buildPagination=require("../Utils/buildPaginations");
const buildSort=require("../Utils/buildSort");

exports.createCustomer=async(customerData,user)=>{
    const{NIC,firstName,lastName,email,phoneNumber,occupation,city,address,postalCode,dateOfBirth}=customerData;
    if(!NIC || !firstName || !lastName || !email || !phoneNumber || !occupation || !city || !address || !postalCode || !dateOfBirth){
        throw new Error("all filed must be filled");
    }
    const findCustomer= await Customer.findOne({NIC});
    if(findCustomer){
        throw new Error("customer already exist");
    }
    const customerCount= await Customer.countDocuments();
    const nextCustomer=customerCount+1;
    const fomatNumber=nextCustomer.toString().padStart(4,"0");
    const customerNumber=`CUS-${fomatNumber}`;
    const newCustomer=await Customer.create({
        customerNumber:customerNumber,
        NIC,
        firstName,
        lastName,
        email,
        phoneNumber,
        occupation,
        city,
        address,
        postalCode,
        dateOfBirth,
        createdBy:user
    });
    return({
        customerNumber:newCustomer.customerNumber,
        NIC:newCustomer.NIC,
        firstName:newCustomer.firstName,
        lastName:newCustomer.lastName,
        email:newCustomer.email,
        phoneNumber:newCustomer.phoneNumber,
        occupation:newCustomer.occupation,
        city:newCustomer.city,
        address:newCustomer.address,
        postalCode:newCustomer.postalCode,
        dateOfBirth:newCustomer.dateOfBirth,
        createdBy:newCustomer.createdBy,
        createdAt:newCustomer.createdAt
    })

};
const buildFilter=(query)=>{
    const filter={};
    if(query.city!==undefined){
        filter.city=query.city;
    }
    if(query.occupation!==undefined){
        filter.occupation=query.occupation;
    }
    if(query.status!==undefined){
       filter.status=query.status==="true";
    }
    if(query.search && query.search.trim() !==""){
          filter.$or = [
        {
            firstName: {
                $regex: query.search,
                $options: "i"
            }
        }, 
        {
            lastName: {
                $regex: query.search,
                $options: "i"
            }
        },
        {
            email: {
                $regex: query.search,
                $options: "i"
            }
        },
        {
            NIC:{
                $regex:query.search,
                $options:"i"
            }
        },
        {
            customerNumber:{
                $regex:query.search
            }
        },
        {
            phoneNumber:{
                $regex:query.search,
                $options:"i"
            }
        }
    ];
    }
    return filter;
};

exports.getcustomer=async(query)=>{
     const filter=buildFilter(query);
     const sortoption=buildSort(query);
      // console.log(filter);
       const{limit,skip,page}=buildPagination(query);
       const count=await Customer.countDocuments(filter);
                 if(count > 0 && skip >= count){
                    throw new Error("page not found");
                 }
       const Customers=await  Customer.find(filter).sort(sortoption).skip(skip).limit(limit);
        
       return({
            "total":count,
            "page":page,
            "limit":limit,
            "data":Customers
        });
};
exports.getCustomerByCN=async(customerNumber)=>{
    const findCustomer=await Customer.findOne({customerNumber});
    if(!findCustomer){
        throw new Error("customer not found");
    }
    return(findCustomer);
};

