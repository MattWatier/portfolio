<?php
  if (!defined('WEBPATH')) die();
    $flush = false;
    if( $_GET["flush"] == "true" ){
      $flush  = true;
    }else{
      $flush  = false;
    }
?>
<!DOCTYPE html>
<html>
<head>
  <?php zp_apply_filter('theme_head'); ?> 
    <title><?php echo getBareGalleryTitle(); ?> | <?php echo getBareAlbumTitle();?> | <?php echo getBareImageTitle();?></title>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width">
  <?php include('_htmlHeader.php' ); ?> 
</head>
<body>
<!--[if lt IE 8]>
        <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
 <![endif]-->
    <?php zp_apply_filter('theme_body_open'); ?>
    <?php include('_siteHeaderNav.php' ); ?>
    <div class='page'>
        <div id="introduction">
            <h1 class="fontface">Welcome to the Fragments of Me.</h1>
            <div id="bar_holder"class="row">
              <!-- this is a holder for the bar chart -->
            </div>
            <p><?php printGalleryDesc(); ?></p>
            <hr>
            <h4>Shards of my work scatter across time</h4>
            <p><em>It is interesteding to see my work plotted into the months they were created over time. This isn't all my work but the work that is represented this repository.</em></p>
        </div><!-- End of Introduction -->
    <?php 
      $gallery_item = '<div id="ablumns"><div class="row">';
      while (next_album()):
        $gallery_item .= '<div class="albumn '.getAnnotatedAlbumTitle().'" ><div class="row">';
        $gallery_item .= '<h3><a href="'.html_encode(getAlbumURL()).'" class="link no-underline" title="View album '.getAnnotatedAlbumTitle().'">'.getAlbumTitle().'&raquo;</a></h3>';
        $gallery_item .= '<div class="d3_chart" id="dataholder_'.getAnnotatedAlbumTitle().'">&nbsp;</div>';
        $images = '<ul class="thumbnail-holder">';
        for ($i=1; $i<=10; $i++) {
          $randomImage = getRandomImagesAlbum( $rootAlbum = getAnnotatedAlbumTitle(),$daily = false);
          $images .= "<li class='thumbnail'><a class='fancybox' href='".$randomImage->getFullImage()."'>";
          if ($randomImage->getWidth() >= $randomImage->getHeight()) {
            $ih = 30; $iw = NULL; }else{ $ih = NULL; $iw = 30;
          }
          $images .= "<img width='30' height='30'  class='lazy' src='".$_zp_themeroot."/images/holder.gif' data-original='".html_encode($randomImage->getCustomImage(NULL, $iw, $ih, 30, 30, NULL, NULL, true))."'/>";
          $images .= "</a></li> \n";
          //if($i==3){$images .= "</ul><ul style='list-style: none;'class='thumbnails row'>";}
        }
        $images .= "</ul> \n";
        $gallery_item .= $images;
        $gallery_item .= '<p class="albumn-description">'.getAlbumCustomData().'<a href="'.html_encode(getAlbumURL()).'">&nbsp; Explore my work on '.getAnnotatedAlbumTitle().'&nbsp;<i class="fa fa-arrow-circle-right"></i></a></p>'; 
        $gallery_item .= "\n </div></div> \n";
      endwhile;
      $gallery_item .= '</div></div></div></div>';
      echo $gallery_item;
    ?>
