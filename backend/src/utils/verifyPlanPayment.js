const User = require('../models/User');
const Project = require('../models/Project');
const { Op, Sequelize } = require('sequelize');

async function verifyPlanPayment () {
    let today = new Date();
    today = today.toISOString().split('T')[0];

    await Project.update(
        { project_premium: 0 }, 
        {
            where: {
                id_project_creator: {
                    [Op.in]: Sequelize.literal(`(SELECT id FROM User WHERE end_plan_premium < '${today}')`) 
                },
                project_premium: 1,
            },
        }
    );
    
    await User.update(
        { premium_user: 0, type_premium: null, end_plan_premium: null },
        {
            where: {
                end_plan_premium: {
                    [Op.lt]: today 
                }
            },
        }
    );
}


module.exports = { verifyPlanPayment };