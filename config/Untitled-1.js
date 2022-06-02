exports.uploadnse= async(params) =>{
  const con = await db.getConnection()
  try {
    // await params.excelData.forEach( async (param) => {
    //   let sql=  `insert INTO analytic (portfolio_id,name, weightage, symbol) VALUE ( ?, ?, ?, ? )`
    //   const result =  await con.query(sql,
    //      [param.portfolio_id,param.name,param.weightage,param.symbol])
              
    //   });
    //   await con.commit();
    await con.beginTransaction();
    await params.excelData.forEach( async (param, index) => {
      let sql=  `SELECT * from nse where symbol = ? and
      series = 'EQ' LIMIT 1`;
      const result =  await con.query(sql,[param.SYMBOL])  
     
      // let sql1 = `SELECT * FROM nse WHERE symbol = ? LIMIT 1`;
      // const result1 = await db.query(sql1,[param.symbol]) 
      console.log(result[0][0]);           
      const nse_id = result[0][0] != undefined ? result[0][0]['nse_id'] : null;
      //const bsymbol = result[0][4] != undefined ? result[0][4]['bsymbol'] : null;
      //const nse_id =  result1 != undefined ? result1[0][0]['nse_id'] : null;
     console.log('ansfasf',nse_id)
      // await con.beginTransaction();
     if( !nse_id ) {
      console.log('insert')
      let sql=  `insert INTO nse (close, prevclose, symbol,series) VALUE ( ?, ?, ?, ? )`
      console.log(sql)
      await con.query(sql,
        [param.CLOSE,param.PREVCLOSE,param.SYMBOL,param.SERIES])
      
     }
      else {
        console.log('updated')
        let sql=  `UPDATE nse SET close = ?  WHERE symbol = ?`
        
        await con.query(sql,
          [param.CLOSE,param.SYMBOL])

          console.log(sql)
      }
      await con.commit();               
    });
    return true;
  }
  catch ( err ) {
    await con.rollback();
    throw err;
  } finally {
    // con.close()
  }

}


exports.uploadnse= async(params) =>{
  // const con = await db.getConnection()
  try {
    // await con.beginTransaction();
    // await params.excelData.forEach( async (param) => {
    //   let sql=  `insert INTO analytic (portfolio_id,name, weightage, symbol) VALUE ( ?, ?, ?, ? )`
    //   const result =  await con.query(sql,
    //      [param.portfolio_id,param.name,param.weightage,param.symbol])
              
    //   });
    //   await con.commit();
    
    await params.excelData.forEach( async (param) => {
      let sql=  `SELECT * from nse where symbol = ? and
      series = 'EQ' LIMIT 1`;
      const result =  await db.query(sql,[param.SYMBOL])  
      
      // let sql1 = `SELECT * FROM nse WHERE symbol = ? LIMIT 1`;
      // const result1 = await db.query(sql1,[param.symbol]) 
      console.log(result[0][0]);           
      const nse_id = result[0][0] != undefined ? result[0][0]['nse_id'] : null;
      //const bsymbol = result[0][4] != undefined ? result[0][4]['bsymbol'] : null;
      //const nse_id =  result1 != undefined ? result1[0][0]['nse_id'] : null;
     console.log('ansfasf',nse_id)
      // await con.beginTransaction();
     if( !nse_id ) {
      console.log('insert')
      let sql=  `insert INTO nse (close, prevclose, symbol,series) VALUE ( ?, ?, ?, ? )`
      console.log(sql)
      await db.query(sql,
        [param.CLOSE,param.PREVCLOSE,param.SYMBOL,param.SERIES])

     }
      else {
        console.log('updated')
        let sql=  `UPDATE nse SET close = ?  WHERE symbol = ?`
        
        await db.query(sql,
          [param.CLOSE,param.SYMBOL])

          console.log(sql)
      }
      // await con.commit();               
    });
    return true;
  }
  catch ( err ) {
    // await con.rollback();
    throw err;
  } finally {
    // con.close()
  }

}