<div class="row" id="dataholder" style="position: relative;"></div>
<?php 

  require_once('cache.php');
  //instantiate it
  $cache = new Cache();
  $d3BuilderCall ="";
  // gallery_grouping  
  $query = "SELECT fragments_albums.parentid AS id, LEFT( fragments_albums.folder,  (LOCATE(fragments_albums.title, fragments_albums.folder)-2))   AS type, count(fragments_albums.title) AS count FROM fragments_albums INNER JOIN fragments_images ON fragments_albums.id = fragments_images.albumid  GROUP BY fragments_albums.parentid;";
  
  $cacheName = "gallery_grouping.tmp";
  $gallery_grouping = query_full_array($query);//d3QueryCache($flush, $query, $cacheName, $cache);
 

  // script tags to place the arrays on the page.
  echo '<script type="text/javascript">';
  echo 'var dset='.json_encode($gallery_grouping).';';
  $d3BuilderCall .= 'drawBarChart("value",dset,"#bar_holder"); ';

  foreach ($gallery_grouping as $key => $value) {
    $query = "SELECT DISTINCT fragments_albums.title AS type, COUNT(fragments_images.albumid) as count FROM fragments_albums INNER JOIN fragments_images ON fragments_albums.id = fragments_images.albumid WHERE fragments_albums.parentid = ".$value['id']." GROUP BY fragments_albums.folder;";
    $cacheName = 'cachedQuery_'.$value["id"].'.tmp';
    $data = query_full_array($query);//d3QueryCache($flush, $query, $cacheName, $cache);
    echo 'var dset_'.$value["id"].'='.json_encode($data).';';
    $d3BuilderCall .= "drawDonutChart('".$value['type']."', dset_".$value['id'].",'#dataholder_".$value['type']."');";
  }
 
// tag_time
  $query = "SELECT (@cnt := @cnt + 1) AS id, t.* from (SELECT fragments_tags.name AS name, fragments_images.date AS date FROM fragments_tags JOIN fragments_obj_to_tag ON fragments_obj_to_tag.tagid = fragments_tags.id  RIGHT JOIN fragments_images ON fragments_obj_to_tag.objectid = fragments_images.id WHERE LOCATE('_color',fragments_tags.name)!= 1 ORDER BY  fragments_images.date) t CROSS JOIN (SELECT @cnt := 0) AS dummy;";
  $cacheName = "tag_time.tmp";
  $tag_time = query_full_array($query);//d3QueryCache($flush, $query, $cacheName, $cache);

// tag name
  $query = "SELECT DISTINCT name FROM fragments_tags WHERE LOCATE('_color',fragments_tags.name) != 1;";
  $cacheName = "tag_name.tmp";
  $tag_name = query_full_array($query);//d3QueryCache($flush, $query, $cacheName,$cache);
//color_name  
  $query = "SELECT DISTINCT name FROM fragments_tags WHERE LOCATE('_color',fragments_tags.name) = 1 and LENGTH(fragments_tags.name) !=6 ;";
  $cacheName = "color_name.tmp";
  $color_name = query_full_array($query);//d3QueryCache($flush, $query, $cacheName, $cache);
//$color_time
  $query = "SELECT (@cnt := @cnt + 1) AS id, t.* from (SELECT fragments_tags.name, UNIX_TIMESTAMP(fragments_images.date) AS date FROM fragments_tags JOIN fragments_obj_to_tag ON fragments_obj_to_tag.tagid = fragments_tags.id  RIGHT JOIN fragments_images ON fragments_obj_to_tag.objectid = fragments_images.id WHERE LOCATE('_color',fragments_tags.name) = 1 and LENGTH(fragments_tags.name) !=6 ORDER BY  fragments_tags.name) t CROSS JOIN (SELECT @cnt := 0) AS dummy;";
  $cacheName ="color_time.tmp";
  $color_time = query_full_array($query);//d3QueryCache($flush, $query, $cacheName, $cache);
  
  echo 'var dset_colorname='.json_encode($color_name).';';
  echo '</script>';
  function d3QueryCache($flush, $query, $cacheName, $cache){
    $storageVar;
    if($flush){
      $cache->delete( $cacheName );
      }
    if( empty( $cache ) ){
      $storageVar = query_full_array($query);
      $cache->write($cacheName,$storageVar);
    }else{
      $storageVar = $cache->read($cacheName);
    }
    
    return $storageVar;
  }
?>
  <?php include('_endofTheme.php' ); ?>
  </div>
  <div id="colortheme">
    <!-- this is a holder for a secondary block -->
  </div>

  <script type="text/javascript">
    $(document).ready(function() {
      <?php echo $d3BuilderCall; ?>
      $imgs = $("img.lazy");
      $imgs.lazyload({ effect : "fadeIn",failure_limit: Math.max($imgs.length - 1, 0)});
    });
   </script> 


    </body>
</html>