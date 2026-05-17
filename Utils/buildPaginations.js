const buildPagination=(query)=>{
                const page= +query.page || 1;
                const limit= +query.limit || 10;
                const skip= (page-1)*limit;
                 return {limit,skip,page};
};

module.exports=buildPagination;