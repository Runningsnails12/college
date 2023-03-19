import React, { memo, useState, useRef, useEffect } from 'react';
import { useUpdateEffect } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { Button, Input, message, Tabs, TabsProps } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import adapter from 'webrtc-adapter';
//@ts-ignore
import Janus from '@/utils/Janus.js';
import useStore from '@/store';
import styles from './index.module.scss';
import Chat from './Chat';
import OnLine from './OnLine';
import type { UserStore } from '@/store/UserStore';

interface Janus {
  attach: Function;
}
interface videoRoomPluginHandle {
  send: Function;
  handleRemoteJsep: Function;
  createOffer: Function;
  hangup: Function;
}
interface Msg {
  videoroom: any;
  private_id: any;
  publishers: any;
  id: any;
  unpublished: any;
  leaving: any;
  reason: any;
  room: any;
  moderation: any;
  error_code: number;
}
export interface publisherListItem {
  id: string;
  display: any;
}
export interface userList {
  id: number;
  display: string;
  publisher: boolean;
  talking: boolean;
}
export interface ChatType {
  username: string;
  content: string;
}

function log(s: any) {
  console.log(s);
  message.warning(s);
}

function Live({
  isPublicer,
  userStore
}: {
  isPublicer: boolean;
  userStore: UserStore;
}) {
  const params = useParams();
  const user = {
    username: userStore.user.username,
    userId: userStore.user.id
  };
  const [isShowScreen, setIsShowScreen] = useState(false);

  const [bitrateTimer, setBitrateTimer] = useState(null);
  const u = useRef({
    janus: null as unknown as Janus,
    videoRoomPluginHandle: null as unknown as videoRoomPluginHandle,
    opaqueId: null
  });

  const roomNumber = Number(params.id) || Number(user.userId);

  const [data, setData] = useState({
    roomNumber: Number(params.id) || Number(user.userId), //房间号
    userList: [] as userList[],
    private_id: undefined, //janus分配ID
    streamMap: new Map(),
    publisherList: [] as publisherListItem[]
  });

  const [plugLoading, setPlugLoading] = useState(false);

  const [chatData, setChatData] = useState<ChatType[]>([]);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '聊天',
      children: <Chat data={chatData} sendMsg={sendMsg} />
    },
    {
      key: '2',
      label: '在线',
      children: <OnLine data={data.userList} kickOut={kickOut} />
    }
  ];

  function sendMsg(msg: string) {
    let message = {
      textroom: 'message',
      transaction: String(Date.now()),
      room: data.roomNumber,
      text: msg
    };
  }

  const out = () => {
    u.current.videoRoomPluginHandle.hangup();
  };

  useEffect(() => {
    initJanus();
    if (bitrateTimer) clearInterval(bitrateTimer);

    const timeinerval = setInterval(() => {
      plugLoading && getRoomUserList();
    }, 2000);

    return () => {
      log('链接关闭');
      u.current.videoRoomPluginHandle?.hangup();
      clearInterval(timeinerval);
    };
  }, [userStore.user.username]);

  useUpdateEffect(() => {
    !params.id &&
      createJanusRoom(data.roomNumber, 20, 500, null, '测试房间', joinRoom);
    params.id && joinRoom();

    setInterval(() => {
      getRoomUserList();
    }, 2000);
  }, [plugLoading]);

  function createJanusRoom(
    roomId: number,
    roomUserCount: number,
    bitrate: number,
    pin: number | null,
    desc: string,
    cb: Function
  ) {
    let create = {
      request: 'create',
      room: Number(roomId),
      bitrate: bitrate ? Number(bitrate) * 1000 : 300 * 1000,
      publishers: roomUserCount ? Number(roomUserCount) : 12, //参与人数
      description: desc,
      record: false, //（是否要录制这个房间，默认=false）
      rec_dir: '/home/janus-gateway/record/', //<文件夹应存储录音，启用时>
      permanent: false, //是否持久化
      audiolevel_event: false, //向其他用户发送事件
      audio_active_packets: 20 //音频级别的数据包数量，默认=100，2秒
      // audiolevel_event:true,
      // audiolevel_ext:true,
    };
    u.current.videoRoomPluginHandle.send({
      message: create,
      success: function (result: any) {
        console.log('创建房间', result);
        cb && cb();
      }
    });
  }
  function joinRoom() {
    const join = {
      request: 'join',
      room: data.roomNumber,
      // pin: "123",
      id: user.userId,
      ptype: 'publisher',
      display: user.username
    };
    u.current.videoRoomPluginHandle.send({
      message: join,
      success: function (res: any) {
        console.log(
          '正在加入会议室：' + data.roomNumber + ' 用户: ' + user.username
        );
      },
      error: function (err: any) {
        console.log('加入过程中出错', err);
      }
    });
  }
  function getRoomUserList() {
    u.current.videoRoomPluginHandle.send({
      message: {
        request: 'listparticipants',
        room: data.roomNumber
      },
      success: function (result: any) {
        data.userList = result.participants;
        setData({ ...data });
      }
    });
  }

  function initJanus() {
    Janus.init({
      debug: false,
      dependencies: Janus.useDefaultDependencies({
        adapter: adapter
      }),
      callback: () => {
        if (!Janus.isWebrtcSupported()) {
          log('不支持Webrtc');
          return;
        }
      }
    });
    // janus 注册并初始化
    u.current.janus = new Janus({
      server: 'http://8.134.130.41:18088/janus',
      apisecret: 'runningsnails',
      success: function () {
        log('初始化成功');
        initVideoRoomPlugin();
      },
      error: function (cause: any) {
        log(cause);
      }
    });
  }
  function initVideoRoomPlugin() {
    u.current.janus.attach({
      plugin: 'janus.plugin.videoroom',
      opaqueId: String(u.current.opaqueId),
      success: function (pluginHandle: any) {
        //插件初始化成功后 pluginHandle 就是全局句柄，通过 pluginHandle可以操作当前会话的所有功能
        u.current.videoRoomPluginHandle = pluginHandle;
        // log("会议插件初始化成功");
        setPlugLoading(true);
      },
      error: function (cause: any) {
        log(cause);
      },
      onmessage: function (msg: string, jsep) {
        console.log('msg', msg);
        onMessageForVideoRoom(msg, jsep);
      },
      onlocaltrack: function (track: MediaStreamTrack, added: boolean) {
        console.log('本地媒体', track, added);
        if (isPublicer && added) {
          setDomVideoTrick('localDomId', track);
        }
        if (isPublicer && added === true && track.label.includes('screen')) {
          setDomVideoTrick('multiStream', track);
        }
      }
    });
  }

  function onMessageForVideoRoom(msg: Msg, jsep) {
    const event = msg['videoroom'];
    if (jsep) {
      //设置远程应答描述
      u.current.videoRoomPluginHandle.handleRemoteJsep({ jsep: jsep });
    }
    switch (event) {
      case 'joined':
        data.private_id = msg['private_id'];
        isPublicer && publisherStream();
        //媒体发布者
        if (msg['publishers']) {
          //新加入房间获取媒体发布者
          const list = msg['publishers'];
          for (let publisher of list) {
            localPubDomPush(publisher['id'], publisher['display']);
            data.streamMap.set(publisher['id'], publisher);
            subscriberMedia(publisher);
          }
        }
        break;
      case 'talking':
        message.success(msg['id'] + '正在讲话');
        break;
      case 'event':
        if (msg['unpublished']) {
          console.log('用户' + msg['unpublished'] + '停止发布流');
        } else if (msg['leaving']) {
          if (msg['reason'] && msg['reason'] === 'kicked') {
            message.warning('您已被踢出房间');
            data.streamMap = new Map();
            setData({ ...data });
          } else if (!msg['reason']) {
            data.streamMap.delete(msg['leaving']);
            setData({ ...data });
            console.log('用户' + msg['leaving'] + '主动离开房间' + msg['room']);
          }
        } else if (msg['moderation'] && msg['moderation'] === 'muted') {
          console.log('用户' + msg['id'] + ' 已被禁言');
        } else if (msg['publishers']) {
          //已在房间用户监听到媒体变更
          const list = msg['publishers'];
          for (let publisher of list) {
            localPubDomPush(publisher['id'], publisher['display']);
            data.streamMap.set(publisher['id'], publisher);
            setData({ ...data });
            subscriberMedia(publisher);
          }
        } else if (msg['error_code']) {
          if (msg['error_code'] === 426) {
          }
        }
        break;
      default:
        break;
    }
  }
  function setDomVideoTrick(domId: string, trick: MediaStreamTrack) {
    let video = document.getElementById(domId) as HTMLVideoElement;
    let stream = video.srcObject as MediaStream;
    if (stream) {
      stream.addTrack(trick);
    } else {
      stream = new MediaStream();
      stream.addTrack(trick);
      video.srcObject = stream;
      video.controls = false;
      video.autoplay = true;
      // video.muted = false
      // video.style.width = '100%'
      // video.style.height = '100%'
    }
  }
  function publisherStream() {
    //send offer
    u.current.videoRoomPluginHandle.createOffer({
      tracks: [
        { type: 'audio', capture: true, recv: false },
        { type: 'video', capture: true, recv: false },
        { type: 'data' }
      ],
      success: function (jsep) {
        const publish = {
          request: 'configure',
          audio: true,
          video: true,
          restart: true
        };
        u.current.videoRoomPluginHandle.send({ message: publish, jsep: jsep });
      },
      error: function (error: any) {
        log('WebRTC error:' + error);
      }
    });
  }
  function localPubDomPush(id: string, display: publisherListItem[]) {
    let res = data.publisherList.filter((e) => e.id === id);
    if (res.length === 0) {
      data.publisherList.push({
        id: id,
        display: display
      });
    }
  }
  function subscriberMedia(user) {
    console.log('订阅用户信息', user);
    let publisherPlugin: any = null;
    let subscription: any[] = [];
    u.current.janus.attach({
      plugin: 'janus.plugin.videoroom',
      success: function (pluginHandle: any) {
        publisherPlugin = pluginHandle;
        let streams = user['streams'];
        for (let stream of streams) {
          // If the publisher is VP8/VP9 and this is an older Safari, let's avoid video
          if (
            stream.type === 'video' &&
            Janus.webRTCAdapter.browserDetails.browser === 'safari' &&
            (stream.codec === 'vp9' ||
              (stream.codec === 'vp8' && !Janus.safariVp8))
          ) {
            console.warn(
              'Publisher is using ' +
                stream.codec.toUpperCase +
                ", but Safari doesn't support it: disabling video stream #" +
                stream.mindex
            );
            continue;
          }
          subscription.push({
            feed: user['id'],
            mid: stream.mid //这里是可选项 如果不填则默认获取所有的流
          });
          publisherPlugin.rfid = user['id'];
          publisherPlugin.rfdisplay = user.display;
        }
        const subscribe = {
          request: 'join',
          use_msid: false, //订阅是否应包含引用发布者的 msid；默认为 false
          room: data.roomNumber,
          autoupdate: true, //离开房间是否自动发送sdp
          ptype: 'subscriber',
          streams: subscription, //新版本API指定流订阅
          private_id: data.private_id //Janus分配的用户ID 可选 除非房间配置一定要
        };
        publisherPlugin.send({ message: subscribe });
      },
      error: function (error: any) {
        log('插件加载异常' + error);
      },
      onmessage: function (msg: Msg, jsep) {
        console.log('订阅媒体发布者消息监听：', msg, jsep);
        const event = msg['videoroom'];
        if (jsep) {
          // Answer and attach
          publisherPlugin.createAnswer({
            jsep: jsep,
            tracks: [{ type: 'data' }],
            success: function (jsep) {
              Janus.debug('Got SDP!', jsep);
              var body = { request: 'start', room: data.roomNumber };
              publisherPlugin.send({ message: body, jsep: jsep });
            },
            error: function (error: any) {
              Janus.error('WebRTC error:', error);
            }
          });
        }
        switch (event) {
          case 'attached':
            console.log('订阅用户：' + user['display'] + ' 媒体信息成功');
            break;
          default:
            break;
        }
      },
      onremotetrack: function (track, mid, added) {
        let obj = {
          track: track,
          mid: mid,
          added: added,
          userId: user['id'],
          display: user['display'],
          trackKind: track['kind']
        };
        console.log('订阅媒体流变更信息 ：', obj);
        let mediaDomId = user['id'] + '-video';
        if (mid == '3' && added) {
          //谨记 这里我仅仅提供展示多个流的思路 自己的业务上有多个流具体更具业务容器定义
          setDomVideoTrick('multiStream', track);
          setIsShowScreen(true);
          return;
        }
        if (mid == '3' && !added) {
          //谨记 这里我仅仅提供展示多个流的思路 自己的业务上有多个流具体更具业务容器定义
          setIsShowScreen(false);
          return;
        }
        if (added) {
          setDomVideoTrick(mediaDomId, track);
        }
      },
      oncleanup: function () {
        console.log(
          ' ::: Got a cleanup notification: we are unpublished now :::'
        );
      }
    });
  }
  async function startShareScreen() {
    u.current.videoRoomPluginHandle.createOffer({
      tracks: [{ type: 'screen', add: true, capture: true }],
      success: function (jsep) {
        u.current.videoRoomPluginHandle.send({
          message: { request: 'configure', video: true },
          jsep: jsep
        });
        setIsShowScreen(true);
      },
      error: function (error) {
        log(error);
        // console.log('WebRTC error... ' + error.message);
      }
    });
  }

  function kickOut(row: number) {
    u.current.videoRoomPluginHandle.send({
      message: {
        request: 'kick',
        room: data.roomNumber,
        id: row.id
      },
      success: function (result) {
        console.log(result);
      }
    });
  }

  return (
    <div className={styles['live-page']}>
      <div className={styles['left']}>
        <video
          id="localDomId"
          height="500"
          muted
          style={{
            display: isShowScreen ? 'none' : 'block',
            objectFit: 'fill'
          }}
        ></video>
        <video
          id="multiStream"
          height="500"
          muted
          style={{
            display: isShowScreen ? 'block' : 'none',
            objectFit: 'fill'
          }}
        ></video>
        <Button onClick={startShareScreen}>分享屏幕</Button>
        <Button onClick={out}>退出</Button>
      </div>
      <div className={styles['right']}>
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </div>
  );
}
export default observer(Live);
