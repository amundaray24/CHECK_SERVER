const validateHolidays = (holidays) => {
  return new Promise((resolve,reject)=>{
    let holidayDate;
    if (
        holidays.split(',').some(date => {
        const today =  new Date().toISOString().split('T')[0];
        if (date === today) {
          holidayDate = date;
          return true;
        };
      })
    ) reject(holidayDate)
    resolve();
  });
}

module.exports = {
  validateHolidays
}