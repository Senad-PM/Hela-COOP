const buildSort=(query)=>{
         let sortOption = { createdAt: -1 };
                if(query.sort && query.sort.trim()!== ""){
                    const[field,order]=query.sort.split("_");
                      sortOption = {
                     [field]: order === "desc" ? -1 : 1
                     };
                }
        return sortOption;
};

module.exports=buildSort;