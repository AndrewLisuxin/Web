<?php
	/*date_default_timezone_set('America/Los_Angeles');
	require_once __DIR__ . '/php-graph-sdk-5.0.0/src/Facebook/autoload.php';
	use Facebook\Facebook;
	use Facebook\FacebookSession;
	use Facebook\FacebookRedirectLoginHelper;
	use Facebook\FacebookRequest;
	use Facebook\FacebookResponse;
	use Facebook\FacebookSDKException;	
	use Facebook\FacebookRequestException;
	use Facebook\FacebookAuthorizationException;
	use Facebook\GraphObject;
		
	$fb = new Facebook([
		'app_id' => '1859699070979630',
  		'app_secret' => '3422769767f138c2d1e525a71527434f'
		]);
*/
	$access_token = "EAAabYu6Dzi4BAPenI5dcZACcxohI7hmRatRZA209faprGAgk1qE8ccFCMqRYjl7aHTaWntAwmsuQkZAsfyDfhsCEdoXHMvDngYzklFNXa8timgQFqhBwc8FCntMAa3KyVfFKCZC2Xqs7s1mn4qK1uGjbMIb7szYZD";
			
	$api_key = "AIzaSyAGETN2apDhlTPMFfnYdB2xbmtSJCH5qrM";
	
	
		if(!isset($_GET["id"]))
{
	if(!isset($_GET["pictures_id"]))
{
		if(!isset($_GET["keyword"]))
		{

		$result = file_get_contents(rawurldecode($_GET["g"]));
		
		}
		else		
		{
        	$key = $_GET["keyword"];
		$type = $_GET["type"];
		//$types = array("user", "page", "event", "group");
		//foreach($types as $type)
		//{
		$url = "https://graph.facebook.com/search?q="
			.$key
			."&type="
			.$type
			."&limit=25&offset=0&fields=id,name,picture.width(700).height(700)";
		if($type == "place")
		{
			$url = $url
				."&center="
				.$_GET["latitude"]
				.","
				.$_GET["longitude"];
				
		}
		$url = $url
			."&access_token="
			.$access_token;
		//echo $url;
		$result = file_get_contents($url);
		}	
		echo $result;
}
else{
	//get detail original images
	$imgs = array();
	$data = json_decode(stripslashes($_GET["pictures_id"]));
	foreach($data as $picture_id)
		array_push($imgs,json_decode(file_get_contents( "https://graph.facebook.com/v2.8/".$picture_id."/picture?type=normal&redirect=false&access_token=".$access_token)));
	echo json_encode($imgs);
}
}
else{
	//detail
	$detail_url = "https://graph.facebook.com/"
			.$_GET["id"]
			."?";
			 
$options = array("fields"=>"id,name,picture.width(700).height(700),posts.limit(5)","access_token"=>$access_token);
if($_GET["type"] != "event") //events do not have albums
	$options["fields"] = $options["fields"] . ",albums.limit(5){name,photos.limit(2){name, picture.width(700).height(700)}}";
$detail_url .= http_build_query($options,'','&');
	$detail_result = file_get_contents($detail_url);
	echo $detail_result;
	
}
		//}

	/*}
	else
	{
		//details search
	}*/

?>
