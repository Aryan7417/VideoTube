const asyncHandlert= (requestHander) => {
    (req , res ,next )=>{
        Promise.resolve().catch((err)=> next (err))



    }
}



export {asyncHandlert}


