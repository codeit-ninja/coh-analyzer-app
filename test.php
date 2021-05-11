<?php
/*
	This file was written by Corsix, no copyright is claimed.
 	The file is in the public domain; do with it what you wish.
 	
 	Updated November 16th 2006: Updated documentation and example code, patch 1.3 support, bugfixes
	10 April 2010 - Benneb: Made script compatible with COH patch 2.601
*/

// Manages a Company of Heroes .REC (replay) file
/*
	Create an instance of this class, then call loadFile() to parse a replay.
	See example.php for an example of it in use
*/
class CRecFile
{
	// ** Class variables (read them after loading a replay file with loadFile() )
	
	// The version number of the replay file format
	/*
		CoH 1.2 used a version of 2
		CoH 1.3 is using a version of 4
	*/
	var $m_replayVersion;
	
	// The name of the file loaded
	var $m_fileName;
	
	// The date and time the replay was recorded (local date/time of the recording user as a string)
	var $m_localDate;
	
	// A currently unknown date
	var $m_unknownDate;
	
	// The name given to the replay by the user who recorded it
	var $m_replayName;
	
	// SLOC, RSST and VPTK are stored in this array
	/*
		m_otherVariables["SLOC"] - Starting location (0 or 1. One of those is Random, the other is Set - we dont know which)
		m_otherVariables["RSST"] - Starting resources (0 or 1. One of those is Quickstart, the other is standard)
		m_otherVariables["VPTK"] - Related to the VP ticker
	*/
	var $m_otherVariables;
	
	// The name of the mod being run ("RelicCOH" is vanilla CoH)
	var $m_modName;
	
	// The name of the map being played (can be a Locale / .dat file reference number)
	var $m_mapName;
	
	// The blurb / description of the map being played (can be a Locale / .dat file reference number)
	var $m_mapDescription;
	
	// The filename of the map being played (eg. "DATA:scenarios\mp\2p_semois" - look in the SGA files)
	var $m_mapFileName;
	
	// The width of the map being played?
	var $m_mapWidth;
	
	// The height of the map being played?
	var $m_mapHeight;
	
	// An array storing player information
	/*
		Begins at 0 and goes up to $m_playerCount - 1.
		m_players[0]["name"] - The name of this player
		m_players[0]["race"] - The "race" of this player (eg. allies or axis)
		race will be either "Allied Rifle Company" or "Axis Infantry Company" (the second part does NOT mean which command tree was picked)
	*/
	var $m_players = array();
	
	// Is parser outputting debug information?
	/*
		Set to true and the parser will echo debugging information
		Set to false and the parser will not
		
		This does NOT indicate if CoH was being run in debug/dev mode
	*/
	var $m_debugMode;
	
	// ** Internally used I/O functions
	
	// Reads a 4 byte unsigned integer
	/*
		Used internally by the class to read a C/C++
		"unsigned long" (a 4 byte unsigned integer)
		from an open file
		
		$fh - the file handle from which to read
		returns - returns the value read; has no error return
	*/
	function read_UL4($fh)
	{
		$d = fread($fh, 4);
		$a = unpack("Vn", $d);
		return $a["n"];
	}
	
	// Reads a unicode string of specified length
	/*
		Used internally by the class to read a C/C++
		array of "wchar_t" (a 2 byte character)
		from an open file
		
		$fh - the file handle from which to read
		$len - the number of charatcers to read
		returns - returns the value read; has no error return
	*/
	function read_unistr($fh, $len)
	{
		$s = "";
		for($i = 0; $i < $len; ++$i)
		{
			$c = fread($fh, 1);
			if(ord($c) != 0) $s .= $c;
			fseek($fh, 1, SEEK_CUR);
		}
		return $s;
	}
	
	// Reads a string length and then the string
	/*
		Used internally by the class to read a 4 byte unsigned integer
		and then read a string that many characters in length
		
		$fh - the file handle from which to read
		returns - returns the string read (not the length read); has no error return
	*/
	function read_lenstr($fh)
	{
		$str_length = $this->read_UL4($fh);
		$s = fread($fh, $str_length);
		return $s;
	}
	
	// Reads a string length and then the unicode string
	/*
		Used internally by the class to read a 4 byte unsigned integer
		and then read a unicode string that many characters in length
		
		$fh - the file handle from which to read
		returns - returns the unicode string read (not the length read); has no error return
	*/
	function read_lenwstr($fh)
	{
		$str_length = $this->read_UL4($fh);
		$s = $this->read_unistr($fh, $str_length);
		return $s;
	}
	
	// ** loadFile() Helper functions
	
