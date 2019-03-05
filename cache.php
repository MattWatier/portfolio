<?/**
* @desc Class that implements the Cache functionality 
*/
class Cache {
 
    /**
    * @desc Function read retrieves value from cache
    * @param $fileName - name of the cache file
    * Usage: Cache::read('fileName.extension')
    */
    function read($fileName) {
        $fileName = 'cache/'.$fileName;
        if (file_exists($fileName)) {
            $handle = fopen($fileName, 'rb');
            $variable = fread($handle, filesize($fileName));
            fclose($handle);
            return unserialize($variable);
        } else {
            return null;
        }
    }
     
    /**
    * @desc Function for writing key => value to cache
    * @param $fileName - name of the cache file (key)
    * @param $variable - value
    * Usage: Cache::write('fileName.extension', value)
    */
    function write($fileName,$variable) {
        $fileName = 'cache/'.$fileName;
        $handle = fopen($fileName, 'a');
        fwrite($handle, serialize($variable));
        fclose($handle);
    }
     
    /**
    * @desc Function for deleteing cache file
    * @param $fileName - name of the cache file (key)
    * Usage: Cache::delete('fileName.extension')
    */
    function delete($fileName) {
        $fileName = 'cache/'.$fileName;
        @unlink($fileName);
    }
 
}
?>