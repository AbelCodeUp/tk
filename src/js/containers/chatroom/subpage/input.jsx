import React, { Component } from 'react';
import TkGlobal from 'TkGlobal';


class Input extends Component{
	constructor(props,context){
		super(props,context);
		
		this.state={
			value:'',
			isBroadcast:TkGlobal.isBroadcast
		
			
		}
		
	}
	addValue(e){
		this.setState({
			value:e.target.value
		})
	}
	
	appendChatList(e){//当按回车发送时将value置空，使得按钮变颜色
		let that=this;
		if(e.keyCode==13){
			that.msgEmpty(e);
		}
		
	}
	msgEmpty(e){//当点击发送按钮发送时将value置空，使得按钮变颜色
		this.setState({
			value:''
		})

		
	}
	render(){
		return(
			<div className="chat-subject">
				<div className="chat-input">
					
					<textarea id={this.props.id} style={{paddingRight:this.state.isBroadcast?'0.4rem':'0.1rem'}} placeholder={TkGlobal.language.languageData.videoContainer.sendMsg.inputText.placeholder}  onInput={this.addValue.bind(this)} onKeyDown={this.appendChatList.bind(this)} className="input" >
						
					</textarea>
					<div className="chat-accessory" style={{display:this.state.isBroadcast?'inline-block':'none'}}>
						<span className="left">
							<span className="emotion"></span>
						</span>
					</div>
				</div>
				<button className="sendBtn" style={{background:this.state.value?'#f03a0e':'#dddddd'}} onClick={this.msgEmpty.bind(this)}>{TkGlobal.language.languageData.videoContainer.sendMsg.sendBtn.text}</button>
			</div>
			
		)
	}
	
	
}

export default Input;