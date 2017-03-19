<?php date_default_timezone_set('America/Los_Angeles');?>
<?php session_start();  if(!isset($_SESSION["key"])) $_SESSION["key"]="";
			if(!isset($_SESSION["sel"])) $_SESSION["sel"]="user";
	
			if(!isset($_SESSION["sel"])) $_SESSION["location"]="";
			if(!isset($_SESSION["distance"])) $_SESSION["distance"]="";?>

<!DOCTYPE html>
<html>

	<head>
		<style>
		body{
			font-family: "Trebuchet MS", Helvetica, sans-serif;
		}
		.ss{	
			margin-left:auto;
			margin-right:auto;
			margin-top:5px;
			margin-bottom:20px;
			border:2px solid black;
			width:800px;
			height:250px;
			padding:5px;
		}
		.fa{
			font-size: 250%;
			text-align:center;
		}
		
		table.d,td.d,tr.d,th.d{display:block;}
		td.d,tr.d,th.d{margin:0;}
		table,td,tr,th{border:1px solid black;border-collapse: collapse;}
		.a,.no_result,table,tr,#albums, #posts{margin-left:auto;margin-right:auto;width:840px;}
		.a{	
			text-align:center;
			background-color:#dddddd;
		}
		.ss, table{background-color:#eeeeee;}
		.a,.no_result{border:1px solid black;}
		.avaiable{
			color:blue;
			text-decoration: underline;
		}
		
		
		img.detail{height:80px; width:80px;} 

		img.result{height:30px; width:40px;}
		
		</style>
		<script>
			function selectInput(option)
			{
				if(option.value == "place")
					document.getElementById("place").innerHTML = "<label>Location</label><input type=\"text\" name=\"location\"  required/><label>Distance(meters)</label><input type=\"text\" name=\"distance\"  required/>";
				else
					document.getElementById("place").innerHTML = "";
				
			}
			/*function erase()
			{
				
				document.getElementById("keyword").value = "";
				document.getElementById("sel").value = "user";
				document.getElementById("place").innerHTML = "";
				document.getElementById("res").innerHTML = "";
			}*/
			function open_albums()
			{
				if(document.getElementById("albums").innerHTML == "")
				{
				var str = "<table class=\"d\">";
				for(var i = 0; i < details.albums.length;i++)
				{
					if(details.albums[i].photos.length > 0)
						str += "<tr class=\"d\"><td class=\"d avaiable\"onclick=\"open_albums_pic(" + i + ")\">" + details.albums[i].name+"<div id=\"a" + i +"\"></div></td></tr>";
					else
						str += "<tr class=\"d\"><td class=\"d\">"+  details.albums[i].name +"</td></tr>";		
				}
				str += "</table>";
				document.getElementById("albums").innerHTML = str;
				}
				else
					document.getElementById("albums").innerHTML = "";
				document.getElementById("posts").innerHTML = "";
			}
			function open_albums_pic(i)
			{
				var str = "";
				if(document.getElementById("a" + i).childNodes.length  == 0){		
					str += "<a href=\""+ img_array[2*i]+"\" target=\"_blank\"><img class=\"detail\" src=\"" +  details.albums[i].photos[0].picture+ "\"></a>";
				if(details.albums[i].photos.length > 1)
					str += "&nbsp;&nbsp;&nbsp;<a href=\""+ img_array[2*i+1]+"\" target=\"_blank\"><img class=\"detail\" src=\"" +  details.albums[i].photos[1].picture+ "\"></a>";
				}
				document.getElementById("a" + i).innerHTML = str;
			}

			function open_posts()
			{
				if(document.getElementById("posts").innerHTML == "")
				{
					var str = "<table class=\"d\"><tr class=\"d\"><th class=\"d\">Message</th></tr>";
					for(var i = 0; i < details.posts.length; i++)
					{
						if(details.posts[i].hasOwnProperty('message') && details.posts[i].message != "")	
							str += "<tr class=\"d\"><td class=\"d\">" + details.posts[i].message +"</td></tr>";
					}
					str += "</table>";
					document.getElementById("posts").innerHTML = str;
					
				}
				else
					document.getElementById("posts").innerHTML = "";
				document.getElementById("albums").innerHTML = "";
			}
			function fetch(i)
			{
				
			}
		</script>
		
		
	</head>
	<body>
		
		<?php 
			
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
			$access_token = "EAAabYu6Dzi4BAPenI5dcZACcxohI7hmRatRZA209faprGAgk1qE8ccFCMqRYjl7aHTaWntAwmsuQkZAsfyDfhsCEdoXHMvDngYzklFNXa8timgQFqhBwc8FCntMAa3KyVfFKCZC2Xqs7s1mn4qK1uGjbMIb7szYZD";
			
			$api_key = "AIzaSyAGETN2apDhlTPMFfnYdB2xbmtSJCH5qrM";

			if($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["clear"]))
			{
				$_SESSION["key"] = $_SESSION["location"] = $_SESSION["distance"] = ""; $_SESSION["sel"] = "user";
			}
			
			if($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["submit"]))
		{
			// = $_SESSION["location"] = $_SESSION["distance"] = "";  = "user";
			$_SESSION["key"] = $_GET["keyword"];
			$_SESSION["sel"] = $_GET["sel"];
			
			
			$url = "search?q="
				.$_SESSION["key"]
				."&type="	
				.$_SESSION["sel"];
			if($_SESSION["sel"] != "place")
			{
			$url = $url	
				."&fields=id,name,picture.width(700).height(700)";
			if($_SESSION["sel"] == "event")
				$url = $url . ",place";
			$url = $url . "&access_token=" . $access_token;
			
			}
			else{
				
				//step 1: call google geocoding api
				$_SESSION["location"] = $_GET["location"];
				$_SESSION["distance"] = $_GET["distance"];
				$address_url = "https://maps.googleapis.com/maps/api/geocode/json?address=" . urlencode($_SESSION["location"]) . "&key=" . $api_key;
				//echo $address_url;
				$tmp = file_get_contents($address_url);
				$target = json_decode($tmp, true);
				//step 2: call facebool api
				//echo var_dump($target);
				//echo sizeof($target["results"]);
				$point =  $target["results"][0]["geometry"]["location"];
				//echo $point["lat"]. "              " .$point["lng"];
				//echo var_dump($target);
				$url = $url	
				."&center="
				.$point["lat"]
				.","
				.$point["lng"]
				."&distance="
				.$_SESSION["distance"]
				."&fields=id,name,picture.width(700).height(700)&access_token=" . $access_token;
			}
			$request = $fb->request('GET', $url);
			//$response = $fb->get($url);
			$response = $fb->getClient()->sendRequest($request);
			$graphObject = $response->getGraphEdge();
			//global $result;
			$_SESSION["result"] = json_decode($graphObject, true);
		}
			
			if(isset($_GET["choice"]))
			{
				
				//echo sizeof($_SESSION["result"]);//$_SESSION["result"][$_GET["choice"]]["id"]
				//echo $_SESSION["result"][$_GET["choice"]]["id"];
				$detail_url =  $_SESSION["result"][$_GET["choice"]]["id"]. "?fields=id,name,picture.width(700).height(700),albums.limit(5){name,photos.limit(2){name, picture}},posts.limit(5)&access_token=".$access_token;
				
				
				$request = $fb->request('GET', $detail_url);
			
				$response = $fb->getClient()->sendRequest($request);
				$graphObject = $response->getGraphNode();
				
				$_SESSION["details"] = json_decode($graphObject, true);
				//echo $graphObject;
				//echo var_dump($_SESSION["details"]);
				echo "<script> var details = ".$graphObject.";</script>";
				//get url of origin images
				
				if(array_key_exists("albums", $_SESSION["details"]))
				{
				$img_cluster = array(10);
				$j = 0;
				foreach($_SESSION["details"]["albums"] as $a)
				{
					if(array_key_exists("photos", $a))
					{
						$detail_img = "https://graph.facebook.com/v2.8/".$a["photos"][0]["id"]."/picture?access_token=".$access_token;
						$img_cluster[$j] = $detail_img;
						if(sizeof($a["photos"]) > 1)
						{
							$detail_img = "https://graph.facebook.com/v2.8/".$a["photos"][1]["id"]."/picture?access_token=".$access_token;
							$img_cluster[$j + 1] = $detail_img;
						}
					}	
						
					$j = $j + 2;
				}
				echo "<script>var img_array = ". json_encode($img_cluster) .";</script>";
				}
			}
			
		?>
		<div class="ss">
		<form  method="GET" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>"> 
			<div class= "fa" >Facebook Search</div>
			<hr/>
			
			<label>Keyword</label><input type="text" id="keyword" name="keyword" value="<?php echo $_SESSION["key"];?>" required/><br/>
			<label>Type:</label>&nbsp;&nbsp;&nbsp;&nbsp;
			<select id="sel" name="sel" onchange="selectInput(this)" value="<?php echo $_SESSION["sel"];?>">
				<option value="user" <?php if($_SESSION["sel"] == "user") echo "selected";?>>Users</option>
  				<option value="page" <?php if($_SESSION["sel"] == "page") echo "selected";?>>Pages</option>
  				<option value="event"<?php if($_SESSION["sel"] == "event") echo "selected";?>>Events</option>
  				<option value="place"<?php if($_SESSION["sel"] == "place") echo "selected";?>>Places</option>
				<option value="group"<?php if($_SESSION["sel"] == "group") echo "selected";?>>Groups</option>
			</select>
			<div id="place"><?php if($_SESSION["sel"] == "place") echo "<label>Location</label><input type=\"text\" name=\"location\" value=\"". $_SESSION["location"]. "\" required/><label>Distance(meters)</label><input type=\"text\" name=\"distance\" value=\"". $_SESSION["distance"]. "\" required/>";?></div>
			&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
			<input type="submit" name="submit" value="Search"/>
			</form>	
			<form method="get" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
			<input type="submit" name="clear" value="Clear" />
			</form>
		</div>
		<div id="res"><?php 
			if(isset($_GET["submit"])){
				
				$len = sizeof($_SESSION["result"]);
				if($len == 0)
					echo "<div class=\"no_result\">No Records has been found</div>";
				else{
					
					echo "<table>
						<tr><th>Profile Photo</th><th>Name</th><th>";
						if($_GET["sel"] == "event")
							echo "Place";
						else
							echo "Details";
						echo "</th></tr>";
					for($i = 0; $i < $len; $i++)
					{
						
						echo "<tr>
							<td><a href=\"" .$_SESSION["result"][$i]["picture"]["url"] . "\" target=\"_blank\"><img class=\"result\" src=\"" . $_SESSION["result"][$i]["picture"]["url"]. "\"></a></td>
							<td>". $_SESSION["result"][$i]["name"] . "</td><td>";
							if($_GET["sel"] != "event")
								echo "<a href=\"" . htmlspecialchars($_SERVER["PHP_SELF"]) . "?choice=" . $i . "\">Details</a>";
							else
								echo $_SESSION["result"][$i]["place"]["name"];
							echo "</td></tr>";
									
					}
					echo	"</table>";			
				}
			}
			else{
				if(isset($_GET["choice"]))
				{
					
					if(!array_key_exists("albums", $_SESSION["details"]) )
						echo "<div class=\"a no_result\">No Albums has been found</div>";
					else{
						echo "<div class=\"a avaiable\" onclick=\"open_albums()\">Albums</div>";
						echo "<div id=\"albums\"></div>";
					}
					echo"<br/>";

					if(!array_key_exists("posts", $_SESSION["details"]))
						echo "<div class=\"a no_result\">No Posts has been found</div>";
					else{
						echo "<div class=\"a avaiable\" onclick=\"open_posts()\">Posts</div>";
						echo "<div id=\"posts\"></div>";
					}
				}	

			}		
		?></div>
	</body>
</html>

























