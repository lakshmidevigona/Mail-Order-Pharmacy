const Drug = require("../models/drugs");
const getRequiredDrug = (async (req, res) =>{
    const location = req.params.location;
    const drugName = req.params.drugName;

    // const { location,  drugName } = req.query;
    console.log({location})

    try {
        // Search the database for matching medicines
        const data = await Drug.find({
            location:{ $regex: new RegExp( location, "i") },
            drugName: { $regex: new RegExp( drugName, "i") }  // Case-insensitive search
        });
       
        if (data)
        {     
            res.json({ success: true, results: data });
        } else {
            res.json({ success: false, message: 'No results found' });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports=getRequiredDrug