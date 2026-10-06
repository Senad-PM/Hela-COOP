const activity=require("../Models/activity");
const buildSort=require("../Utils/buildSort");
const buildPagination=require("../Utils/buildPaginations");



const buildFilter=(query)=>{
    const filter={};
    if(query.action!==undefined){
        filter.action=query.action;
    }
    if(query.entityType!==undefined){
        filter.entityType=query.entityType;
    }
    if(query.search && query.search.trim() !==""){
          filter.$or = [
        {
            description: {
                $regex: query.search,
                $options: "i"
            }
        }, 
    ];
    }
    return filter;
};

exports.getactivities=async(query)=>{
    const filter=buildFilter(query);
    const sortoption=buildSort(query);
    const{limit,skip,page}=buildPagination(query);
    const count=await activity.countDocuments(filter);
        if(count > 0 && skip >= count){
            throw new Error("page not found");
        }
    const actvities = await activity.find(filter)
        .populate("performedBy", "userName role")
        .sort(Object.keys(sortoption || {}).length ? sortoption : { createdAt: -1 })
        .skip(skip)
        .limit(limit);
        
    return({
        "total":count,
        "page":page,
        "limit":limit,
        "data":actvities
    });
};

exports.getActivityById=async(id)=>{
    if(!id){
        throw new Error("activity id not found");
    }
    const activityExisit = await activity.findById(id);
    if(!activityExisit){
        throw new Error(" ID is incorrect & activity doesnt exist");
    }
    return(activityExisit);

}