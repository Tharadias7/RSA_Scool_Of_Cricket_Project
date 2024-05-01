const { Staff } = require("../models");
const { Op } = require("sequelize");

async function getNextEmployeeNo(designation) {
    const staffs = await Staff.findAll({
      where: { designation },
      order: [['employee_no', 'DESC']],
      limit: 1,
    });

    let nextNo = 1;
    if (staffs.length > 0) {
      const lastNo = parseInt(staffs[0].employee_no.substring(1));
      const existingStaff = await Staff.findOne({
        where: {
          designation,
          employee_no: {
            [Op.like]: `${designation.substring(0, 1)}%`
          }
        },
        order: [['employee_no', 'DESC']],
        limit: 1,
      });
      if (existingStaff && parseInt(existingStaff.employee_no.substring(1)) >= lastNo) {
        nextNo = parseInt(existingStaff.employee_no.substring(1)) + 1;
      } else {
        nextNo = lastNo + 1;
      }
    }

    const prefix = designation.substring(0, 1).toUpperCase();
    const formattedNo = nextNo.toString().padStart(2, '0');
    return prefix + formattedNo;
  }

module.exports = { getNextEmployeeNo };