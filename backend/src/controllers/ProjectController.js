const Project = require('../models/Project');
const UserProject = require('../models/UserProject');

async function setProject(req, res){
    try{
        let project = {
            'name': req.body.name,
            'description': req.body.description,
            'initial_date': req.body.initial_date,
            'expected_end_date': req.body.expected_end_date,
            'status': req.body.status,
            'priority': req.body.priority,
        }
        const createdProject = await Project.create(project);
        
        if(createdProject){
            const createdUserProject = await UserProject.create({'id_project': createdProject.id, id_user: req.body.id_user, status: 1});
            if(createdUserProject){
                res.status(201).json({message:'Project created successfully !'});
            }else{
                res.status(422).json({message: 'Error attempting to link the user to the created project !'});
            }
        }else{
            res.status(400).json({message: 'Project data is not in the correct format !'});
        }

    }catch(error){
        res.status(500).json({ message: error.message });
    }
}


module.exports = { setProject };