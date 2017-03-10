var app = require("express")();
app.get('/',function(req, res){
	try{
		res.json('success')
	}catch(e){
		console.log(e)
	}
}
app.listen(7101, function(){
  console.log('BJMS started, listening on port:'+7101);
});