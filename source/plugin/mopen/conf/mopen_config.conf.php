<?php

defined('IN_MOPEN') or exit;

//ȫ�����ñ���
$mopen_config = array(
	'tpp' => 20,	//�����б�ҳĬ����ʾ����
	'ppp' => 20,	//��������ҳĬ����ʾ����
);
	
//��־���ȫ�ֱ���
$addTimeFormat = date("YmdH",$_SERVER['REQUEST_TIME']);
$mopen_log = array(
		'log_config' => array(
	    // ��־�������ã�0x07 = LOG_LEVEL_FATAL|LOG_LEVEL_WARNING|LOG_LEVEL_NOTICE
	    'intLevel'			=> 0x10,
	     // ��־�ļ�·����wf��־Ϊbingo.log.wf
	     'strLogFile'		=> MOPEN_ROOT.'./logs/'.$addTimeFormat.'.log',
	     // 0��ʾ����
	     'intMaxFileSize'    => 0,
	     // ������־·����������Ҫ��������
	     'arrSelfLogFiles'	=> array(),
	     ),
	 	'switch' => '0',   //�Ƿ���Զ�̵��Թ��ܣ�Ĭ�Ϲر�
	 	'context' => array(), //���ڴ洢Log������
);
// ������CLoggerʹ��
$GLOBALS['LOG'] = $mopen_log;

?>