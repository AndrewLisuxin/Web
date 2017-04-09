$(document).ready(function(){
    $("#key").focus(function(){
        $("#key").tooltip('destroy');
    });
    $("#go").click(function(){
        if($("#key").val().length == 0)
            $("#key").tooltip('toggle');
    });
});

var app = angular.module("mySelect", ["ngAnimate"]);
app.controller('myCon', function($scope, $window){
    //$scope.keyword = "";
    //$scope.myVar = "user";
    //$scope.access_token = "EAAabYu6Dzi4BAPenI5dcZACcxohI7hmRatRZA209faprGAgk1qE8ccFCMqRYjl7aHTaWntAwmsuQkZAsfyDfhsCEdoXHMvDngYzklFNXa8timgQFqhBwc8FCntMAa3KyVfFKCZC2Xqs7s1mn4qK1uGjbMIb7szYZD";
    $scope.myDomain = "http://cs571hwsuxinli-env.us-west-2.elasticbeanstalk.com/hw8.php";//"http://cs-server.usc.edu:54321/hw8.php";//
    $scope.geo = function(s){
        var crd = s.coords;
        //
        $scope.la = crd.latitude;
        $scope.lo = crd.longitude;
        console.log($scope.la);
        console.log($scope.lo);
        
       // });
    };
    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
       
    };
    
    $scope.getLocation = function(){
        if(navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition($scope.geo, error, {maximumAge:60000, timeout:5000,enableHighAccuracy: true});
        }
        else{
            alert("navigator.geolocation is not supported!");
        }
    };
    
    $scope.updateFavo = function(record)
    {
        if($window.localStorage.getItem(record.id) == null)
        {
            //local storing 
            
            var storageFile = {
                id: record.id,
                name: record.name,
                type: $scope.myVar,
                picture: {data:{url: null, copy: null}}
            };
            //convert img to dataURL
            
            storageFile.picture.data.url = record.picture.data.url;
            var image = document.getElementById(record.id);
            var imgCanvas = document.createElement("canvas"),
                imgContext = imgCanvas.getContext("2d");
            imgCanvas.width = image.width;
            imgCanvas.height = image.height;
            imgContext.drawImage(image, 0, 0, image.width, image.height);
            
            storageFile.picture.data.copy = imgCanvas.toDataURL("img/png");
            try {
                $window.localStorage.setItem(record.id, JSON.stringify(storageFile));
                console.log("not null ");
                
                //$scope.localStorage = localStorage;
            }
            catch (e) {
                console.log("Storage failed: " + e);
            }
            console.log(storageFile);
        }
        else{
            //remove from local storage
            $window.localStorage.removeItem(record.id);
            console.log("null ");
        }
    };
    
    $scope.remove = function(record)
    {
        $window.localStorage.removeItem(record.id);
            
        console.log("null");
        $scope.display();
        
    };
    
    $scope.isExist = function(record)
    {
        //alert("isExist");
        return record != null && $window.localStorage.getItem(record.id) != null;
    };
    
    $scope.display = function()
    {
        //$scope.detail_content = null;
         
        $scope.localStorage = [];
        //var j = 1;
        for(var i in localStorage){
            var re = JSON.parse(localStorage.getItem(i));
            if(re)
                $scope.localStorage.push(re);
            console.log(i + " " +JSON.stringify(re));
           
        }
        $scope.miniClear();
        setTimeout(function() {
                
        $scope.comeback = false;
        $scope.comeDetail = true;
        $scope.$apply();        
                       }, 1000);
        
    }
    /*$scope.displayImg = function(){
        
    }*/
    $scope.miniClear= function(){  
        
        $scope.detail_host = null;
        
        $scope.backurl = null;
        
    }
    $scope.clear = function(){
        $scope.miniClear();
        $scope.res = null;
        $scope.tmp = null;
        $scope.keyword = undefined;
        angular.element(document.getElementById($scope.myVar)).removeClass("active");
        angular.element(document.getElementById("user")).addClass("active");
        $scope.myVar = 'user';
        
    }
    $scope.visitServer = function(data){
        $.ajax({
        type: "GET",
        dataType: "json",
        url: $scope.myDomain,
        data: data
            }).done(function (d) {
                
                $scope.$apply(function(){
                $scope.res = d.data;
                console.log($scope.res);
                $scope.previous = $scope.next = null;
                if(d.hasOwnProperty("paging"))
                {
                    if(d.paging.hasOwnProperty("previous"))
                        $scope.previous = d.paging.previous;
                
                    if(d.paging.hasOwnProperty("next"))
                        $scope.next = d.paging.next;
                }
                console.log($scope.previous);
                console.log($scope.next);
                //$scope.$apply();
                //setTimeout(function() {
                    
                    $scope.comeback = false;
                    $scope.comeDetail = true;
               // }, 1000);
                /*setTimeout(function() {
                            
                             
                        }, 1000);*/
               
                //alert("yes!");
                   });
                        		//alert("success!");
            }).fail(function (jqXHR, textStatus) {
   	            alert("fail: " + textStatus);
            });
    }
    
    $scope.mySearch = function(){
    //$(".result").html(""); 
    $scope.miniClear();
    
    if($scope.keyword && $scope.myVar != "favorite"){
    var data = {
        "keyword" : $scope.keyword,
        "type" : $scope.myVar
    };
    if($scope.myVar == "place")
    {
        //navigator.geolocation.getCurrentPosition($scope.geo);
        data.latitude = $scope.la;
        data.longitude = $scope.lo;
        console.log(data.latitude + ", " + data.longitude);
    }
    data = $.param(data);
    //alert(data);
    $scope.visitServer(data);
    }
						

        return;
    }
    
    $scope.moreSearch = function(i)
    {
        var data = {};
        if(i == "pre")//previous
        {
            data.g = $scope.previous;
            //var searchParams = new URLSearchParams(data.g);
            //searchParams.delete("__before_id");
        }    
        
        else    
        {
            data.g = $scope.next;
            //var searchParams = new URLSearchParams(data.g);
            //searchParams.delete("__after_id");
        } 
        //data.g = searchParams.toString();
        $scope.backurl = data.g;
        data.g = encodeURI(data.g);
        
        data = $.param(data);
        console.log(data);
        $scope.visitServer(data);
        return;
    }
    
    $scope.visitDetail = function(data){
        $.ajax({
        type: "GET",
        dataType: "json",
        url: $scope.myDomain,
        data: data
            }).done(function (d) {
                    console.log(d);
                
                    $scope.detail_content = d;
                    
                    if(d.hasOwnProperty("albums"))
                    {
                        console.log("albums!");
                        $scope.albums = d.albums.data;
                        console.log($scope.albums);
                        $scope.imgSearch();
                    }
                    else
                        $scope.albums = null;
                    if(d.hasOwnProperty("posts"))
                    {
                        console.log("posts!");
                        $scope.posts = d.posts.data;
                    }
                    else
                        $scope.posts = null;
                    if(!d.hasOwnProperty("albums"))
                    {   
                        /*setTimeout(function() {
                              
                        }, 1000);*/
                        
                        setTimeout(function() { 
                            $scope.comeback = true;
                            $scope.comeDetail = false;  
                            $scope.$apply(); 
                        }, 1000);
                    }
                    //console.log($scope.imgs);
                    //console.log($scope.imgs);
                       		//alert("success!");
            }).fail(function (jqXHR, textStatus) {
   	            alert("fail: " + textStatus);
            });
    }
    
    $scope.detail = function(x){
        
        
        
        //$scope.comeDetail = true;
        $scope.detail_host = x;
        $scope.albums = $scope.posts = undefined;
        //$scope.imgs = null;
        var data ={
            "id": x.id,
        };
        if(x.hasOwnProperty("type"))//favorites
            data.type = x.type;
        else    
            data.type = $scope.myVar;
        data = $.param(data);
        console.log(data);
        
        $scope.visitDetail(data);
        
        //$scope.displayDetail = true;
    }
    
    $scope.back = function(){
        
        
        
        //$scope.detail_host =  null;
        if($scope.myVar != "favorite"){
        if($scope.backurl != null)
        {
            
            $scope.visitServer({"g": encodeURI($scope.backurl)});
            $scope.miniClear();
        }
        else{
            $scope.mySearch();
        }
        }
        else{
            //$scope.detail_host =  null;
            //$scope.miniClear();
            //$scope.comeback = true;
            //$scope.comeDetail = false;
            $scope.display();
        }
        //$scope.comeDetail = true;    
    }
    
    $scope.imgSearch = function(){
        var ids=[];
        //$scope.al = null;
        for(var k = 0; k < $scope.albums.length; k++)
        {
            console.log($scope.albums[k]);
            if($scope.albums[k].hasOwnProperty("photos"))
            {
            if($scope.albums[k].photos.data.length > 0)
                ids.push($scope.albums[k].photos.data[0].id);
            if($scope.albums[k].photos.data.length > 1)
                ids.push($scope.albums[k].photos.data[1].id);
            }
        }
        console.log(ids);
        var jsonString = JSON.stringify(ids);
        console.log(jsonString);
        
        $.ajax({
        type: "GET",
        dataType: "json",
        url: $scope.myDomain,
        data: {"pictures_id" : jsonString}
            }).done(function (d) {
                //console.log(d);
               // $scope.$apply(function(){
                    $scope.imgs = d;
                    console.log($scope.imgs);
                    
                   /* setTimeout(function() {
                               
                        }, 1000);*/
                        
                        setTimeout(function() {
                            $scope.comeback = true;
                            $scope.comeDetail = false;  
                            $scope.$apply();
                        }, 1000);
                    
               //          });   		//alert("success!");
            }).fail(function (jqXHR, textStatus) {
   	            alert("fail: " + textStatus);
            });
        //alert($scope.imgUrl);
        //return $scope.imgUrl;
    }
    
    $scope.time = function(aPost){
        var a = moment(aPost.created_time);
        console.log(a.format('YYYY-MM-DD LTS'));
        return a.format('YYYY-MM-DD HH:mm:ss');
    }
    
    $scope.postFB = function(){
        FB.ui({
            app_id: '1859699070979630',
            method: 'feed',
            link: window.location.href,
            //href:'https://developers.facebook.com/docs/',
            picture: $scope.detail_host.picture.data.url,
            name: $scope.detail_host.name,
            caption: "FB SEARCH FROM USC CSCI571",
        }, function(response){
            if (response && !response.error_message)
            {   //Success
                alert("Posted Sucessfully");
            }
            else{
                //Failed
                alert("Not Posted");
            }
});
    }
    
});


/*app.directive("favoCheck", function(){
    return {
        
    };
});*/


