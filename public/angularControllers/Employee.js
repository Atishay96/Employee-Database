app.controller('EmployeeController',function($scope,$http){
    $scope.getAllEmployees = function(){
    	$http({
    		url: __appurl + 'api/getAllRecords',
    		'method':'GET'
    	}).success(function(data){
    		data.data.map(function(v,i){
    			if(v.mark){
    				data.data[i].marked = 'UnMark ';
    				data.data[i].class = 'yellow';
    				data.data[i].opposite = false;
    			}else{
    				data.data[i].marked = 'Mark'
    				data.data[i].opposite = true;
    				data.data[i].class = '';
    			}
    		})
    		$scope.list = data.data;
    		setTimeout(function(){
	    		$('#example').DataTable();
    		},0)
    	}).error(function(err, status){
    		checkError(err, status);
    	})
    }
    $scope.toggleMark = function(event){
    	var id = $(event.target).attr('data');
    	var mark = $(event.target).attr('mark');
    	var index = $(event.target).attr('index');
    	$http({
    		url: __appurl + 'api/toggleMark',
    		method:'PUT',
    		data:{
    			mark:mark,
    			_id:id
    		}
    	}).success(function(dataset){
    		if(dataset.data.mark){
    			console.log('1');
    			$scope.list[index].opposite = false;
    			$scope.list[index].marked = 'UnMark';
    			$scope.list[index].class = 'yellow';
    		}else{
    			console.log('2'); 			
    			$scope.list[index].class = '';
    			$scope.list[index].opposite = true;
    			$scope.list[index].marked = 'Mark';
    		}
    	}).error(function(err, status){
    		checkError(err, status);
    	})
    }
    $scope.deleteEntry = function(index){
    	console.log(index);
    	console.log($scope.list[index]);
    	var id = $scope.list[index]._id;
    	$http({
    		url: __appurl + 'api/deleteEntry',
    		method:'POST',
    		data:{
    			_id:id
    		}
    	}).success(function(dataset){
    		dataset.data.map(function(v,i){
				if(v.mark){
					dataset.data[i].marked = 'UnMark';
					dataset.data[i].class = 'yellow';
					dataset.data[i].opposite = false;
				}else{
					dataset.data[i].marked = 'Mark'
					dataset.data[i].opposite = true;
					dataset.data[i].class = '';
				}
    		})
    		$scope.list = dataset.data;
    		$('#example').DataTable().destroy();
    		setTimeout(function(){
	    		$('#example').DataTable();
    		},0)
    	}).error(function(err, status){
    		checkError(err, status);
    	})
    }
    $scope.uploadFile =  function(){
    	console.log($scope.file)
    	$http({
    		url: __appurl + 'api/uploadExcelFile',
    		method:'POST',
    		headers:{
                'Content-Type':undefined
            },
    		data:{
    			excel:$scope.file
    		},
    		transformRequest: function(data, headersGetter) {                
                var formData = new FormData();
                angular.forEach(data, function(value, key) {
                    formData.append(key, value);
                });
                var headers = headersGetter();
                delete headers['Content-Type'];
                return formData;
            }
    	}).success(function(dataset){
    		alert(dataset.message);
    		window.location.href = __appurl
    	}).error(function(err, status){
    		checkError(err, status);
    	})
    }
    $scope.createRecord = function(){
    	if(!$scope.employee || !$scope.employee.name || !$scope.employee.empCode || !$scope.employee.email || !$scope.employee.phoneNumber){
    		return;
    	}
    	$http({
    		url: __appurl + 'api/addEntry',
    		method:'POST',
    		data:$scope.employee
    	}).success(function(dataset){
    		alert(dataset.message);
    		window.location.href = __appurl
    	}).error(function(err, status){
    		checkError(err, status);
    	})
    }
    $scope.renderData = function(index){
    	if(!$scope.list && !index && !$scope.list.length && !$scope.list[index]){
    		$scope.employee = {};
    		return;
    	}
    	$scope.index = index;
    	$scope.employee = Object.assign({},$scope.list[index]);
    }
    $scope.updateRecord = function(){
    	$http({
    		url: __appurl + 'api/updateEntry',
    		method:'PUT',
    		data:$scope.employee
    	}).success(function(data){
    		if(data.data.mark){
				data.data.marked = 'UnMark ';
				data.data.class = 'yellow';
				data.data.opposite = false;
			}else{
				data.data.marked = 'Mark'
				data.data.opposite = true;
				data.data.class = '';
			}
    		$scope.list[$scope.index] = data.data;
    		$('#example').DataTable().destroy();
    		setTimeout(function(){
	    		$('#example').DataTable();
    		},0)
    		alert(data.message);
    		$('#myModal').modal('hide')
    	}).error(function(err, status){
    		checkError(err, status);
    	})
    }
})