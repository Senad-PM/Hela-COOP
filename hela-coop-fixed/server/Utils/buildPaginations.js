const MAX_LIMIT = 1000;

const buildPagination=(query)=>{
                const page= Math.max(1, Math.floor(+query.page) || 1);
                const limit= Math.min(MAX_LIMIT, Math.max(1, Math.floor(+query.limit) || 10));
                const skip= (page-1)*limit;
                 return {limit,skip,page};
};

module.exports=buildPagination;
