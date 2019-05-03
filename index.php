<?php
if (!defined('WEBPATH')) die();
$flush = false;
if ($_GET["flush"] == "true") {
  $flush  = true;
} else {
  $flush  = false;
}
?>
<!DOCTYPE html>
<html>

<head>
  <?php zp_apply_filter('theme_head'); ?>
  <title>Artistic Fragments of Matt Watier</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width">
  <?php include('_htmlHeader.php'); ?>
</head>

<body class="">
  <!--[if lt IE 8]>
        <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
 <![endif]-->
  <?php zp_apply_filter('theme_body_open'); ?>
  <?php include('_siteHeaderNav.php'); ?>
  <div class="grid-container" style="max-width:100%;">
    <div class='page grid-x grid-margin-x'>
      <div id="introduction" class="cell large-4 p-x_5:large p-t_5">
        <h1 class="font_display font_5 ">Welcome to the Fragments of Me.</h1>
        <div id="bar_holder" class="">
          <!-- this is a holder for the bar chart -->
        </div>
        <div class="font_2 font_copy m-t_4"><?php printGalleryDesc(); ?></div>
        <hr>
        <!-- <h4  class="font_display font_4">Shards of my work scatter across time</h4>
         <p><em>It is interesteding to see my work plotted into the months they were created over time. This isn't all my work but the work that is represented this repository.</em></p> -->
      </div><!-- End of Introduction -->
      <?php
      $gallery_item = '<div id="ablumns" class="cell large-8"><div class="grid-x grid-margin-x grid-margin-y">';
      while (next_album()) :
        $gallery_item .= '<div class="albumn p_5:large  ' . getAnnotatedAlbumTitle() . ' cell small-12 medium-6" ><div class="">';
        $gallery_item .= '<h3 class="font_4 br-b_1 br_solid br_0 br_primary-5 p-x_4"><a href="' . html_encode(getAlbumURL()) . '" class="c_primary no-underline" title="View album ' . getAnnotatedAlbumTitle() . '">' . getAnnotatedAlbumTitle() . '<i class="far fa-arrow-alt-circle-right font_2 p-l_2"></i></a></h3>';
        $gallery_item .= '<a href="' . html_encode(getAlbumURL()) . '"><div class="d3_chart" id="dataholder_' . getAnnotatedAlbumTitle() . '">&nbsp;</div></a>';
        $images = '<ul class="thumbnail-holder grid-x no-bullet p_5 ">';
        for ($i = 1; $i <= 18; $i++) {
          $randomImage = getRandomImagesAlbum($rootAlbum = getAnnotatedAlbumTitle(), $daily = false);
          $images .= "<li class='cell center m-x_auto m-y_2 text-center m-x_3 image-thumb'><a data-fancybox='gallery_" . getAnnotatedAlbumTitle() . "' style='width:65px;height:70px;' class='br_1 inline-block br_secondary-4 br_solid p_2 bg_secondary-5 hover:primary' href='" . $randomImage->getFullImage() . "'>";
          if ($randomImage->getWidth() >= $randomImage->getHeight()) {
            $ih = 60;
            $iw = null;
          } else {
            $ih = null;
            $iw = 60;
          }
          $images .= "<img width='60' height='60' style='width:60px;height:60px;' class='lazy lozad' src='" . $_zp_themeroot . "/images/holder.gif' data-src='https://mattwatier.com" . html_encode($randomImage->getCustomImage(null, $iw, $ih, 60, 60, null, null, true)) . "'/>";
          $images .= "</a></li> \n";
        }
        $images .= "</ul> \n";
        $gallery_item .= $images;
        $gallery_item .= '<div class="albumn-description font_1 font_copy c_secondary-n4 lh_3 p_5 p-t_4 br-t_1 br_solid br_0 br_primary-5">' . getAlbumCustomData() . '<a href="' . html_encode(getAlbumURL()) . '" class="font_1 font_display block">Explore my work on ' . getAnnotatedAlbumTitle() . '<i class="far fa-caret-square-right p-l_3"></i></a></div>';
        $gallery_item .= "\n </div></div> \n";
      endwhile;
      $gallery_item .= '</div></div></div></div>';
      echo $gallery_item;
      ?>
    </div>
    <div class="row" id="dataholder" style="position: relative;"></div>
    <?php


    require_once('cache.php');
    //instantiate it
    $cache = new Cache();
    $d3BuilderCall = "";
    // gallery_grouping  
    $query = "SELECT fragments_albums.parentid AS id, LEFT( fragments_albums.folder,  (LOCATE(fragments_albums.title, fragments_albums.folder)-2))   AS type, count(fragments_albums.title) AS count FROM fragments_albums INNER JOIN fragments_images ON fragments_albums.id = fragments_images.albumid  GROUP BY fragments_albums.parentid;";

    $cacheName = "gallery_grouping.tmp";
    $gallery_grouping = query_full_array($query); //d3QueryCache($flush, $query, $cacheName, $cache);


    // script tags to place the arrays on the page.
    echo '<script type="text/javascript">';
    echo 'var dset=' . json_encode($gallery_grouping) . ';';
    $d3BuilderCall .= 'drawBarChart("value",dset,"#bar_holder"); ';

    foreach ($gallery_grouping as $key => $value) {
      $query = "SELECT DISTINCT fragments_albums.title AS type, COUNT(fragments_images.albumid) as count FROM fragments_albums INNER JOIN fragments_images ON fragments_albums.id = fragments_images.albumid WHERE fragments_albums.parentid = " . $value['id'] . " GROUP BY fragments_albums.folder;";
      $cacheName = 'cachedQuery_' . $value["id"] . '.tmp';
      $data = query_full_array($query); //d3QueryCache($flush, $query, $cacheName, $cache);
      echo 'var dset_' . $value["id"] . '=' . json_encode($data) . ';';
      $d3BuilderCall .= "drawDonutChartSimple('" . $value['type'] . "', dset_" . $value['id'] . ",'#dataholder_" . $value['type'] . "' ,{w: $('#dataholder_" . $value['type'] . "').innerWidth(), h: 300, m: 10, g: 1, font_small: .8333333333, font_normal: 1, font_large: 1.728});";
    }

    // tag_time

    $query = "SELECT (@cnt := @cnt + 1) AS id, t.* from (SELECT fragments_tags.name AS name, fragments_images.date AS date FROM fragments_tags JOIN fragments_obj_to_tag ON fragments_obj_to_tag.tagid = fragments_tags.id  RIGHT JOIN fragments_images ON fragments_obj_to_tag.objectid = fragments_images.id WHERE LOCATE('_color',fragments_tags.name)!= 1 ORDER BY  fragments_images.date) t CROSS JOIN (SELECT @cnt := 0) AS dummy;";
    $cacheName = "tag_time.tmp";
    $tag_time = query_full_array($query); //d3QueryCache($flush, $query, $cacheName, $cache);

    // tag name
    $query = "SELECT DISTINCT name FROM fragments_tags WHERE LOCATE('_color',fragments_tags.name) != 1;";
    $cacheName = "tag_name.tmp";
    $tag_name = query_full_array($query); //d3QueryCache($flush, $query, $cacheName,$cache);
    //color_name  
    $query = "SELECT DISTINCT name FROM fragments_tags WHERE LOCATE('_color',fragments_tags.name) = 1 and LENGTH(fragments_tags.name) !=6 ;";
    $cacheName = "color_name.tmp";
    $color_name = query_full_array($query); //d3QueryCache($flush, $query, $cacheName, $cache);
    //$color_time
    $query = "SELECT (@cnt := @cnt + 1) AS id, t.* from (SELECT fragments_tags.name, UNIX_TIMESTAMP(fragments_images.date) AS date FROM fragments_tags JOIN fragments_obj_to_tag ON fragments_obj_to_tag.tagid = fragments_tags.id  RIGHT JOIN fragments_images ON fragments_obj_to_tag.objectid = fragments_images.id WHERE LOCATE('_color',fragments_tags.name) = 1 and LENGTH(fragments_tags.name) !=6 ORDER BY  fragments_tags.name) t CROSS JOIN (SELECT @cnt := 0) AS dummy;";
    $cacheName = "color_time.tmp";
    $color_time = query_full_array($query); //d3QueryCache($flush, $query, $cacheName, $cache);

    echo 'var dset_colorname=' . json_encode($color_name) . ';';
    echo '</script>';
    function d3QueryCache($flush, $query, $cacheName, $cache)
    {
      $storageVar = null;
      if ($flush) {
        $cache->delete($cacheName);
      }
      if (empty($cache)) {
        $storageVar = query_full_array($query);
        $cache->write($cacheName, $storageVar);
      } else {
        $storageVar = $cache->read($cacheName);
      }

      return $storageVar;
    }
    ?>
  </div>
  <?php include('_endofTheme.php'); ?>
  <div id="colortheme">
    <!-- this is a holder for a secondary block -->
  </div>

  <script type="text/javascript">
    $(document).ready(function() {
      <?php echo $d3BuilderCall; ?>
      // $imgs = $("img.lazy");
      // $imgs.lazyload({
      //     effect: "fadeIn",
      //     failure_limit: Math.max($imgs.length - 1, 0)
      // });
    });
  </script>
  <style>
    .thumbnail-holder {
      max-height: 186px;
      overflow: hidden;
    }

    .image-thumb {
      flex: 0 1 55px;
    }
  </style>

</body>

</html>