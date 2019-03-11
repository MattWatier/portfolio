<?php  

function get_image_size($w, $h, $m){
	$W = ceil($m * $w);
	$H = ceil($m * $h);
	return array($W, $H);
	}

function get_modifier($proportioned,$w) {
	$containerSize = 1400;
	$gutter = 16;
	$column = $containerSize/10;
	$padding = -10;
	$size_1x = $column+$padding;
	$size_2x = $column+$column+$gutter+$padding+$padding;
	$size_3x = $column+$column+$column+$gutter+$gutter+$padding+$padding+$padding;
	$breakpoint_small =$column+$padding+($column/3)+$gutter;
	$breakpoint_medium = $column+$gutter+$column+$padding+($column/2)+$gutter;
	if($proportioned > 0 && $proportioned < $breakpoint_small){
		$m = $size_1x/$w;
		
		}
	elseif($proportioned >= $breakpoint_small && $proportioned <= $breakpoint_medium) {	
		$m = $size_2x/$w;
		
		}
	else{
		$m = $size_3x/$w;
		
		}
	return $m;
	
}

function get_proportion($w, $h, $maxSQ){
	$proportion = sqrt($maxSQ/($w * $h));
	return($w * $proportion);
}

function get_classes($tags){}


class MyGallery{
 	public  $parent;
 	public  $color;
	public  $filters;
	public  $type;
 	public	function __construct($parent) {
     	$this->parent = $parent;
   		$this->filters = array();
 	}
	public function add_to_filter($tags) {
		foreach ($tags as $key => $value) {
			if( strpos( $value , "_color" ) !== false ){
				if(strlen($value) != 6 ){
					if(!isset($this->color[$value])) {	
					 $this->color[$value] = array();
					 $this->color[$value]["type"] = str_replace("_color-", "", $value);;
					 $this->color[$value]["classtype"] = str_replace("_", "", $value);
					 $this->color[$value]["count"] = 1;
					}
					else
					{
						$this->color[$value]["count"] ++;
					}
				}
			}
			elseif( strpos( $value , "_type" )!== false ){
				if(strlen($value) != 5 ){
					if(!isset($this->type[$value])) {
						$this->type[$value] = array();
						$this->type[$value]["type"] = str_replace("_type-", "", $value);;
						$this->type[$value]["classtype"] = str_replace("_", "", $value);
						$this->type[$value]["count"] = 1;
					}
					else{
						$this->type[$value]["count"] ++;
					}
				}
			}

			else{
				if( !isset($this->filters[$value])) {	
					 $this->filters[$value] = array();
					 $this->filters[$value]["type"] = $value;
					 $this->filters[$value]["classtype"] = str_replace(" ", "-", $value);
					 $this->filters[$value]["count"] = 1;
				}
				else
				{
					$this->filters[$value]["count"] ++;
				}
			}
		}// end of foreach
	}
	
	public function find_color_tag($tags){}
 	public function print_filters() {
 		$filterString = "";
	 	foreach ($this->filters as $key => $value) {
	 		$filterString .= $value." ";
	 	}
	 	return $filterString;
 	}
 	public function get_filters(){
 		return $this->filters;
 	}
	public function get_colorfilters(){
		return $this->color;
	}
	public function get_typefilters(){
		return $this->type;
	}
  	

}



?>