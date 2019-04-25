<?php

// force UTF-8 Ø


if (!defined('WEBPATH')) die();
include_once "masonFunctions.php";
?>
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js">
<!--<![endif]-->

<head>
   <?php zp_apply_filter('theme_head'); ?>
   <title><?php echo getBareGalleryTitle(); ?> | <?php echo getBareAlbumTitle(); ?> | <?php echo getBareImageTitle(); ?></title>
   <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
   <meta name="viewport" content="width=device-width">
   <?php include('_htmlHeader.php'); ?>

</head>

<body id="albumbody">

   <?php zp_apply_filter('theme_body_open'); ?>
   <?php include('_siteHeaderNav.php'); ?>
   <div class="header grid-x p-x_4">
      <div id="breadcrumb" class="cell">
         <h1 class="font_display font_5"><?php printHomeLink('', ' | '); ?><a href="<?php echo html_encode(getGalleryIndexURL()); ?>" title="<?php echo gettext('Albums Index'); ?>">Fragments</a> | <?php printParentBreadcrumb(); ?> <?php printAlbumTitle(true); ?></h1>
         <div class="font_1"><?php printAlbumDesc(true); ?></div>
      </div>
   </div>
   <div class="filters grid-x grid-margin-x p_1 p-x_4:medium">
      <div id="masterChart" class="cell small-12"></div>
      <div id="colorFilter" class="cell small-12"></div>
   </div>
   <div class="filters grid-x grid-margin-x p_1 p-x_4:medium">
      <div id="typeHolder" class="cell small-12 medium-5 large-4">
      </div>
      <div id="tagHolder" class="cell small-12 medium-7 large-8">
      </div>
   </div>
   <div class="page">
      <div class="p-y_4 p-r_2 p-l_2 p-l_5:medium p-r_3:medium ">
         <?php
         $gallery = new MyGallery(getBareAlbumTitle());
         $query = "SELECT fragments_obj_to_tag.tagid as ID, fragments_tags.name as name, fragments_albums.title as ablum, SUBSTRING( fragments_albums.folder, 1 ,LOCATE('/',fragments_albums.folder)-1) as parent, COUNT(fragments_obj_to_tag.tagid) as count FROM fragments_obj_to_tag LEFT JOIN fragments_tags ON fragments_obj_to_tag.tagid = fragments_tags.id LEFT JOIN fragments_images ON fragments_obj_to_tag.objectid = fragments_images.id LEFT JOIN fragments_albums ON fragments_images.albumid = fragments_albums.id WHERE LOCATE('_color',name)!= 1 AND fragments_albums.parentid = " . $_zp_current_album->getID() . " GROUP BY ID ORDER BY count DESC;";
         $data_TagCounts = query_full_array($query);

         $query = "SELECT fragments_obj_to_tag.tagid as ID, SUBSTRING(fragments_tags.name,LOCATE('-', fragments_tags.name )+1,CHAR_LENGTH(fragments_tags.name)) as name,SUBSTRING( fragments_albums.folder, 1 ,LOCATE('/',fragments_albums.folder)-1) as parent, COUNT(fragments_obj_to_tag.tagid) as count FROM fragments_obj_to_tag LEFT JOIN fragments_tags ON fragments_obj_to_tag.tagid = fragments_tags.id LEFT JOIN fragments_images ON fragments_obj_to_tag.objectid = fragments_images.id LEFT JOIN fragments_albums ON fragments_images.albumid = fragments_albums.id WHERE LOCATE('_color-',name) = 1 AND fragments_albums.parentid = " . $_zp_current_album->getID() . " GROUP BY ID ORDER BY FIELD(name, '_color-black','_color-brown','_color-purple','_color-blue','_color-green','_color-yellow','_color-orange','_color-red','_color-grey','_color-white') ASC;";
         $data_ColorCounts = query_full_array($query);
         $gallery_item = "<div id='album'>";
         $checked = false;
         while (next_album($all = true)) :
            $current_alblum = $_zp_current_album;
            $albumTitle = $_zp_current_album->name;
            $album_item = "";
            $images = $current_alblum->images;


            //Print out List of current images in gallery.
            //Pass those images to a foreach loop
            //Inside the For each loop make this data structure DIV(class="alblum_names image" ) ->image(src = "thumbnail" ) (alt = "image name" )
            while (next_image($all = true)) :
               $image_item = "";
               $maxSQ = 30000;
               $h = getFullHeight();
               $w = getFullWidth();
               $proportioned = get_proportion($w, $h, $maxSQ);
               $m = get_modifier($proportioned, $w);
               $size = get_image_size($w, $h, $m);
               $W = $size[0];
               $H = $size[1];

               //echo "tags";
               $tags = getTags();
               if (isset($tags)) {
                  array_push($tags, "_type-" . getBareAlbumTitle());
                  $space_separated_array = implode("_", array_unique($tags));
                  $space_separated_array = str_replace(" ", "-", $space_separated_array);
                  $space_separated_array = str_replace("_", " ", $space_separated_array);
                  $gallery->add_to_filter(array_unique($tags));
               }
               $image_item .= "<div class='images br_secondary-4 shadow_1 bw_1 br_solid p_2 m-x_1 m-y_3 texture-light bg_secondary-5 hover:bg_accent " . getBareAlbumTitle() . " " . $space_separated_array . "' style='width:" . ($W + 10) . "px; height:" . ($H + 10) . "px;' >";
               $image_item .= "<a class='shadow_2 block br_secondary-3 bw_1 br_solid texture_disabled' href='" . getCustomImageURL(1000) . "' title='" . getBareImageTitle() . "' data-arrows='false'   data-fancybox='gallery_" . getBareAlbumTitle() . "' style='width:" . ($W) . "px; height:" . ($H) . "px;' >";
               $image_item .= "<img width='" . $W . "' height='" . $H . "' class='lazy lozad' src='' data-src='https://mattwatier.com" . getCustomSizedImageThumbMaxSpace($W, $H) . "' /></a></div>";
               $album_item .= $image_item;
            endwhile;
            //end of next_image loop
            $gallery_item .= $album_item;
         endwhile; //end of next album loop
         //end of gallery mechanic and logic
         $gallery_item .= "</div><!-- End of Gallery -->";
         //echo $gallery_item;  
         $filters = $gallery->get_filters();
         $D3_BarChart_Array = flattenArray($filters);
         $colors = $gallery->get_colorfilters();
         $D3_Wheel_Array = flattenArray($colors);
         $type_tags = $gallery->get_typefilters();
         $D3_CategoryCount = flattenArray($type_tags);




         function flattenArray($array)
         {
            $temparray = array();
            foreach ($array as $key => $value) {
               array_push($temparray, $value);
            }
            $array = $temparray;
            return $array;
         }
         echo $gallery_item;
         ?> </div>




   </div>



   <script type="text/javascript">
   var tag_dset_sql = <?php echo json_encode($data_TagCounts); ?>;
   var color_dset_sql = <?php echo json_encode($data_ColorCounts); ?>;
   var type_dset = <?php echo json_encode($D3_BarChart_Array); ?>;
   var wheel_dset = <?php echo json_encode($D3_Wheel_Array); ?>;
   var category_dset = <?php echo json_encode($D3_CategoryCount); ?>;
   $(document).ready(function() {
      var $container = $('#album'),
         $win = $(window),
         $imgs = $("img.lazy");
      let chartDimensions = {
         w: $("#masterChart").innerWidth(),
         m: 10,
         g: 2,
         font_small: .8333333333,
         font_normal: 1,
         font_large: 1.728
      };
      let dataSets = {
         catData: <?php echo json_encode($D3_CategoryCount); ?>,
         tagData: <?php echo json_encode($data_TagCounts); ?>,
         colorData: <?php echo json_encode($data_ColorCounts); ?>,
      };
      masterChart("#masterChart", dataSets, chartDimensions);
      drawBarChartNav("value", tag_dset_sql, "#tagHolder", {
         w: $("#tagHolder").innerWidth(),
         h: 300,
         m: 10,
         g: 1,
         font_small: .8333333333,
         font_normal: 1,
         font_large: 1.728
      });
      pieChart = drawDonutChart("value", category_dset, "#typeHolder", {
         w: $("#typeHolder").innerWidth(),
         h: 300,
         m: 10,
         g: 1,
         font_small: .8333333333,
         font_normal: 1,
         font_large: 1.728
      });
      // drawColorBlocks("value", color_dset_sql, "#colorWheel", {
      //    w: $("#colorWheel").innerWidth(),
      //    h: 375,
      //    m: 10,
      //    g: 2
      // });
      drawColorBarFilter(
         color_dset_sql, "#colorFilter", {
            w: $("#colorFilter").innerWidth(),
            h: 100,
            m: 10,
            g: 1,
            font_small: .8333333333,
            font_normal: 1,
            font_large: 1.728
         }
      )
      var col_width = Math.floor($container.innerWidth() / (Math.floor($container.innerWidth() / 180)));

      $container.isotope({
         itemSelector: '.images',
         masonry: {
            columnWidth: col_width
         },
         onLayout: function() {
            $win.trigger("scroll");
         }
      });
      var isotopefilters = {};
      $('#tagHolder .filter, #typeHolder .filter,#colorFilter .filter').click(function() {
         console.log("click event trigger from filter object in chart")
         var selector = $(this).attr('data-filter');
         $container.isotope({
            filter: selector
         });
         // $('#filters a, #tagHolder a, #typeHolder .filter,#colorWheel a,#colorFilter .block').click(function() {
         //    var selector = $(this).attr('data-filter');
         //    $container.isotope({
         //       filter: selector
         //    });
         //    return false;
         // });
      });
   });
   </script>

   <script src="<?php echo $_zp_themeroot ?>/javascripts/masterChart.js" type="text/javascript"></script>

   <script src="<?php echo $_zp_themeroot ?>/javascripts/isotope.2.js" type="text/javascript"></script>

   <script src="<?php echo $_zp_themeroot ?>/javascripts/packery-mode.pkgd.min.js" type="text/javascript"></script>


   <?php include('_endofTheme.php'); ?>