	// Reads a "chunk" of a Relic chunky file
	/*
		$fh - the file handle from which to read
		$level - 0 is a top level chunk, 1 is a chunk within a top level folder, 2 is a chunk within a level 1 chunk, etc.
		returns - true if it read a chunk, false if the end of file was reached
	*/
	function parseChunk($fh, $level)
	{
		$chunkType = fread($fh, 8);
		
		if( $this->m_debugMode )
		{
			for($i = 0; $i < $level; ++$i) echo "-";
			echo $chunkType;
		}
		
		if(strncmp($chunkType,"FOLD",4) != 0 && strncmp($chunkType,"DATA",4) != 0)
		{
			if( $this->m_debugMode ) echo "\n";
			fseek($fh, -8, SEEK_CUR);
			return false;
		}
		
		$chunkVersion = $this->read_UL4($fh);
		$chunkLength = $this->read_UL4($fh);
		$chunkNameLength = $this->read_UL4($fh);
		fseek($fh, 8, SEEK_CUR);
		$chunkName = $chunkNameLength > 0 ? fread($fh, $chunkNameLength) : "";
		
		if( $this->m_debugMode ) echo " V:" . $chunkVersion . "; L: " . $chunkLength . "; N:" . $chunkName . ";\n";
		
		$startPosition = ftell($fh);
		if(strncmp($chunkType,"FOLD",4) == 0)
		{
			while(ftell($fh) < ($startPosition + $chunkLength) ) $this->parseChunk($fh, $level + 1);
		}
		else
		{
			if($chunkType == "DATASDSC" && $chunkVersion == 2004)
			{
				$unknown = $this->read_UL4($fh);
				$this->m_unknownDate = $this->read_lenwstr($fh);
				$unknown = $this->read_UL4($fh);
				$unknown = $this->read_UL4($fh);
				$unknown = $this->read_UL4($fh);
				$this->m_modName = $this->read_lenstr($fh);
				$this->m_mapFileName = $this->read_lenstr($fh);
				$unknown = $this->read_UL4($fh);
				$unknown = $this->read_UL4($fh);
				$unknown = $this->read_UL4($fh);
				$unknown = $this->read_UL4($fh);
				$unknown = $this->read_UL4($fh);
				$this->m_mapName = $this->read_lenwstr($fh);
				$unknown = $this->read_UL4($fh);
				$this->m_mapDescription = $this->read_lenwstr($fh);
				$unknown = $this->read_UL4($fh);
				$this->m_mapWidth = $this->read_UL4($fh);
				$this->m_mapHeight = $this->read_UL4($fh);
				$unknown = $this->read_UL4($fh);
				$unknown = $this->read_UL4($fh);
				$unknown = $this->read_UL4($fh);
			}
			else if($chunkType == "DATABASE" && $chunkVersion == 11)
			{
				$unknown = $this->read_UL4($fh);
				$unknown = $this->read_UL4($fh);
				$unknown = $this->read_UL4($fh);
				
				$variableCount = $this->read_UL4($fh);
				for($i = 0; $i < $variableCount; ++$i)
				{
					$variableValue = $this->read_UL4($fh);
					$variableName = strrev(fread($fh, 4));
					$this->m_otherVariables[$variableName] = $variableValue;
				}
				
				$unknown = fread($fh, 1);
				$this->m_replayName = $this->read_lenwstr($fh);
				$unknown = $this->read_UL4($fh);
				$unknown = $this->read_UL4($fh);
				$unknown = $this->read_UL4($fh);
				$unknown = $this->read_UL4($fh);
				$unknown = $this->read_UL4($fh);
			}
			else if($chunkType == "DATAINFO" && $chunkVersion == 6)
			{   
                $currentPlayer = count($this->m_players);
                $this->m_players[$currentPlayer]["name"] = $this->read_lenwstr($fh);
                
                $unknown = $this->read_UL4($fh);
                $unknown = $this->read_UL4($fh);
                
                $this->m_players[$currentPlayer]["race"] = $this->read_lenstr($fh);
                
                $unknown = $this->read_UL4($fh);
                $unknown = $this->read_UL4($fh);
				
			}
			fseek($fh, $startPosition + $chunkLength, SEEK_SET);
		}
		
		return true;
	}
	
	// Reads a Relic Chunky section from a REC file
	/*
		$fh - the file handle from which to read
		returns - true on success, a string value on error
	*/
	function parseChunky($fh)
	{
		$chunkyHeader = fread($fh, 16);
		if(strncmp($chunkyHeader, "Relic Chunky", 12) != 0)
		{
			return "Chunky header \'" . $chunkyHeader . "\' is invalid";
		}
		
		$version = $this->read_UL4($fh);
		if($version != 3)
		{
			return "Chunky version " . $version . " not supported";
		}
		
		$unknown = $this->read_UL4($fh);
		
		$chunkHeaderLength = $this->read_UL4($fh);
		fseek($fh, $chunkHeaderLength - 28, SEEK_CUR);
		
		while($this->parseChunk($fh, 0));
		return true;
	}
	
	// ** Class functions
	
	function CRecFile()
	{
		$this->m_debugMode = false;
		$this->m_replayVersion = -1;
		$this->m_fileName = "";
		$this->m_localDate = "";
		$this->m_unknownDate = "";
		$this->m_replayName = "";
		$this->m_modName = "";
		$this->m_mapName = "";
		$this->m_mapDescription = "";
		$this->m_mapFileName = "";
		$this->m_mapWidth = -1;
		$this->m_mapHeight = -1;
		$this->m_players = array();
		$this->m_otherVariables = array();
	}
	
	// Loads a REC file
	/*
		$fileName - the name of a file to open
		returns - true on success, a string value on error (use $ret === true to test for success or failure)
	*/
	function loadFile($fileName)
	{
		$this->m_fileName = $fileName;
		
		$handle = fopen($fileName, "rwb");
		if($handle)
		{
			$this->m_replayVersion = $this->read_UL4($handle);
			if($this->m_replayVersion != 8) // 7 = 2.6 patch
			{
				fclose($handle);
				return "Replay version " . $this->m_replayVersion . " not supported";
			}
			$fileHeader = fread($handle, 8);
			if($fileHeader != "COH__REC")
			{
				fclose($handle);
				return "File header \'" . $fileHeader . "\' is invalid";
			}
			
			$this->m_localDate = $this->read_unistr($handle, 16);
			$unknown = $this->read_unistr($handle, 16);
					
			$ret = $this->parseChunky($handle);
			if($ret == true) $ret = $this->parseChunky($handle);
			
			fclose($handle);
			return $ret;
		}
		else
		{
			return "Could not open file \'" . $fileName . "\'";
		}

	}
}

$test = new CRecFile();
$test->loadFile('C:\Users\Richard\Documents\My Games\Company of Heroes Relaunch\playback\temp.rec');
echo '<pre>';
print_r($test);
echo '</pre>';