const Room = require('../models/rooms');
const Message = require('../models/messages');


exports.createRoom = async (req, res) => {
    listUsers = req.body;
    let room = new Room({
        name : listUsers[0] + "&&" + listUsers[1],
        users : listUsers,
    })

    const roomExists = await Room.findOne({$or: [
        {name: listUsers[0] + "&&" + listUsers[1]},
        {name : listUsers[1] + "&&" + listUsers[0]}
        ]
    });
    if (roomExists)
        return res.status(403).json({
            error: 'Room is already existed!'
        });
    else
    {
        await room.save((err,result) => {
            if(err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
    }


    // res.status(200).json({ message: 'Signup success! Please login.' });
    //res.status(200).json(listUsers);
};

