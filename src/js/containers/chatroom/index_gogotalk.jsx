import React, { Component } from 'react';
import TkGlobal from 'TkGlobal';
import CoreController from 'CoreController';
import Input from './subpage/gogotalkInput';
import eventObjectDefine from 'eventObjectDefine';
import md5 from 'js-md5';
import sRoom from 'ServiceRoom';
import signal from 'ServiceSignalling';
import rename from 'TkConstant';
import $ from './scripts/jquery.qqFace.js';
import './static/css/reset.css';
import './static/css/index.css';

class ChatBox extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			index: '0',//设置聊天室的工具栏切换的是聊天还是提问的索引值
			chatUnread: 0,//显示未读聊天数量
			quizUnread: 0,//显示未读提问数量		
			chatList: [],
			quizList: [],
			role: true,//是否是巡课或者回放者,默认框不显示
			isBroadcast: TkGlobal.isBroadcast,
			isShowChat: false, //是否显示输入内容框
			gogotalkChatUnread:0
		};
		this.property = {
			publishState: 0,
			drawtype: false,
			raiseHand: undefined
		};
		this.ids = {
			teacherid: '',
			myid: ''
		};
		this.listernerBackupid = new Date().getTime() + '_' + Math.random();
	}
	componentDidMount() {
		const that = this;
		eventObjectDefine.CoreController.addEventListener(rename.EVENTTYPE.RoomEvent.roomConnected, that.handlerRoomConnected.bind(that), that.listernerBackupid); //监听房间连接事件
		eventObjectDefine.CoreController.addEventListener(rename.EVENTTYPE.RoomEvent.roomDelmsg, that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //监听roomDelmsg
		eventObjectDefine.CoreController.addEventListener(rename.EVENTTYPE.RoomEvent.roomParticipantJoin, that.handlerRoomParticipantJoin.bind(that), that.listernerBackupid); //监听用户加入
		eventObjectDefine.CoreController.addEventListener(rename.EVENTTYPE.RoomEvent.roomParticipantLeave, that.handlerRoomParticipantLeave.bind(that), that.listernerBackupid); //监听用户离开
		eventObjectDefine.CoreController.addEventListener(rename.EVENTTYPE.RoomEvent.roomTextMessage, that.handlerRoomTextMessage.bind(that), that.listernerBackupid);//监听服务器的广播聊天消息
		eventObjectDefine.CoreController.addEventListener(rename.EVENTTYPE.RoomEvent.roomUserpropertyChanged, that.handlerRoomUserpropertyChanged.bind(that), that.listernerBackupid);//监听学生权限变化
		eventObjectDefine.CoreController.addEventListener(rename.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController, that.handlerRoomPlaybackClearAll.bind(that), that.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令
		this.translate();
		this.emoji();

	};
	componentWillUnmount() {
		let that = this;
		eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
	}
	handlerRoomConnected() {
		const that = this;
		//bug有时teacherid是undefined
		that.ids.teacherid = Object.keys(sRoom.getTkRoom().getSpecifyRoleList(rename.role.roleChairman))[0];//获取老师的id
		that.ids.myid = sRoom.getTkRoom().getMySelf().id;
		that.setState({
			role: rename.hasRole.rolePatrol || rename.hasRole.rolePlayback //判断人物身份是否是巡课身份或者回放者身份，巡课、回放者不需要聊天框
		});
		that.enter(0, function () { return '' });//0代表聊天
		that.click(0, function () { return '' });

		that.enter(1, that.getQuizObj);//1代表提问
		that.click(1, that.getQuizObj);
	};
	handlerRoomDelmsg(delmsgDataEvent) {
		const that = this;
		let delmsgData = delmsgDataEvent.message;
		switch (delmsgData.name) {
			case "ClassBegin":
				if (CoreController.handler.getAppPermissions('endClassbeginRevertToStartupLayout')) { //是否拥有下课重置界面权限
					setTimeout(() => {
						that._resetChatList();
					}, 250);
				}
				break;
		}
	};
	handlerRoomParticipantJoin(roomEvent) {
		const that = this;
		if (roomEvent.user.role != 4) {//不是巡检员,才提醒
			let time = that.getSendTime(TkGlobal.playback, roomEvent.user.joinTs);
			that.notice(time, '<span class="limit-length diff-width">' + roomEvent.user.nickname + '</span><span class="action">' + TkGlobal.language.languageData.alertWin.call.prompt.joinRoom.stream.join.text + '</span>')
		}
	};
	handlerRoomParticipantLeave(roomEvent) {
		const that = this;
		if (roomEvent.user.role != 4) {//不是巡检员,才提醒
			let time = that.getSendTime(TkGlobal.playback, roomEvent.user.ts);
			that.notice(time, '<span class="limit-length diff-width">' + roomEvent.user.nickname + '</span><span class="action">' + TkGlobal.language.languageData.alertWin.call.prompt.joinRoom.stream.leave.text + '</span>');
		};
	};
	getLocalTime(nS) {//时间戳转为时间
		let now = new Date(parseInt(nS));
		let year = now.getFullYear();
		let month = now.getMonth() + 1;
		let date = now.getDate();
		let hour = now.getHours();
		let minute = now.getMinutes();

		return year + "/" + month + "/" + date + "   " + hour + ":" + minute;

	}
	getSendTime(playback, ts) {//获取当前时间或时间戳时间
		const that = this;
		let time;
		if (playback) {//是回放者
			time = that.getLocalTime(ts)

		} else {
			time = that.toTwo(new Date().getHours()) + ':' + that.toTwo(new Date().getMinutes());
		}
		return time;
	}
	handlerRoomTextMessage(param) {
		const that = this;
		let time = that.getSendTime(TkGlobal.playback, param.message.ts);
		let num = that.state.gogotalkChatUnread;
		if( !that.state.isShowChat ){
			that.setState({
				gogotalkChatUnread : ++num
			})
		}
		//客户端收到服务器来的广播聊天消息,添加到所有用户消息框里
		that.appendChatList(time, param.message.msg, param.message.type, param.user.nickname, param.user.id, param.user.role);
	};
	handlerRoomUserpropertyChanged(param) {
		const that = this;
		let userid = param.user.id;
		if (userid == that.ids.myid && userid != that.ids.teacherid && !TkGlobal.playback) {//只给我自己且不是教师并且不是回放者提醒消息
			let mediatype = param.message.publishstate;//音视频权限号码 gg
			let drawtype = param.user.candraw;//画笔权限
			let raisehand = param.message.raisehand;//举手
			if (raisehand != undefined) {
				that.property.raiseHand = raisehand;
			}

			let time = that.getSendTime(TkGlobal.playback, 0);

			if (mediatype != undefined) {
				if ((that.property.publishState == 3 && mediatype == 1) || (that.property.publishState == 2 && mediatype == 4)) {//视频取消
					that.notice(time, TkGlobal.language.languageData.alertWin.call.prompt.publishStatus.stream.videooff.text);
				}
				if ((that.property.publishState == 3 && mediatype == 2) || (that.property.publishState == 1 && mediatype == 4)) {//音频取消
					that.notice(time, TkGlobal.language.languageData.alertWin.call.prompt.publishStatus.stream.audiooff.text);
				}
				if ((that.property.publishState == 4 && mediatype == 1) || (that.property.publishState == 2 && mediatype == 3)) {//音频开启
					that.notice(time, TkGlobal.language.languageData.alertWin.call.prompt.publishStatus.stream.audioon.text);
				}
				if ((that.property.publishState == 4 && mediatype == 2) || (that.property.publishState == 1 && mediatype == 3)) {//'视频开启'
					that.notice(time, TkGlobal.language.languageData.alertWin.call.prompt.publishStatus.stream.videoon.text);
				}
				if (that.property.publishState == 0 && mediatype) {//点击上课，音视频都开启了,上台，提醒上台;老师取消学生举手
					that.notice(time, TkGlobal.language.languageData.alertWin.call.prompt.publishStatus.stream.yes_status_3.text);
				}

				if (mediatype == 0) {//下台 gg
					that.notice(time, TkGlobal.language.languageData.alertWin.call.prompt.publishStatus.stream.no_status_0.text);

				}

				that.property.publishState = mediatype;//将现有状态保存
			}

			if (drawtype != undefined) {
				if (param.user.publishstate) {//上台时才提醒
					if (drawtype != that.property.drawtype) {//涂鸦权限改变了才提醒
						if (drawtype) {//涂鸦权限
							that.notice(time, TkGlobal.language.languageData.alertWin.call.prompt.chat.literally.yes.text)
						} else {
							that.notice(time, TkGlobal.language.languageData.alertWin.call.prompt.chat.literally.no.text)
						}
						that.property.drawtype = drawtype;//将现有状态保存
					}
				} else {//下台时将涂鸦权限的初始值置为false，防止出现授权涂鸦后下台，上台时因默认无涂鸦权限而提醒取消涂鸦
					that.property.drawtype = false;//
				}
			}
		};
	};
	handlerRoomPlaybackClearAll() {
		this.setState({
			index: '0',//设置聊天室的工具栏切换的是聊天还是提问的索引值      
			chatList: [],
			quizList: [],
			role: rename.hasRole.rolePatrol || rename.hasRole.rolePlayback//是否是巡课或者回放者
		});
	};
	emoji() {//表情包插件调用
		//群聊表情
		$('.chat-part .emotion').qqFace({//人脸头像	
			assign: 'talk',//输入框id			
			title: ['开心', '色咪咪', '微笑', '纠结', '不开心', '大哭', '撅嘴', '么么哒']
		});
		$('.question-part .emotion').qqFace({//人脸头像	
			assign: 'quiz',//输入框id			
			title: ['开心', '色咪咪', '微笑', '纠结', '不开心', '大哭', '撅嘴', '么么哒']
		});
	}
	translate() {//翻译功能
		const appid = '20170517000048030';
		const key = 'JKrcizzIAo5OhDv1NDYy';
		//表情
		function richText(str) {

			let reg = /\<img src=\"data:image\/png;base64,.+\" border=\"0\"\>/g;
			let result = str.split(reg);
			return result;
		}
		$('.content-wrap').off('click');
		$('.content-wrap').on('click', '.translate', function (ev) {

			let query = $(ev.target).siblings('.user-sended').text();
			let queryAttr = richText(query);//文本数组

			let salt = new Date().getTime();

			let sign = md5(appid + query + salt + key);
			let to;
			if ((/[\u4e00-\u9fa5]/.test(query))) {
				to = 'en';
			} else {
				to = 'zh';
			}
			let request = {
				"q": query,
				"from": "auto",
				"to": to,
				"appid": appid,
				"salt": salt,
				"sign": sign
			};
			$.ajax({//跨域
				url: "https://fanyi-api.baidu.com/api/trans/vip/translate",
				data: request,
				dataType: 'jsonp',
				type: 'get',
				success: function (data) {
					if (data.trans_result) {
						$(ev.target).siblings('.user-sended').append('<p>' + data.trans_result[0].dst + '</p>');//将翻译结果添加到页面中
					}

				}
			})

			$(ev.target).prop('disabled', true);
		});
	}
	switchParent(code) {//聊天为0，提问为1，根据0 1 赋值父节点的class值,使得发送的信息添加到哪个父节点下
		let parentNode = '';
		switch (code) {
			case 0: parentNode = '.chat-part'; break;
			case 1: parentNode = '.question-part'; break;
			case 2: parentNode = '.chat-part'; break;
		}
		return parentNode;
	}
	switchRole(num) {//根据角色代码转换为字，跟在用户名后面，只需要老师和助教
		let person = '';
		switch (num) {
			case 0: person = '( ' + TkGlobal.language.languageData.videoContainer.sendMsg.tips.teacher + ' )'; break;
			case 1: person = '( ' + TkGlobal.language.languageData.videoContainer.sendMsg.tips.assistant + ' )'; break;
			default: ; break;
		}
		return person;
	}
	toTwo(num) {//时间个位数转十位数

		if (parseInt(num / 10) == 0) {
			return '0' + num;
		} else {
			return num;
		}
	}
	notice(time, who) {//通知消息
		let that = this;

		this.setState({
			chatList: that.state.chatList.concat([{
				time,
				who
			}])
		})

		let top = parseInt($('.chat-part .chat-list')[0].scrollHeight) - $('.chat-part .chat-list').height()
		$('.chat-part .chat-list').scrollTop(top)//将滚动条始终置底
	}
	replace_em(str) {//发送的表情代码正则转为图片

		str = str.replace(/\</g, '&lt;');
		str = str.replace(/\>/g, '&gt;');
		str = str.replace(/\n/g, '<br/>');

		if (str.indexOf('em') != -1) {

			str = str.replace(/\[em_([1-8]*)\]/g, function (str, str1) {
				return '<img src=' + require("./static/img/" + str1 + ".png") + ' border="0" />';
			})

		}

		return <span dangerouslySetInnerHTML={{ __html: str }} ></span>

	}
	appendChatList(time, strmsg, chatype, who, id, roleNum) {//添加聊天记录列表
		let that = this;

		let role = this.switchRole(roleNum);
		let msg = that.replace_em(strmsg);
		//如果是我自己 需要在用户名后跟着我字样
		if (chatype) {//提问
			that.setState({
				quizList: that.state.quizList.concat([
					{
						id,
						who,
						tips: id == that.ids.myid ? '( ' + TkGlobal.language.languageData.videoContainer.sendMsg.tips.me + ' )' : role,
						time,
						msg,
						styleName: id == that.ids.myid ? "isme" : ''

					}
				])
			});
			if (this.state.index != 1) {//只有当前选中的选项卡不是提问时才计数：记录未读消息数
				this.setState({
					quizUnread: parseInt(this.state.quizUnread) < 99 ? ++this.state.quizUnread : 99 + '+'
				})
			}
		} else {
			that.setState({
				chatList: that.state.chatList.concat([
					{
						id,
						who,
						tips: id == that.ids.myid ? '( ' + TkGlobal.language.languageData.videoContainer.sendMsg.tips.me + ' )' : role,
						time,
						msg,
						styleName: id == that.ids.myid ? "isme" : ''

					}
				])
			});
			if (this.state.index != 0) {//只有当前选中的选项卡不是聊天时才计数：记录未读消息数
				this.setState({
					chatUnread: parseInt(this.state.chatUnread) < 99 ? ++this.state.chatUnread : 99 + '+'
				})
			}
		}










		let parentNode = that.switchParent(chatype);



		let top = parseInt($(parentNode + ' .chat-list')[0].scrollHeight) - $(parentNode + ' .chat-list').height()
		$(parentNode + ' .chat-list').scrollTop(top)//将滚动条始终置底


	}
	optionTap(e) {//工具栏切换

		this.setState({
			index: e.target.id
		})
		switch (parseInt(e.target.id)) {
			case 0: this.setState({ chatUnread: 0 }); break;
			case 1: this.setState({ quizUnread: 0 }); break;
			default: ; break
		}

	}
	getQuizObj() {//提问时判断是否只向老师提问 并赋id
		const that = this;
		if ($('.only-teacher-see .filter-select').prop('checked')) {

			return that.ids.teacherid;
		}
		return '';
	}
	enter(code, getid) {//回车发送消息 公聊私聊封装
		const that = this;
		let parent = that.switchParent(code);
		$(parent).find('.input').off('keydown');
		$(parent).find('.input').on('keydown', function (ev) {

			if (ev.keyCode == 13) {

				if ($.trim($(this).val())) {
					let identity = getid();

					if (identity) {
						signal.sendTextMessage({ msg: $(this).val(), type: code }, identity);
						signal.sendTextMessage({ msg: $(this).val(), type: code }, that.ids.myid);
					} else {
						signal.sendTextMessage({ msg: $(this).val(), type: code });
					}

					ev.preventDefault();
					$(this).val('');
					$(this).parent().next().css('background', '#dddddd');
				}

			}
		})
	};
	click(code, getid) {//点击按钮发送消息 公聊私聊封装
		const that = this;
		let parent = that.switchParent(code);
		$(parent).find('.sendBtn').off('click');
		$(parent).find('.sendBtn').on('click', function () {
			if ($.trim($(parent).find('.input').val())) {

				let identity = getid();

				if (identity) {
					signal.sendTextMessage({ msg: $(parent).find('.input').val(), type: code }, identity);
					signal.sendTextMessage({ msg: $(parent).find('.input').val(), type: code }, that.ids.myid);
				} else {
					signal.sendTextMessage({ msg: $(parent).find('.input').val(), type: code });
				}

				$(parent).find('.input').val('');
				$(parent).find('.input').parent().next().css('background', '#dddddd')
			}
		})
	};
	/*重置聊天列表*/
	_resetChatList() {
		this.setState({
			index: '0',//设置聊天室的工具栏切换的是聊天还是提问的索引值
			chatUnread: 0,//显示未读聊天数量
			quizUnread: 0,//显示未读提问数量
			chatList: [],
			quizList: [],
		});
	};
	// 改变显示状态 gogotalk
	_isShowChatBox() {
		// let chatbox = this.state.isShowChat = !this.state.isShowChat;
		this.setState({
			isShowChat: true,
			gogotalkChatUnread: 0
		})
	}
	closeChatBox() {
		this.setState({
			isShowChat: false,
			gogotalkChatUnread: 0
		})
	}
	render() {
		const that = this;
		let tabs = [
			{
				name: 'chat',
				content: TkGlobal.language.languageData.videoContainer.sendMsg.tap.chat
			},
			{
				name: 'question',
				content: TkGlobal.language.languageData.videoContainer.sendMsg.tap.question
			}
		]
		let state = this.state.index;

		let chatbox = { opacity: this.state.isShowChat ? '1' : '0', height: this.state.isShowChat ? 'auto' : '0' };
		// gogotalk
		return (
			<div id={this.props.id} className={TkGlobal.playback ? "playback" : ""}   >

				<div className="options-wrap" style={{ display: this.state.isBroadcast ? "block" : "none" }}>
					<ul className="options" onClick={this.optionTap.bind(this)}>
						{

							tabs.map(function (value, index) {

								let isActive = index == parseInt(state) ? 'active-setting' : '';

								return <li key={index + ''} id={index + ''} className={value.name + ' ' + isActive} >
									{value.content}
									<span className={value.name + '-unread'}>
										{index ? that.state.quizUnread : that.state.chatUnread}

									</span>
								</li>


							})

						}
					</ul>
				</div>
				<div className="content-wrap gogotalk_warp">
					<section className="chat-part" style={{ display: this.state.index == '0' ? 'block' : 'none' }}>
						<div style={{ height: '100%' }}>
							<div className="chat_top_box" style={chatbox}>
								<div className="closeChat" onClick={this.closeChatBox.bind(this)}>&times;</div>
								<ul className="chat-list custom-scroll-bar">
									{
										this.state.chatList.map(function (value, index) {
											if (value.id) {
												return <li data-identify={value.id} key={index} className={value.styleName ? value.styleName : "teacherItem"}>
													<div className="user-msg-box clear-float">
														<div className="user-title">
															<span className="username"><span className="limit-length">{value.who}</span><span className="keywords"> {value.tips ? value.tips : ""} </span></span>
															<span className="send-time">{value.time}</span>
														</div>
														<div className="user-body">
															<div className="user-body-icon"></div>
															<div className="user-sended">{value.msg}</div>
															<button className="translate" style={{ display: TkGlobal.playback ? 'none' : '' }}></button>
														</div>

													</div>

												</li>
											} else {
												return <li className="notice" key={index}>
													<span className="send-time">{value.time}</span>
													<span className="the-msg" dangerouslySetInnerHTML={{ __html: value.who }}>
													</span>
												</li>
											}

										})
									}

								</ul>
							</div>
							<div className="input-box" style={{ display: this.state.role ? 'none' : 'inline-block' }}>
								<div className="chatNum">{this.state.gogotalkChatUnread }</div>
								<Input id="talk" isShowChat={this._isShowChatBox.bind(this)} />
							</div>
						</div>
					</section>
					<section className="question-part" style={{ display: this.state.index == '1' ? 'block' : 'none' }}>
						<div style={{ height: '100%' }}>
							<ul className="chat-list custom-scroll-bar">
								{
									this.state.quizList.map(function (value, index) {
										return <li data-identify={value.id} key={index} className={value.styleName ? value.styleName : ""}>
											<div className="user-msg-box clear-float">
												<div className="user-title">
													<span className="username"><span className="limit-length">{value.who}</span><span className="keywords">{value.tips ? value.tips : ""}</span></span>
													<span className="send-time">{value.time}</span>
												</div>
												<div className="user-body">
													<div className="user-sended" refs="user-sended">{value.msg}</div>
													<button className="translate" style={{ display: TkGlobal.playback ? 'none' : '' }} ></button>
												</div>
											</div>
										</li>
									})
								}
							</ul>
							<div className="input-box" style={{ display: this.state.role ? 'none' : 'inline-block' }}>
								<Input id="quiz" />
							</div>
						</div>
					</section>

				</div>

			</div>
		)
	};
};

export default ChatBox;
