const Customer=require("../Models/customer");
const Loan=require("../Models/loan");
const Savings=require("../Models/savings");
const buildSort=require("../Utils/buildSort");
const buildPagination=require("../Utils/buildPaginations");
const customer = require("../Models/customer");
const Transaction=require("../Models/transactions")

exports.getSavings=async(id,query)=>{
     const sortoption=buildSort(query);
           const{limit,skip,page}=buildPagination(query);
     const fixedSavingsFind=await Savings.find({customer:id,accountType:"fixed"}).select("accountNumber balance interestRate  maturityDate isActive").sort(sortoption).skip(skip).limit(limit);
     if(!fixedSavingsFind){
        throw new Error("No fixed savings accounts found");
     }
     const count=await Savings.countDocuments({customer:id,accountType:"fixed"});
                     if(count > 0 && skip >= count){
                        throw new Error("page not found");
                     }
     const regularSavingFound=await Savings.find({customer:id,accountType:"regular"}).select("accountNumber balance interestRate isActive");
     if(!regularSavingFound){
        throw new Error("No regular saving account found");
     }
     return({
        regularSavingFound,
        "total":count,
        "page":page,
        "limit":limit,
        "data":fixedSavingsFind
     });
};
const buildFilter = (query) => {
  const filter = {};

  if (query.transactionType !== undefined) {
    filter.transactionType = query.transactionType;
  }

  if (query.fromDate !== undefined || query.toDate !== undefined) {
    filter.transactionDate = {};
  }

  if (query.fromDate !== undefined) {
    filter.transactionDate.$gte = new Date(query.fromDate);
  }

  if (query.toDate !== undefined) {
    const toDate = new Date(query.toDate);
    toDate.setHours(23, 59, 59, 999);

    filter.transactionDate.$lte = toDate;
  }

  if (query.search && query.search.trim() !== "") {
    filter.$or = [
      {
        transactionNumber: {
          $regex: query.search,
          $options: "i"
        }
      },
      {
        description: {
          $regex: query.search,
          $options: "i"
        }
      }
    ];
  }

  return filter;
};
exports.transactions=async(id,query)=>{
      const filter=buildFilter(query);
      const sortoption=buildSort(query);
      const{limit,skip,page}=buildPagination(query);
         const count=await Transaction.countDocuments({Customer:id,...filter});
                      if(count > 0 && skip >= count){
                         throw new Error("page not found");
                      }
            const transactions=await  Transaction.find({Customer:id,...filter}).sort(sortoption).skip(skip).limit(limit);
             
            return({
                 "total":count,
                 "page":page,
                 "limit":limit,
                 "data":transactions
             });
};
