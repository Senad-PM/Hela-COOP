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
exports.getTransactionByTransaction=async(transactionNumber)=>{
    if(!transactionNumber){
        throw new Error("transactionNumber not found");
    }
    const transaction=await Transaction.findOne({transactionNumber}).populate("performedBy","userName role");
    if(!transaction){
        throw new Error("transaction not found");
    }
    return(transaction);
};
const buildFilter=(query)=>{
    const filter={};
    if(query.transactionType!== undefined){
        filter.transactionType=query.transactionType;
    }
    if(query.accountType!==undefined){
        filter.accountType=query.accountType;
    }
    return(filter);
};
exports.getTransactions=async(query)=>{
     const filter=buildFilter(query);
     const sortoption=buildSort(query);
              const{limit,skip,page}=buildPagination(query);
              const count=await Transaction.countDocuments(filter);
                        if(count > 0 && skip >= count){
                           throw new Error("page not found");
                        }
        const transactions=await  Transaction.find(filter).populate(
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