SELECT fragments_obj_to_tag.tagid as ID,
fragments_tags.name as name,
fragments_albums.title as ablum,
SUBSTRING( fragments_albums.folder, 1 ,LOCATE('/',fragments_albums.folder)-1) as parent,
COUNT(fragments_obj_to_tag.tagid) as count
FROM fragments_obj_to_tag
LEFT JOIN fragments_tags ON fragments_obj_to_tag.tagid = fragments_tags.id
LEFT JOIN fragments_images ON fragments_obj_to_tag.objectid = fragments_images.id
LEFT JOIN fragments_albums ON fragments_images.albumid = fragments_albums.id
WHERE LOCATE('_color',name)!= 1 
GROUP BY ID ORDER BY count DESC;