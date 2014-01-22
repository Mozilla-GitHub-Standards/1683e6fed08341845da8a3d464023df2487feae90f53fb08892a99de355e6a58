/** @jsx React.DOM */
/* These are the React components we are using */

(function () {

var UI = window.UI = {};

UI.events = mixinEvents({});

var AvatarBlankWrapper = React.createClass({
  render: function () {
    var style = {};
    if (this.props.backgroundImage) {
      style.background = "url(" + this.props.backgroundImage + ")";
    }
    return (
      <div className="wrapper" key={this.props.key}>
        <div className="main" style={ style }>
          {this.props.children}
        </div>
      </div>
    );
  }
});

var AvatarWrapper = React.createClass({
  render: function () {
    return (
      <AvatarBlankWrapper backgroundImage={this.props.avatar} key={this.props.key}>
        <div className="username">
          {this.props.username}
        </div>
        <div className="overlay">
          <div className="row">
            <div className="container text-center">
              {this.props.children}
            </div>
          </div>
        </div>
      </AvatarBlankWrapper>
    );
  }
});

/* This is the avatar of yourself in the header */
var SelfAvatar = UI.SelfAvatar = React.createClass({
  render: function () {
    return (
      <AvatarWrapper avatar={this.props.avatar} username="me">
        <a href="#" className="btn btn-default btn-sm" role="button">
          Take photo
        </a>
        <a href="#" className="btn btn-default btn-sm" role="button">
          Settings
        </a>
        <a href="#" className="btn btn-default btn-sm" role="button">
          Profile
        </a>
      </AvatarWrapper>
    );
  }
});

/* This is the big invite button */
var InviteAvatar = UI.InviteAvatar = React.createClass({
  render: function () {
    return (
      <AvatarBlankWrapper key={this.props.key}>
        <div className="row">
          <div className="col-xs-12 text-center inviteNewperson">
            <button type="button" className="btn btn-default btn-sm">
              <span className="glyphicon glyphicon-plus-sign"></span> Invite
            </button>
          </div>
        </div>
      </AvatarBlankWrapper>
    );
  }
});

/* And then a blank space */
var BlankAvatar = UI.BlankAvatar = React.createClass({
  render: function () {
    return (
      <AvatarBlankWrapper key={this.props.key}>
        <div className="overlay">
          <div className="row">
          </div>
        </div>
      </AvatarBlankWrapper>
    );
  }
});


/* This is the avatar of anyone else */
var PeerAvatar = UI.PeerAvatar = React.createClass({
  render: function () {
    return (
      <AvatarWrapper avatar={this.props.avatar} key={this.props.key}
                     username={this.props.name}>
        <div className="col-xs-12">
          <a href="" className="btn btn-default btn-sm" role="button">
            Talk
          </a>
          <a href="" className="btn btn-default btn-sm" role="button">
            Profile
          </a>
          <a href="" className="btn btn-default btn-sm" role="button">
            Invite
          </a>
        </div>
      </AvatarWrapper>
    );
  }
});



var UserGrid = UI.UserGrid = React.createClass({
  getInitialState: function () {
    return {};
  },
  render: function () {
    var children = this.state.users || [];
    if (children.length < 4) {
      children.push(<InviteAvatar key="invite" />);
    }
    var blankId = 0;
    while (children.length < 4) {
      blankId++;
      children.push(<BlankAvatar key={ 'blank' + blankId }/>);
    }
    return (
      <div id="users">
        <div className="row">
          {children[0]}
          {children[1]}
        </div>
        <div className="row">
          {children[2]}
          {children[3]}
        </div>
      </div>
    );
  }
});

var Activity = React.createClass({
  render: function () {
    return (
      <li className="media" key={this.props.key}>
        <a className="pull-left" href="#">
          <div className="sm-avatar">
            <img className="media-object user-avatar" src={this.props.avatar} alt="" />
          </div>
        </a>
        <div className="media-body">
          {this.props.children}
        </div>
      </li>
    );
  }
});

var ID=0;

var Tooltip = React.createClass({
  componentDidMount: function() {
    // When the component is added, turn it into a modal
    $(this.getDOMNode()).tooltip();
  },
  render: function () {
    return this.props.children;
  }
});

/* This is a page visit activity */
var PageVisit = UI.PageVisit = React.createClass({
  clickSpectate: function () {
    UI.events.emit("spectate", this.props.page);
    return false;
  },
  render: function () {
    var joinLink = null;
    if (! this.props.page.tab.peer.isSelf) {
      joinLink = <Tooltip><a data-myid={this._myid} className="glyphicon glyphicon-eye-open pull-right spectate-page" href="#" title="Spectate on their page" data-toggle="tooltip" data-placement="left" onClick={this.clickSpectate}></a></Tooltip>;
    }
    return (
      <Activity name={this.props.name} avatar={this.props.avatar} key={this.props.page.id}>
        {joinLink}
        <h4 className="media-heading username">{this.props.name}</h4>
        is currently on <a target="_blank" className="current-location" href={this.props.page.url}>{this.props.page.title}</a>
      </Activity>
    );
  }
});

/* When a person joins */
var Join = UI.Join = React.createClass({
  render: function () {
    return (
      <Activity name={this.props.name} avatar={this.props.avatar} key={this.props.key}>
        <span className="timestamp pull-right" href="#">{moment(this.props.time).fromNow().max()}</span>
        <h4 className="media-heading username">{this.props.name}</h4>
        joined the session.
      </Activity>
    );
  }
});

/* When a person joins a page in presentation mode */
var JoinedMirror = UI.JoinedMirror = React.createClass({
  render: function () {
    return (
      <Activity name={this.props.name} avatar={this.props.avatar} key={this.props.key}>
        <span className="timestamp pull-right" href="#">{moment(this.props.time).fromNow().max()}</span>
        <h4 className="media-heading username">{this.props.name}</h4>
        joined you at <span>{this.props.tab.current().url}</span>
      </Activity>
    );
  }
});

/* When there is a chat */
var Chat = UI.Chat = React.createClass({
  render: function () {
    return (
      <Activity name={this.props.name} avatar={this.props.avatar} key={this.props.key}>
        <span className="timestamp pull-right" href="#">{moment(this.props.time).fromNow().max()}</span>
        <h4 className="media-heading username">{this.props.name}</h4>
        {this.props.text}
      </Activity>
    );
  }
});

var ActivityList = UI.ActivityList = React.createClass({
  getInitialState: function () {
    return {};
  },
  render: function () {
    var activities = this.state.activities || [];
    return (
      <div className="activity-stream">
        <div className="row">
          <div>
            <ul className="media-list">
              {activities}
            </ul>
          </div>
        </div>
      </div>
    );
  }
});

var ChatField = UI.ChatField = React.createClass({
  handleSubmit: function (event) {
    event.preventDefault();
    var node = this.refs.text.getDOMNode();
    var text = node.value;
    node.value = "";
    if (text) {
      this.props.onChatSubmit(text);
    }
  },
  render: function () {
    return (
      <div id="chat-field">
        <form className="input-group input-group" onSubmit={this.handleSubmit}>
          <input id="chat" type="text" className="form-control" ref="text" placeholder="Type here to chat to the group" />
          <span className="input-group-btn">
            <button className="btn btn-default" type="submit">Send</button>
          </span>
        </form>
      </div>
    );
  }
});



// Private Messages list
var PrivateMsgsList = UI.PrivateMsgsList = React.createClass({
  getInitialState: function () {
    return {};
  },
  render: function () {
    var privatemsgs = this.state.privatemsgs || [];
    return (
      <div className="activity-stream" id="private-messages-list">
        <div className="row">
          <div className="">
            <ul className="media-list">
              <li className="media">
                <a className="pull-left" href="#">
                  <div className="sm-avatar">
                    <img className="media-object user-avatar" src="" alt="" />
                  </div>
                </a>
                <div className="media-body">
                  <span className="timestamp pull-right" href="#">13 mins ago</span>
                  <h4 className="media-heading username">Gregg</h4>
                  "Ok that sounds good!"
                </div>
                <span className="glyphicon glyphicon-chevron-right pull-right chevron-icon"></span>
              </li>
              <li className="media">
                <a className="pull-left" href="#">
                  <div className="sm-avatar">
                    <img className="media-object user-avatar" src="" alt="" />
                  </div>
                </a>
                <div className="media-body">
                  <span className="timestamp pull-right" href="#">2 mins ago</span>
                  <h4 className="media-heading username">Ian</h4>
                  "What is this about?"
                </div>
                <span className="glyphicon glyphicon-chevron-right pull-right chevron-icon"></span>
              </li>
              <li className="media">
                <a className="pull-left" href="#">
                  <div className="sm-avatar">
                    <img className="media-object user-avatar" src="" alt="" />
                  </div>
                </a>
                <div className="media-body">
                  <span className="timestamp pull-right" href="#">5 mins ago</span>
                  <h4 className="media-heading username">Ilana</h4>
                  "Yeah I think I saw that page already."
                </div>
                <span className="glyphicon glyphicon-chevron-right pull-right chevron-icon"></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
});




})();
