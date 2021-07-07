<div id="credit" class="container p-y_3 m-x_3 p-x_4 br_0 br-t_1 br_secondary-4 br_solid font_n1"><?php printZenphotoLink(); ?>
   <span class="c_primary font_italic float-right">All content &copy; Matt Watier</span>
</div>
<!-- <script src="//code.jquery.com/jquery-3.3.1.min.js"></script>   -->
<script src="<?php echo $_zp_themeroot ?>/javascripts/d3.v3.min.js" type="text/javascript"></script>
<script src="<?php echo $_zp_themeroot ?>/javascripts/d3.Utlity.js" type="text/javascript"></script>
<!-- <script src="<?php echo $_zp_themeroot ?>/javascripts/d3.ColorWheel.js" type="text/javascript"></script> -->
<script src="<?php echo $_zp_themeroot ?>/javascripts/d3.BarChart.js" type="text/javascript"></script>
<script src="<?php echo $_zp_themeroot ?>/javascripts/d3.DonutChart.js" type="text/javascript"></script>
<script src="<?php echo $_zp_themeroot ?>/javascripts/d3.DonutChartSimple.js" type="text/javascript"></script>
<script src="<?php echo $_zp_themeroot ?>/javascripts/d3.GalleryChart.js" type="text/javascript"></script>
<script src="<?php echo $_zp_themeroot ?>/javascripts/d3.ColorBarFitler.js" type="text/javascript"></script>
<!-- <script src="<?php echo $_zp_themeroot ?>/javascripts/d3.ColorBlocks.js" type="text/javascript"></script> -->
<script src="https://cdn.jsdelivr.net/npm/lozad"></script>
<!-- Add fancyBox main JS and CSS files -->
<script src="https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.6/dist/jquery.fancybox.min.js"></script>
<script defer src="https://pro.fontawesome.com/releases/v5.15.3/js/all.js" integrity="sha384-OF9QwbqmlzSPpIxe2GYS8lkGFyaFfrgUPD2J3qj8zGVps17Y/x8EK2U8PEl6UrpH" crossorigin="anonymous"></script>

<!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
<script type="text/javascript">
var _gaq = [
   ['_setAccount', 'UA-20288415-1'],
   ['_trackPageview']
];
(function(d, t) {
   var g = d.createElement(t),
      s = d.getElementsByTagName(t)[0];
   g.src = ('https:' == location.protocol ? '//ssl' : '//www') + '.google-analytics.com/ga.js';
   s.parentNode.insertBefore(g, s)
}(document, 'script'));

const observer = lozad(); // lazy loads elements with default selector as ".lozad"
observer.observe();
</script>

<?php zp_apply_filter('theme_body_close'); ?>
</body>

</html>