<?php

defined('IN_MOBIQUO') or exit;

require_once libfile('function/forumlist');

$sql = !empty($_G['member']['accessmasks']) ?
    "SELECT f.fid, f.fup, f.type, f.name, f.threads, f.posts, f.todayposts, f.lastpost, f.inheritedmod, f.domain,
        f.forumcolumns, f.simple, ff.description, ff.moderators, ff.icon, ff.viewperm, ff.redirect, ff.extra, ff.password, a.allowview
        FROM ".DB::table('forum_forum')." f
        LEFT JOIN ".DB::table('forum_forumfield')." ff ON ff.fid=f.fid
        LEFT JOIN ".DB::table('forum_access')." a ON a.uid='$_G[uid]' AND a.fid=f.fid
        WHERE f.status='1' ORDER BY f.type, f.displayorder"
    : "SELECT f.fid, f.fup, f.type, f.name, f.threads, f.posts, f.todayposts, f.lastpost, f.inheritedmod, f.domain,
        f.forumcolumns, f.simple, ff.description, ff.moderators, ff.icon, ff.viewperm, ff.redirect, ff.extra, ff.password
        FROM ".DB::table('forum_forum')." f
        LEFT JOIN ".DB::table('forum_forumfield')." ff USING(fid)
        WHERE f.status='1' ORDER BY f.type, f.displayorder";

$query = DB::query($sql);
$forum_root = array(0 => array('fid' => 0, 'child' => array()));
$forum_g = $froum_f = $forum_s = array();
while($forum = DB::fetch($query)) {
    
    if ($forum['type'] != 'group') {
        $forum_icon = $forum['icon'];
        if(forum($forum)) {
            $forum['icon'] = get_forumimg($forum_icon);
        } else {
            continue;
        }
    }
    
    switch ($forum['type'])
    {
        case   'sub': $forum_s[] = $forum; break;
        case 'group': $forum_g[] = $forum; break;
        case 'forum': $froum_f[] = $forum; break;
    }

}

foreach($forum_s as $s_forum) {
    insert_forum($froum_f, $s_forum);
}

foreach($froum_f as $f_forum) {
    insert_forum($forum_g, $f_forum);
}

foreach($forum_g as $g_forum) {
    if ($g_forum['child']) {
        insert_forum($forum_root, $g_forum);
    }
}

$forum_tree = $forum_root[0]['child'];

function insert_forum(&$forum_ups, $forum)
{
    global $_G;
    
    $board_url = $_G['setting']['discuzurl'].'/';
    $url_parse = parse_url($board_url);
    $site_url = $url_parse['scheme'].'://'.$url_parse['host'].(isset($url_parse['port']) && $url_parse['port'] ? ":$url_parse[port]" : '');
    
    if ($forum['type'] == 'group' && !isset($forum['child'])) return;
    
    foreach($forum_ups as $id => $forum_up)
    {
        if ($forum_up['fid'] == $forum['fup'])
        {
            $forum_id = $forum['fid'];
            $logo_url = '';
            if (file_exists("./forum_icons/$forum_id.png"))
            {
                $logo_url = $boardurl."forum_icons/$forum_id.png";
            }
            else if (file_exists("./forum_icons/$forum_id.jpg"))
            {
                $logo_url = $boardurl."forum_icons/$forum_id.jpg";
            }
            else if (file_exists("./forum_icons/default.png"))
            {
                $logo_url = $boardurl."forum_icons/default.png";
            }
            else if ($forum['icon'])
            {
                if (preg_match('/^http/', $forum['icon']))
                {
                    $logo_url = $forum['icon'];
                }
                else if (preg_match('/^\//', $forum['icon']))
                {
                    $logo_url = $site_url.$forum['icon'];
                }
                else
                {
                    $logo_url = $board_url.$forum['icon'];
                }
            }
            
            $subforumonly = $forum['simple'] & 1;
            
            $xmlrpc_forum = new xmlrpcval(array(
                'forum_id'      => new xmlrpcval($forum['fid'], 'string'),
                'forum_name'    => new xmlrpcval(basic_clean($forum['name']), 'base64'),
                'description'   => new xmlrpcval(basic_clean($forum['description']), 'base64'),
                'parent_id'     => new xmlrpcval($forum['fup'] ? $forum['fup'] : '-1', 'string'),
                'logo_url'      => new xmlrpcval($logo_url, 'string'),
                'is_protected'  => new xmlrpcval($forum['password'] ? true : false, 'boolean'),
                'url'           => new xmlrpcval('', 'string'),
                'sub_only'      => new xmlrpcval(($forum['type'] == 'group' || $subforumonly) ? true : false, 'boolean'),
             ), 'struct');

            if (isset($forum['child']))
            {
                $xmlrpc_forum->addStruct(array('child' => new xmlrpcval($forum['child'], 'array')));
            }

            $forum_ups[$id]['child'][] = $xmlrpc_forum;
            continue;
        }
    }
}