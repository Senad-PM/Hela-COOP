const Transaction=require("../Models/transactions");
const buildPagination=require("../Utils/buildPaginations");
const buildSort=require("../Utils/buildSort");


exports.getTransactionsBySaving=async(accountNumber,query)=>{
    if(!accountNumber){
        throw new Error ("account number is required");
    }
    const sortoption=buildSort(query);
                  const{limit,skip,page}=buildPagination(query);
                  const count=await Transaction.countDocuments({accountNumber});
                            if(count > 0 && skip >= count){
                               throw new Error("page not found");
                            }
                  const transactions=await  Transaction.find({accountNumber}).populate(
                                         "performedBy",
                                         "userName role"
                                        ).sort(sortoption).skip(skip).limit(limit);
                    if(transactions===0){
                        throw new Error ("no transactions found");
                    }
                        return({
                   "total":count,
                   "page":page,
                   "limit":limit,
                   "data":transactions
               });
};