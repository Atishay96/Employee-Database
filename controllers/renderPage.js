class website{
	index(req,res){
        res.render('../views/index.ejs');
    }
    uploadExcelFile(req,res){
    	res.render('../views/upload.ejs');
    }
    addEntry(req,res){
    	res.render('../views/addEntry.ejs');
    }
}

website = new website();
module.exports = website;