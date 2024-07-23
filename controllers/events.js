const { response } = require("express");
// MODELS
const Link = require("../models/Link");
const User = require("../models/User");

// ADD A NEW LINK
const addNewLink = async ( req, res = response ) => {
    const { title, url } = req.body;
    const uid =  req.uid
    try {
        // Create new link
        const newLink = new Link({ title, url, user: uid });
        const linkCreated = await newLink.save();

        // Save link in user links
        const user = await User.findById(uid)
        user.links = [ linkCreated.id, ...user.links ]
        await user.save();

        return res.status(201).json({
            ok: true,
            linkCreated,
            msg: 'Link created succesfully!'
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            ok: false,
            msg: 'There is an error, talk with the admin'
        })
    }
}

// GET ALL THE LINKS BY USER ID
const getLinks = async (req, res = response) => {
    try {
        const uid = req.uid;
        const links = await Link.find({ user: uid });

        return res.json({
            ok: true,
            links,
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            ok:false,
            msg: 'There is an error, talk with the admin'
        })
    }
}

// EDIT A LINK BY ID PARAM
const editLink = async (req, res = response) => {
    const { linkId } =  req. params;
    const uid = req.uid
    try {
        
        const findLinkById = await Link.findById(linkId);
        
        if (!findLinkById) return res.status(400).json({
            ok: false,
            msg: 'Link inexistent!'
        });


        if (uid !== findLinkById.user.toString()) return res.status(401).json({
            ok: false,
            msg: 'You do not have permiss!'
        })

        const linkEdited = await Link.findOneAndUpdate( findLinkById, { ...req.body }, { returnOriginal: false } );
        

        return res.json({
            ok: true,
            msg: 'Link edited correctly!',
            linkEdited
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            ok: false,
            msg: 'There is an error, talk with the admin'
        });
    }
}

// DELETE A LINK BY ID PARAM
const deleteLink = async (req, res = response) => {
    const { linkId } =  req. params;
    const uid = req.uid
    try {
        
        const findLinkById = await Link.findById(linkId);

        if (!findLinkById) return res.status(400).json({
            ok: false,
            msg: 'Link inexistent!'
        });

        if (uid !== findLinkById?.user.toString()) return res.status(401).json({
            ok: false,
            msg: 'You do not have permiss!'
        })

        const linkDeleted = await Link.findByIdAndDelete(linkId);
        const findUser = await User.findById(uid);
        findUser.links = findUser.links.filter( link => link.toString() !== linkId );
        await findUser.save();
        

        return res.json({
            ok: true,
            msg: 'Link deleted correctly!',
            linkDeleted
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            ok: false,
            msg: 'There is an error, talk with the admin'
        });
    }
}



module.exports = { addNewLink, getLinks, editLink, deleteLink }