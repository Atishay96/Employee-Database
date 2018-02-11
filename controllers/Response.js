class Response{
	success(res, data, message = 'Operation Successful'){
		return res.json({message:message, data:data});
	}
	errorInternal(res, error){
		console.error(error)
		return res.status(500).json({message:"Oops!Some Error Occured.",error:error});
	}
	notAuthorized(res, message){
		return res.status(401).json({message:message});
	}
	message(res, status, message){
		return res.status(status).json({message:message});
	}
	badValues(res){
		return res.status(400).json({message:"Bad Values"});
	}
	notFound(res){
		return res.status(404).json({message:"no data found"});
	}
}

Response = new Response();
module.exports = Response;