<?php
/*
 * @version $Id: viewthread.hack.php 466 2010-12-24 06:53:23Z yaoying $
 */
if( !defined('IS_IN_XWB_PLUGIN') ){ exit('Access Denied!');}
global $_G;
$uids = array();
$sina_uid = array();

foreach ($GLOBALS['postlist'] as $key => $row) {
	$uids[] = (int)$row['authorid'];
	//签名替换
	$GLOBALS['postlist'][$key]['signature'] = isset($row['signature']) ? XWB_plugin::F('xwb_format_signature', $row['signature']) : '';
	
	if( $row['first'] && XWB_plugin::pCfg('is_rebutton_display') ){
		$this->viewthread_subject = $row['subject'];
	}
	
}

$sina_uid = XWB_plugin::F('sinaUidFilter', $uids);
